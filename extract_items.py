import re
import json

with open("E:/hermes-workspace/zoo-pet-auto/game_source.js", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Tìm crops table wf
wf_idx = text.find("var wf={")
wf_end = text.find("};", wf_idx)
wf_code = text[wf_idx:wf_end+2]

crops = {}
for m in re.finditer(r"([a-zA-Z0-9_]+)\s*:\s*\{name:\s*`([^`]+)`", wf_code):
    crops[m.group(1)] = m.group(2)

print(f"Crops: {len(crops)}")

# 2. Tìm W table
idx = text.find("var W={")
end_idx = text.find("};", idx)
w_code = text[idx:end_idx+2]

items = {}
for m in re.finditer(r"([a-zA-Z0-9_]+)\s*:\s*\{([^}]+)\}", w_code):
    k = m.group(1)
    body = m.group(2)
    name_m = re.search(r"name\s*:\s*[`'\"]([^`'\"]+)[`'\"]", body)
    type_m = re.search(r"type\s*:\s*[`'\"]([^`'\"]+)[`'\"]", body)
    desc_m = re.search(r"desc\s*:\s*[`'\"]([^`'\"]+)[`'\"]", body)
    rare_m = re.search(r"rare\s*:\s*(!0|true)", body)
    legend_m = re.search(r"legend\s*:\s*(!0|true)", body)
    atk_m = re.search(r"atk\s*:\s*([0-9.]+)", body)
    def_m = re.search(r"def\s*:\s*([0-9.]+)", body)
    heal_m = re.search(r"heal\s*:\s*([0-9.]+)", body)
    
    name = name_m.group(1) if name_m else (crops.get(k, k))
    itype = type_m.group(1) if type_m else ("crop" if k in crops else "material")
    desc = desc_m.group(1) if desc_m else ""
    
    items[k] = {
        "id": k,
        "name": name,
        "type": itype,
        "desc": desc,
        "rare": bool(rare_m),
        "legend": bool(legend_m),
        "atk": float(atk_m.group(1)) if atk_m else None,
        "def": float(def_m.group(1)) if def_m else None,
        "heal": float(heal_m.group(1)) if heal_m else None,
    }

print(f"Total extracted items from W: {len(items)}")
from collections import Counter
type_counts = Counter(v["type"] for v in items.values())
print("Types:", type_counts)

# In danh sách tất cả các loại
print("\n--- CHI TIẾT THEO PHÂN LOẠI ---")
for t, cnt in type_counts.items():
    print(f"\n[PHÂN LOẠI: {t.upper()} - {cnt} món]")
    for k, v in items.items():
        if v["type"] == t:
            rarity = " [HUYỀN THOẠI]" if v["legend"] else (" [HIẾM]" if v["rare"] else "")
            stats_str = ""
            if v["atk"]: stats_str += f" Atk:{v['atk']}"
            if v["def"]: stats_str += f" Def:{v['def']}"
            if v["heal"]: stats_str += f" Heal:{v['heal']}"
            print(f"  • {k:20s}: {v['name']}{rarity}{stats_str} - {v['desc'][:60]}")
