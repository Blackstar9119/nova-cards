"""Nova – Hilfsintegration für die Nova Cards.

Die Integration ist modular aufgebaut: Jedes Modul in ``modules/`` bringt seine eigenen WebSocket-Befehle, HTTP-Views
und seinen eigenen Speicher mit. Beim Laden des Config-Eintrags werden alle Module aus ``const.MODULES`` eingerichtet,
beim Entladen wieder abgebaut. Erstes Modul: ``recipes`` (Rezepte für die Karte Nova Recipe Book).
"""

from __future__ import annotations

from importlib import import_module
import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv

from .const import DOMAIN, MODULES

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


def _module(name: str):
    return import_module(f".modules.{name}", __package__)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Alle Module einrichten."""
    hass.data.setdefault(DOMAIN, {})
    for name in MODULES:
        mod = await hass.async_add_import_executor_job(_module, name)
        await mod.async_setup_module(hass, entry)
        _LOGGER.debug("Nova: Modul %s geladen", name)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Alle Module abbauen."""
    for name in reversed(MODULES):
        mod = await hass.async_add_import_executor_job(_module, name)
        await mod.async_unload_module(hass, entry)
    hass.data.pop(DOMAIN, None)
    return True
