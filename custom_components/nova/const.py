"""Konstanten der Nova-Integration."""

DOMAIN = "nova"

# Module der Integration – jedes liegt in modules/<name>.py und hat async_setup_module / async_unload_module.
# static = Dateien unter /nova/static (Schriften), recipes = Rezepte. Später kommen weitere dazu (Kartenauswahl, Benachrichtigungsleiste …).
MODULES: tuple[str, ...] = ("static", "recipes")
