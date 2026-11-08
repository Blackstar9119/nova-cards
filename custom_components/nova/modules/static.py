"""Nova-Modul „static“: liefert Dateien aus ``custom_components/nova/static/`` unter ``/nova/static/`` aus.

Zurzeit die Schriften des Rezeptbuchs (``fonts/``, Latin-Subset als woff2, SIL Open Font License). Die Karten laden sie
erst, wenn sie wirklich gebraucht werden (``@font-face`` – der Browser holt eine Schrift erst beim ersten Text darin).
Später kann hier auch die Karten-JS selbst ausgeliefert werden.
"""

from __future__ import annotations

import os

from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from ..const import DOMAIN

URL = "/nova/static"
_KEY = f"{DOMAIN}_static_registered"


async def async_setup_module(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Statischen Pfad einmal pro Laufzeit registrieren (Pfade lassen sich in HA nicht wieder abmelden)."""
    if hass.data.get(_KEY):
        return
    hass.data[_KEY] = True
    path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
    await hass.http.async_register_static_paths([StaticPathConfig(URL, path, True)])


async def async_unload_module(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Nichts zu tun."""
