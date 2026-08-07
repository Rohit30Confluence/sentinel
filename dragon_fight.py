#!/usr/bin/env python3
"""
Dragon Fight - CLI edition with:
 - Shop delta lines and Recommended tags
 - Auto-stack consumables
 - Onboarding tutorial
 - Autosave before bosses and load last autosave
 - Local telemetry (telemetry.jsonl)
 - Simulation mode for playtesting (python3 dragon_fight.py simulate <N>)

Save as dragon_fight.py and run: python3 dragon_fight.py
"""
import random
import os
import time
import sys
import json
from datetime import datetime
from glob import glob

# Attempt to enable color support on Windows if colorama is available
try:
    import colorama
    colorama.init()
    _COLORAMA_AVAILABLE = True
except Exception:
    _COLORAMA_AVAILABLE = False

# --- Config ----------------------------------------------------------------
DEFAULT_INVENTORY_CAPACITY = 12
SAVE_GLOB = "dragon_save_*.json"
DEFAULT_SAVE_PREFIX = "dragon_save"
SHOP_REFRESH_COST = 10  # gold to refresh shop offers
MAX_ITEM_UPGRADES = 5
TELEMETRY_FILE = "telemetry.jsonl"
AUTOSAVE_PREFIX = "autosave"

# --- Terminal color helpers ------------------------------------------------
def supports_color():
    if os.getenv("NO_COLOR"):
        return False
    if sys.platform == "win32" and not _COLORAMA_AVAILABLE:
        return False
    return sys.stdout.isatty()

USE_COLOR = supports_color()
if USE_COLOR:
    RESET = '\033[0m'
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BOLD = '\033[1m'
else:
    RESET = GREEN = RED = YELLOW = BOLD = ''

# --- Telemetry --------------------------------------------------------------
def log_event(event_type, details):
    """
    Append a JSON-lines telemetry event to TELEMETRY_FILE.
    details should be serializable.
    """
    try:
        entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "event": event_type,
            "details": details
        }
        with open(TELEMETRY_FILE, "a") as f:
            f.write(json.dumps(entry) + "\n")
    except Exception:
        # Telemetry should not crash the game; ignore errors
        pass

# --- Utility functions -----------------------------------------------------
def clear():
    os.system('cls' if os.name == 'nt' else 'clear')

def slow_print(s, delay=0.01):
    for ch in s:
        sys.stdout.write(ch)
        sys.stdout.flush()
        time.sleep(delay)
    print()

def prompt_choice(prompt, choices):
    choice = ''
    choices_l = [c.lower() for c in choices]
    while choice not in choices_l:
        try:
            choice = input(prompt).strip().lower()
        except (EOFError, KeyboardInterrupt):
            print()
            return None
    return choice

def list_saves():
    files = sorted(glob(SAVE_GLOB))
    return files

def default_save_filename(player_name):
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_name = "".join(c for c in player_name if c.isalnum() or c in "-_") or "Hero"
    return f"{DEFAULT_SAVE_PREFIX}_{safe_name}_{ts}.json"

def autosave_filename(player_name):
    safe = "".join(c for c in player_name if c.isalnum() or c in "-_") or "Hero"
    return f"{AUTOSAVE_PREFIX}_{safe}.json"

def read_int(prompt, minv=None, maxv=None):
    while True:
        val = input(prompt).strip()
        try:
            i = int(val)
            if (minv is not None and i < minv) or (maxv is not None and i > maxv):
                print("Out of range.")
                continue
            return i
        except ValueError:
            print("Please enter a number.")

# --- Items / Inventory / Shop ----------------------------------------------
class Item:
    def __init__(self, item_id, name, kind, price, stats=None, description=""):
        """
        kind: 'weapon', 'armor', 'accessory', 'consumable'
        stats: dict with keys depending on kind:
          weapon: {'atk': int}
          armor: {'defense': int, 'hp': int}
          accessory: {'crit': float, 'potions': int, 'atk': int, 'hp': int}
          consumable: {'heal': int, 'stackable': bool, 'count': int}
        """
        self.id = item_id
        self.name = name
        self.kind = kind
        self.price = int(price)
        self.stats = stats or {}
        self.description = description

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "kind": self.kind,
            "price": self.price,
            "stats": self.stats,
            "description": self.description
        }

    @staticmethod
    def from_dict(d):
        return Item(
            item_id=d.get("id"),
            name=d.get("name"),
            kind=d.get("kind"),
            price=int(d.get("price", 0)),
            stats=d.get("stats", {}),
            description=d.get("description", "")
        )

    def short(self):
        return f"{self.name} ({self.kind}) - {self.price}g"

# Basic item factory for shop/random generation
_item_counter = 0
def make_item(name, kind, price, stats=None, description=""):
    global _item_counter
    _item_counter += 1
    return Item(item_id=f"item{_item_counter}", name=name, kind=kind, price=price, stats=stats, description=description)

def generate_shop_offers(encounter_number, player_level):
    offers = []
    offers.append(make_item("Potion (x3)", "consumable", 12 + encounter_number, {"heal": 15, "count": 3, "stackable": True}, "Pack of 3 healing potions"))
    offers.append(make_item("Basic Sword", "weapon", 25 + encounter_number, {"atk": 2}, "A simple blade. +atk"))
    offers.append(make_item("Leather Armor", "armor", 28 + encounter_number, {"defense": 1, "hp": 6}, "Simple leather armor. +DEF"))
    offers.append(make_item("Lucky Charm", "accessory", 35 + encounter_number * 2, {"crit": 0.02}, "Increases critical chance slightly."))
    tier = max(1, encounter_number // 3 + player_level // 2)
    for i in range(3):
        choice = random.choice(['weapon', 'armor', 'accessory'])
        if choice == 'weapon':
            atk = random.randint(2 + tier, 4 + tier*2)
            price = 30 + atk * 8 + encounter_number * 2
            offers.append(make_item(f"Blade +{atk}", "weapon", price, {"atk": atk}, f"Weapon that gives +{atk} ATK"))
        elif choice == 'armor':
            defense = random.randint(1 + tier//2, 2 + tier)
            hp_bonus = random.randint(5 + tier, 12 + tier*2)
            price = 30 + defense * 10 + hp_bonus * 2 + encounter_number * 2
            offers.append(make_item(f"Mail +{defense}", "armor", price, {"defense": defense, "hp": hp_bonus}, f"Armor: +{defense} DEF, +{hp_bonus} HP"))
        else:
            a_type = random.choice(['crit','potions','atk','hp'])
            if a_type == 'crit':
                crit = round(0.02 + 0.01 * tier, 3)
                price = 30 + int(crit * 100)
                offers.append(make_item(f"Amulet (crit+{crit})", "accessory", price, {"crit": crit}, "Increases crit chance"))
            elif a_type == 'potions':
                pot = random.randint(1, 2 + tier//2)
                price = 25 + pot * 6
                offers.append(make_item(f"Potion Pack (+{pot})", "accessory", price, {"potions": pot}, "Adds extra potions to your inventory"))
            elif a_type == 'atk':
                atk = random.randint(1, 3 + tier//2)
                price = 28 + atk * 8
                offers.append(make_item(f"Token (ATK+{atk})", "accessory", price, {"atk": atk}, "Small ATK boost"))
            else:
                hp = random.randint(5, 15 + tier)
                price = 28 + hp * 2
                offers.append(make_item(f"Brooch (HP+{hp})", "accessory", price, {"hp": hp}, "Small HP boost"))
    if encounter_number % 5 == 0 and random.random() < 0.6:
        offers.append(make_item("Dragonbane Blade", "weapon", 120 + encounter_number*5, {"atk": 10 + encounter_number//4}, "Powerful weapon favored vs dragons"))
    return offers

# --- Character classes -----------------------------------------------------
class Character:
    def __init__(self, name, hp, atk, defense, crit=0.1):
        self.name = name
        self.max_hp = hp
        self.hp = hp
        self.atk = atk
        self.defense = defense
        self.crit = crit

    def is_alive(self):
        return self.hp > 0

    def take_damage(self, dmg):
        dmg_taken = max(0, dmg - self.defense)
        if dmg > 0 and dmg_taken == 0:
            dmg_taken = 1
        self.hp = max(0, self.hp - dmg_taken)
        return dmg_taken

    def heal(self, amount):
        self.hp = min(self.max_hp, self.hp + amount)
        return self.hp

class Player(Character):
    def __init__(self, name):
        super().__init__(name, hp=40, atk=8, defense=2, crit=0.12)
        self.potions = 3
        self.level = 1
        self.xp = 0
        self.gold = 0
        self.inventory = []
        self.inventory_capacity = DEFAULT_INVENTORY_CAPACITY
        self.equipment = {"weapon": None, "armor": None, "accessory": None}

    def effective_atk(self):
        base = self.atk
        w = self.equipment.get("weapon")
        if w and "atk" in w.stats:
            base += int(w.stats.get("atk", 0))
        a = self.equipment.get("accessory")
        if a and "atk" in a.stats:
            base += int(a.stats.get("atk", 0))
        return base

    def effective_defense(self):
        base = self.defense
        arm = self.equipment.get("armor")
        if arm and "defense" in arm.stats:
            base += int(arm.stats.get("defense", 0))
        return base

    def effective_max_hp(self):
        base = self.max_hp
        arm = self.equipment.get("armor")
        if arm and "hp" in arm.stats:
            base += int(arm.stats.get("hp", 0))
        acc = self.equipment.get("accessory")
        if acc and "hp" in acc.stats:
            base += int(acc.stats.get("hp", 0))
        return base

    def effective_crit(self):
        base = self.crit
        acc = self.equipment.get("accessory")
        if acc and "crit" in acc.stats:
            base += float(acc.stats.get("crit", 0))
        return base

    def attack_roll(self):
        base_atk = max(1, self.effective_atk())
        base = random.randint(max(1, base_atk - 3), base_atk + 3)
        if random.random() < self.effective_crit():
            return int(base * 1.8), True
        return base, False

    def add_item(self, item):
        # Auto-stack consumables with same name and stackable flag
        if item.kind == "consumable" and item.stats.get("stackable", False):
            for inv_item in self.inventory:
                if inv_item.kind == "consumable" and inv_item.name == item.name:
                    inv_item.stats["count"] = inv_item.stats.get("count", 1) + item.stats.get("count", 1)
                    log_event("pickup_stack", {"player": self.name, "item": item.name, "new_count": inv_item.stats["count"]})
                    return True
        if len(self.inventory) >= self.inventory_capacity:
            return False
        # store a copy to avoid aliasing external objects
        self.inventory.append(Item.from_dict(item.to_dict()))
        log_event("pickup", {"player": self.name, "item": item.name})
        return True

    def remove_item(self, item_id, count=1):
        for i, inv_item in enumerate(self.inventory):
            if inv_item.id == item_id:
                if inv_item.kind == "consumable" and inv_item.stats.get("stackable", False):
                    cur = inv_item.stats.get('count', 1)
                    if count >= cur:
                        self.inventory.pop(i)
                    else:
                        inv_item.stats['count'] = cur - count
                    return True
                else:
                    self.inventory.pop(i)
                    return True
        return False

    def equip_item(self, item_id):
        for i, inv_item in enumerate(self.inventory):
            if inv_item.id == item_id:
                slot = inv_item.kind
                if slot not in ["weapon", "armor", "accessory"]:
                    return False, "Item not equipable"
                cur = self.equipment.get(slot)
                if cur and len(self.inventory) >= self.inventory_capacity:
                    return False, "Not enough inventory space to unequip current gear"
                self.equipment[slot] = inv_item
                self.inventory.pop(i)
                if cur:
                    self.inventory.append(cur)
                self._sync_hp_with_max()
                log_event("equip", {"player": self.name, "item": inv_item.name, "slot": slot})
                return True, f"Equipped {inv_item.name} to {slot}"
        return False, "Item not found in inventory"

    def unequip_slot(self, slot):
        cur = self.equipment.get(slot)
        if not cur:
            return False, "Nothing equipped"
        if len(self.inventory) >= self.inventory_capacity:
            return False, "Inventory full"
        self.inventory.append(cur)
        self.equipment[slot] = None
        self._sync_hp_with_max()
        log_event("unequip", {"player": self.name, "item": cur.name, "slot": slot})
        return True, f"Unequipped {cur.name}"

    def _sync_hp_with_max(self):
        eff_max = self.effective_max_hp()
        if self.hp > eff_max:
            self.hp = eff_max

    def to_dict(self):
        return {
            "name": self.name,
            "max_hp": self.max_hp,
            "hp": self.hp,
            "atk": self.atk,
            "defense": self.defense,
            "crit": self.crit,
            "potions": self.potions,
            "level": self.level,
            "xp": self.xp,
            "gold": self.gold,
            "inventory_capacity": self.inventory_capacity,
            "inventory": [it.to_dict() for it in self.inventory],
            "equipment": {k: (v.to_dict() if v else None) for k,v in self.equipment.items()}
        }

    @staticmethod
    def from_dict(d):
        p = Player(d.get("name", "Hero"))
        p.max_hp = int(d.get("max_hp", p.max_hp))
        p.hp = int(d.get("hp", p.max_hp))
        p.atk = int(d.get("atk", p.atk))
        p.defense = int(d.get("defense", p.defense))
        p.crit = float(d.get("crit", p.crit))
        p.potions = int(d.get("potions", p.potions))
        p.level = int(d.get("level", p.level))
        p.xp = int(d.get("xp", p.xp))
        p.gold = int(d.get("gold", p.gold))
        p.inventory_capacity = int(d.get("inventory_capacity", DEFAULT_INVENTORY_CAPACITY))
        inv = d.get("inventory", [])
        p.inventory = [Item.from_dict(it) for it in inv]
        equip = d.get("equipment", {})
        p.equipment = {}
        for k in ["weapon", "armor", "accessory"]:
            v = equip.get(k)
            p.equipment[k] = Item.from_dict(v) if v else None
        p._sync_hp_with_max()
        return p

class Dragon(Character):
    def __init__(self, name="Ancient Dragon", hp=65, atk=10, defense=3, crit=0.08):
        super().__init__(name, hp=hp, atk=atk, defense=defense, crit=crit)
        self.moves = ['Claw Swipe', 'Tail Whip', 'Fire Breath', 'Roar']

    def choose_move(self):
        weights = [3, 3, 4 if self.hp > self.max_hp * 0.25 else 6, 2]
        return random.choices(self.moves, weights=weights, k=1)[0]

    def move_damage(self, move):
        if move == 'Claw Swipe':
            dmg = random.randint(max(1, self.atk - 2), self.atk + 2)
            crit = random.random() < self.crit
            return int(dmg * (1.8 if crit else 1.0)), crit, 'physical'
        if move == 'Tail Whip':
            dmg = random.randint(max(1, self.atk - 1), self.atk + 4)
            crit = random.random() < self.crit / 1.2
            return int(dmg * (1.6 if crit else 1.0)), crit, 'physical'
        if move == 'Fire Breath':
            dmg = random.randint(self.atk + 1, self.atk + 6)
            crit = random.random() < self.crit / 0.9
            return int(dmg * (2.0 if crit else 1.0)), crit, 'fire'
        if move == 'Roar':
            dmg = random.randint(1, 4)
            return dmg, False, 'status'
        return 0, False, 'physical'

# --- Game logic: dragons & encounters -------------------------------------
DRAGON_TYPES = [
    {"name":"Wyrmling", "base_hp":20, "base_atk":5, "base_def":1, "crit":0.05, "weight":6},
    {"name":"Drake", "base_hp":35, "base_atk":8, "base_def":2, "crit":0.06, "weight":5},
    {"name":"Wyvern", "base_hp":50, "base_atk":10, "base_def":3, "crit":0.07, "weight":3},
    {"name":"Ancient Dragon", "base_hp":85, "base_atk":13, "base_def":4, "crit":0.09, "weight":1},
]

def spawn_dragon(encounter_number, difficulty_multiplier, player_level):
    if encounter_number % 5 == 0:
        proto = next(dt for dt in DRAGON_TYPES if dt["name"]=="Ancient Dragon")
    else:
        names = [d["name"] for d in DRAGON_TYPES]
        weights = [d["weight"] for d in DRAGON_TYPES]
        chosen_name = random.choices(names, weights=weights, k=1)[0]
        proto = next(d for d in DRAGON_TYPES if d["name")==chosen_name)
