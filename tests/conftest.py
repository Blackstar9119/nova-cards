"""Tests der Nova-Integration (custom_components/nova) mit pytest-homeassistant-custom-component."""

from pathlib import Path

import custom_components
import pytest

# Das Test-Plugin bringt ein eigenes Paket custom_components mit – unseres davor einhängen
custom_components.__path__ = [str(Path(__file__).resolve().parents[1] / "custom_components"), *custom_components.__path__]


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """custom_components/ aus dem Repo laden."""
    yield
