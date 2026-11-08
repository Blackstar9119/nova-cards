"""Konstanten der Nova-Integration."""

DOMAIN = "nova"

# Module der Integration – jedes liegt in modules/<name>.py und hat async_setup_module / async_unload_module.
# Später kommen weitere dazu (Kartenauswahl, Benachrichtigungsleiste, Auslieferung der Karten-JS …).
MODULES: tuple[str, ...] = ("recipes",)
