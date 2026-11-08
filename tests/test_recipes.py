"""Rezept-Modul: Speichern, Ändern, Löschen, Abo, Bild-Upload (HTTP und WebSocket)."""

import base64
import os

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

JPEG = b"\xff\xd8\xff\xe0" + b"0" * 64


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    assert await async_setup_component(hass, "http", {})
    entry = MockConfigEntry(domain="nova", title="Nova", data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_save_list_delete(hass: HomeAssistant, hass_ws_client, hass_storage) -> None:
    await _setup(hass)
    ws = await hass_ws_client(hass)

    await ws.send_json({"id": 1, "type": "nova/recipes/subscribe"})
    assert (await ws.receive_json())["success"]
    assert (await ws.receive_json())["event"] == {"recipes": []}

    await ws.send_json({"id": 2, "type": "nova/recipes/save", "recipe": {"title": "  Pfannkuchen ", "ingredients": "Mehl\n\n2 Eier\n", "steps": ["Rühren", " "]}})
    res = await ws.receive_json()
    if "event" in res:
        res, ev = await ws.receive_json(), res
    else:
        ev = await ws.receive_json()
    assert res["success"], res
    rec = res["result"]["recipe"]
    assert rec["title"] == "Pfannkuchen" and rec["ingredients"] == ["Mehl", "2 Eier"] and rec["steps"] == ["Rühren"]
    assert ev["event"]["recipes"][0]["id"] == rec["id"]

    # Ändern, Bild mit fremdem Pfad wird verworfen
    await ws.send_json({"id": 3, "type": "nova/recipes/save", "recipe": {"id": rec["id"], "title": "Apfelpfannkuchen", "image": "/etc/passwd"}})
    msgs = [await ws.receive_json(), await ws.receive_json()]
    res = next(m for m in msgs if m.get("id") == 3 and m.get("type") == "result")
    assert res["result"]["recipe"]["image"] is None and res["result"]["recipe"]["created"] == rec["created"]

    await ws.send_json({"id": 4, "type": "nova/recipes/save", "recipe": {"title": ""}})
    assert (await ws.receive_json())["error"]["code"] == "invalid"
    await ws.send_json({"id": 5, "type": "nova/recipes/save", "recipe": {"id": "gibtsnicht", "title": "x"}})
    assert (await ws.receive_json())["error"]["code"] == "not_found"

    await ws.send_json({"id": 6, "type": "nova/recipes/list"})
    lst = await ws.receive_json()
    assert [r["title"] for r in lst["result"]["recipes"]] == ["Apfelpfannkuchen"]


    # delete ohne id → Schemafehler
    await ws.send_json({"id": 8, "type": "nova/recipes/delete"})
    assert not (await ws.receive_json())["success"]

    # beim Entladen wird sofort gespeichert (sonst gesammelt nach 1 s), nach dem Neuladen ist alles wieder da
    entry = hass.config_entries.async_entries("nova")[0]
    assert await hass.config_entries.async_unload(entry.entry_id)
    assert hass_storage["nova_recipes"]["data"]["recipes"][0]["title"] == "Apfelpfannkuchen"
    assert await hass.config_entries.async_setup(entry.entry_id)
    await ws.send_json({"id": 9, "type": "nova/recipes/list"})
    msg = await ws.receive_json()
    # das offene Abo meldet beim Entladen {"recipes": None} – die Karte zeigt dann den Hinweis
    assert msg["id"] == 1 and msg["event"] == {"recipes": None}
    msg = await ws.receive_json()
    assert msg["result"]["recipes"][0]["title"] == "Apfelpfannkuchen"

async def test_delete_and_images(hass: HomeAssistant, hass_ws_client, hass_client, tmp_path) -> None:
    hass.config.config_dir = str(tmp_path)
    await _setup(hass)
    ws = await hass_ws_client(hass)
    img_dir = tmp_path / "www" / "nova-recipes"
    assert img_dir.is_dir()

    # HTTP-Upload
    client = await hass_client()
    resp = await client.post("/api/nova/recipes/image", data=JPEG, headers={"Content-Type": "image/jpeg"})
    assert resp.status == 200, await resp.text()
    url = (await resp.json())["url"]
    assert url.startswith("/local/nova-recipes/") and (img_dir / os.path.basename(url)).is_file()

    # kein Bild / falscher Typ
    resp = await client.post("/api/nova/recipes/image", data=b"hallo", headers={"Content-Type": "image/jpeg"})
    assert resp.status == 400
    resp = await client.post("/api/nova/recipes/image", data=JPEG, headers={"Content-Type": "text/plain"})
    assert resp.status == 400

    # WebSocket-Upload
    await ws.send_json({"id": 1, "type": "nova/recipes/upload", "data": "data:image/jpeg;base64," + base64.b64encode(JPEG).decode()})
    url2 = (await ws.receive_json())["result"]["url"]

    await ws.send_json({"id": 2, "type": "nova/recipes/save", "recipe": {"title": "Kuchen", "image": url}})
    rid = (await ws.receive_json())["result"]["recipe"]["id"]
    # Bild tauschen → altes Bild weg
    await ws.send_json({"id": 3, "type": "nova/recipes/save", "recipe": {"id": rid, "title": "Kuchen", "image": url2}})
    assert (await ws.receive_json())["success"]
    await hass.async_block_till_done()
    assert not (img_dir / os.path.basename(url)).exists()
    # Löschen → Bild weg
    await ws.send_json({"id": 4, "type": "nova/recipes/delete", "recipe_id": rid})
    assert (await ws.receive_json())["success"]
    await hass.async_block_till_done()
    assert not (img_dir / os.path.basename(url2)).exists()


async def test_unload_and_reload(hass: HomeAssistant, hass_ws_client) -> None:
    entry = await _setup(hass)
    assert await hass.config_entries.async_unload(entry.entry_id)
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "nova/recipes/list"})
    assert (await ws.receive_json())["error"]["code"] == "not_loaded"
    assert await hass.config_entries.async_setup(entry.entry_id)
    await ws.send_json({"id": 2, "type": "nova/recipes/list"})
    assert (await ws.receive_json())["success"]


async def test_config_flow_single(hass: HomeAssistant) -> None:
    result = await hass.config_entries.flow.async_init("nova", context={"source": "user"})
    assert result["type"] == "form"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    assert result["type"] == "create_entry"
    result = await hass.config_entries.flow.async_init("nova", context={"source": "user"})
    assert result["type"] == "abort"
