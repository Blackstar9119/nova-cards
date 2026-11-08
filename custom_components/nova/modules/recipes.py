"""Nova-Modul „recipes“: Rezepte für die Karte Nova Recipe Book.

- Rezepte liegen in ``.storage/nova_recipes`` (über den Store von Home Assistant, kommt mit ins Backup).
- Bilder liegen in ``/config/www/nova-recipes/`` und werden über ``/local/nova-recipes/<datei>`` geladen.
- WebSocket-Befehle:
    ``nova/recipes/list``       → ``{"recipes": [...]}``
    ``nova/recipes/subscribe``  → sofort und nach jeder Änderung ``{"recipes": [...]}`` (alle Geräte bleiben gleich)
    ``nova/recipes/save``       ``{"recipe": {...}}`` – neu (ohne ``id``) oder ändern (mit ``id``) → ``{"recipe": {...}}``
    ``nova/recipes/delete``     ``{"recipe_id": "..."}`` – löscht Rezept und Bild
    ``nova/recipes/upload``     ``{"data": "<base64>", "content_type": "image/jpeg"}`` → ``{"url": "..."}`` (Ersatzweg)
- HTTP: ``POST /api/nova/recipes/image`` mit dem Bild als Body (Content-Type ``image/jpeg|png|webp``) → ``{"url": "..."}``
"""

from __future__ import annotations

import base64
import binascii
from dataclasses import dataclass, field
import logging
import os
import time
from typing import Any
import uuid

from aiohttp import web
import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.components.http import KEY_HASS, HomeAssistantView, StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from ..const import DOMAIN

_LOGGER = logging.getLogger(__name__)

STORAGE_KEY = "nova_recipes"
STORAGE_VERSION = 1
IMAGE_DIR = "nova-recipes"
IMAGE_URL = f"/local/{IMAGE_DIR}"
MAX_IMAGE_BYTES = 8 * 1024 * 1024
IMAGE_TYPES = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}
# Hochgeladene, aber nie gespeicherte Bilder (Formular abgebrochen) werden nach dieser Zeit beim Start aufgeräumt
ORPHAN_AGE = 24 * 3600

MAX_TITLE = 200
MAX_LINES = 200
MAX_LINE = 2000

_KEY = f"{DOMAIN}_recipes"


@dataclass
class RecipeData:
    """Laufzeitdaten des Moduls."""

    store: Store
    recipes: list[dict[str, Any]] = field(default_factory=list)
    listeners: set = field(default_factory=set)
    image_dir: str = ""


def _data(hass: HomeAssistant) -> RecipeData | None:
    return hass.data.get(DOMAIN, {}).get(_KEY)


# ---------- Einrichten / Abbauen ----------


async def async_setup_module(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Speicher laden, Bildordner anlegen, Befehle und View registrieren."""
    store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    raw = await store.async_load() or {}
    recipes = [r for r in (_clean(x, keep_meta=True) for x in raw.get("recipes", [])) if r]

    www = hass.config.path("www")
    image_dir = os.path.join(www, IMAGE_DIR)
    www_existed = await hass.async_add_executor_job(os.path.isdir, www)
    await hass.async_add_executor_job(lambda: os.makedirs(image_dir, exist_ok=True))

    hass.data.setdefault(DOMAIN, {})[_KEY] = RecipeData(store=store, recipes=recipes, image_dir=image_dir)

    # Befehle, View und Bildpfad gibt es nur einmal pro Laufzeit (auch nach Neuladen des Eintrags)
    if not hass.data.get(f"{_KEY}_registered"):
        hass.data[f"{_KEY}_registered"] = True
        for cmd in (ws_list, ws_subscribe, ws_save, ws_delete, ws_upload):
            websocket_api.async_register_command(hass, cmd)
        hass.http.register_view(RecipeImageView())
        # /local gibt es nur, wenn /config/www schon beim Start von HA existierte. Sonst den Bildordner selbst ausliefern.
        if not www_existed:
            await hass.http.async_register_static_paths([StaticPathConfig(IMAGE_URL, image_dir, False)])

    hass.async_create_background_task(_cleanup_orphans(hass), "nova_recipes_cleanup")


async def async_unload_module(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Speichern und Daten freigeben. Befehle bleiben registriert und melden dann „nicht geladen“."""
    data = _data(hass)
    if data is None:
        return
    await data.store.async_save({"recipes": data.recipes})
    for send in list(data.listeners):
        send(None)
    hass.data[DOMAIN].pop(_KEY, None)


# ---------- Daten ----------


def _lines(value: Any) -> list[str]:
    """Liste aus Zeilen: akzeptiert Liste oder Text (eine pro Zeile), leere Zeilen fallen weg."""
    if isinstance(value, str):
        value = value.splitlines()
    if not isinstance(value, list):
        return []
    out = [str(x).strip()[:MAX_LINE] for x in value if isinstance(x, (str, int, float))]
    return [x for x in out if x][:MAX_LINES]


def _clean(raw: Any, keep_meta: bool = False) -> dict[str, Any] | None:
    """Rezept prüfen und auf bekannte Felder beschränken."""
    if not isinstance(raw, dict):
        return None
    title = str(raw.get("title") or "").strip()[:MAX_TITLE]
    if not title:
        return None
    image = raw.get("image") or None
    # Nur eigene Bilder oder echte URLs zulassen – keine fremden Pfade ins Dateisystem
    if image is not None and not (isinstance(image, str) and (image.startswith(f"{IMAGE_URL}/") or image.startswith("https://"))):
        image = None
    recipe = {
        "id": str(raw.get("id") or "") or None,
        "title": title,
        "image": image,
        "ingredients": _lines(raw.get("ingredients")),
        "steps": _lines(raw.get("steps")),
    }
    if keep_meta:
        recipe["created"] = raw.get("created") or time.time()
        recipe["updated"] = raw.get("updated") or recipe["created"]
        if not recipe["id"]:
            recipe["id"] = uuid.uuid4().hex
    return recipe


def _file_of(data: RecipeData, url: str | None) -> str | None:
    """Pfad der Bilddatei zu einer /local/nova-recipes/-URL (ohne ?v=…), sonst None."""
    if not url or not url.startswith(f"{IMAGE_URL}/"):
        return None
    name = os.path.basename(url.split("?", 1)[0])
    if not name or name.startswith("."):
        return None
    return os.path.join(data.image_dir, name)


def _remove(path: str | None) -> None:
    if path and os.path.isfile(path):
        os.remove(path)


async def _remove_image(hass: HomeAssistant, data: RecipeData, url: str | None) -> None:
    """Bild löschen, wenn kein anderes Rezept es noch nutzt."""
    path = _file_of(data, url)
    if not path or any(_file_of(data, r.get("image")) == path for r in data.recipes):
        return
    await hass.async_add_executor_job(_remove, path)


async def _cleanup_orphans(hass: HomeAssistant) -> None:
    """Alte, keinem Rezept zugeordnete Bilder entfernen (z. B. nach abgebrochenem Formular)."""
    data = _data(hass)
    if data is None:
        return
    used = {_file_of(data, r.get("image")) for r in data.recipes}

    def run() -> int:
        n, now = 0, time.time()
        for name in os.listdir(data.image_dir):
            path = os.path.join(data.image_dir, name)
            if path in used or not os.path.isfile(path) or now - os.path.getmtime(path) < ORPHAN_AGE:
                continue
            os.remove(path)
            n += 1
        return n

    removed = await hass.async_add_executor_job(run)
    if removed:
        _LOGGER.info("Nova Rezepte: %s ungenutzte Bilder entfernt", removed)


async def _write_image(hass: HomeAssistant, data: RecipeData, body: bytes, content_type: str) -> str:
    """Bild speichern und seine URL liefern. Prüft Typ (auch am Dateianfang) und Größe."""
    ext = IMAGE_TYPES.get(content_type.split(";")[0].strip().lower())
    if not ext:
        raise ValueError("Nur JPEG, PNG oder WebP")
    if not body or len(body) > MAX_IMAGE_BYTES:
        raise ValueError("Bild ist leer oder größer als 8 MB")
    magic = {"jpg": body[:3] == b"\xff\xd8\xff", "png": body[:8] == b"\x89PNG\r\n\x1a\n", "webp": body[:4] == b"RIFF" and body[8:12] == b"WEBP"}
    if not magic[ext]:
        raise ValueError("Datei ist kein gültiges Bild")
    name = f"{uuid.uuid4().hex}.{ext}"

    def run() -> None:
        with open(os.path.join(data.image_dir, name), "wb") as f:
            f.write(body)

    await hass.async_add_executor_job(run)
    return f"{IMAGE_URL}/{name}"


@callback
def _changed(hass: HomeAssistant, data: RecipeData) -> None:
    """Speichern (gesammelt) und alle offenen Abos benachrichtigen."""
    data.store.async_delay_save(lambda: {"recipes": data.recipes}, 1)
    for send in list(data.listeners):
        send(data.recipes)


def _sorted(recipes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return sorted(recipes, key=lambda r: r["title"].casefold())


def _not_loaded(connection: websocket_api.ActiveConnection, msg: dict) -> None:
    connection.send_error(msg["id"], "not_loaded", "Die Nova-Integration ist nicht geladen")


# ---------- WebSocket ----------


@websocket_api.websocket_command({vol.Required("type"): "nova/recipes/list"})
@callback
def ws_list(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Alle Rezepte, nach Titel sortiert."""
    data = _data(hass)
    if data is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], {"recipes": _sorted(data.recipes)})


@websocket_api.websocket_command({vol.Required("type"): "nova/recipes/subscribe"})
@callback
def ws_subscribe(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Rezepte jetzt und nach jeder Änderung schicken."""
    data = _data(hass)
    if data is None:
        return _not_loaded(connection, msg)

    @callback
    def send(recipes: list | None) -> None:
        if recipes is None:  # Integration wird entladen
            connection.send_message(websocket_api.event_message(msg["id"], {"recipes": None}))
            return
        connection.send_message(websocket_api.event_message(msg["id"], {"recipes": _sorted(recipes)}))

    data.listeners.add(send)

    @callback
    def unsub() -> None:
        if (d := _data(hass)) is not None:
            d.listeners.discard(send)

    connection.subscriptions[msg["id"]] = unsub
    connection.send_result(msg["id"])
    send(data.recipes)


@websocket_api.websocket_command({vol.Required("type"): "nova/recipes/save", vol.Required("recipe"): dict})
@websocket_api.async_response
async def ws_save(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Rezept anlegen (ohne id) oder ändern (mit id)."""
    data = _data(hass)
    if data is None:
        return _not_loaded(connection, msg)
    recipe = _clean(msg["recipe"])
    if recipe is None:
        connection.send_error(msg["id"], "invalid", "Das Rezept braucht einen Titel")
        return
    now = time.time()
    old = next((r for r in data.recipes if r["id"] == recipe["id"]), None) if recipe["id"] else None
    if recipe["id"] and old is None:
        connection.send_error(msg["id"], "not_found", "Rezept nicht gefunden")
        return
    if old is None:
        recipe.update(id=uuid.uuid4().hex, created=now, updated=now)
        data.recipes.append(recipe)
    else:
        old_image = old.get("image")
        old.update(recipe, created=old.get("created", now), updated=now)
        recipe = old
        if old_image != recipe["image"]:
            await _remove_image(hass, data, old_image)
    _changed(hass, data)
    connection.send_result(msg["id"], {"recipe": recipe})


@websocket_api.websocket_command({vol.Required("type"): "nova/recipes/delete", vol.Required("recipe_id"): str})
@websocket_api.async_response
async def ws_delete(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Rezept samt Bild löschen."""
    data = _data(hass)
    if data is None:
        return _not_loaded(connection, msg)
    old = next((r for r in data.recipes if r["id"] == msg["recipe_id"]), None)
    if old is None:
        connection.send_error(msg["id"], "not_found", "Rezept nicht gefunden")
        return
    data.recipes.remove(old)
    await _remove_image(hass, data, old.get("image"))
    _changed(hass, data)
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): "nova/recipes/upload", vol.Required("data"): str, vol.Optional("content_type", default="image/jpeg"): str}
)
@websocket_api.async_response
async def ws_upload(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Ersatzweg für den Bild-Upload, wenn die Karte keinen HTTP-Upload kann (Bild als Base64)."""
    data = _data(hass)
    if data is None:
        return _not_loaded(connection, msg)
    try:
        body = base64.b64decode(msg["data"].split(",", 1)[-1], validate=True)
        url = await _write_image(hass, data, body, msg["content_type"])
    except (binascii.Error, ValueError) as err:
        connection.send_error(msg["id"], "invalid_image", str(err))
        return
    connection.send_result(msg["id"], {"url": url})


# ---------- HTTP ----------


class RecipeImageView(HomeAssistantView):
    """Bild-Upload: POST mit dem Bild als Body, nur für angemeldete Benutzer."""

    url = "/api/nova/recipes/image"
    name = "api:nova:recipes:image"
    requires_auth = True

    async def post(self, request: web.Request) -> web.Response:
        hass: HomeAssistant = request.app[KEY_HASS]
        data = _data(hass)
        if data is None:
            return self.json_message("Die Nova-Integration ist nicht geladen", 503)
        if request.content_length and request.content_length > MAX_IMAGE_BYTES:
            return self.json_message("Bild ist größer als 8 MB", 413)
        body = await request.read()
        try:
            url = await _write_image(hass, data, body, request.content_type or "")
        except ValueError as err:
            return self.json_message(str(err), 400)
        return self.json({"url": url})
