# Dragon Fight (CLI)

A small command-line turn-based game where you fight dragons, buy equipment, and upgrade your hero.

Features:
- Turn-based combat with Attack/Defend/Special/Potion/Flee
- Multiple encounters and dragon types (Wyrmling, Drake, Wyvern, Ancient Dragon)
- Inventory, equipment (weapon/armor/accessory), and consumables
- Shop with recommendations and stat delta preview
- Shopkeeper who upgrades or trades equipment
- Autosave before boss fights and optional onboarding tutorial
- Local telemetry (telemetry.jsonl) and simulation mode for playtesting

Getting started

1. Ensure you have Python 3.8+ installed.
2. Install optional dependency for colors on Windows: `pip install colorama`

Run the game:

```bash
python3 dragon_fight.py
```

Run a non-interactive simulation for playtesting (example, 500 runs):

```bash
python3 dragon_fight.py simulate 500
```

Telemetry

The game appends local telemetry events to `telemetry.jsonl` in the working directory. You can analyze this file to collect playtesting metrics.

Contributing

Pull requests welcome — see `docs/` for notes and the test suite under `tests/`.
