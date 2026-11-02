"""Bounded source-free physics tripwires, not formal academic acceptance."""
from __future__ import annotations
import json
from fractions import Fraction as F
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def collision_witness():
    """An inelastic, non-sticking collision need not reverse either object."""
    before = (F(1), F(0))
    after = (F(1, 4), F(3, 4))
    assert sum(before) == sum(after)
    assert all(v > 0 for v in after)
    assert after[1] - after[0] == F(1, 2) * (before[0] - before[1])
    assert sum(v*v for v in after) == F(5, 8) * sum(v*v for v in before)
    return {"momentumConserved": True, "kineticEnergyRatio": "5/8", "reversalRequired": False}

def known_claim_errors(activity):
    """Reject only narrow universal claims; absence is not semantic approval."""
    forbidden = {
        "en": "inelastic collisions always reverse both objects",
        "ms": "perlanggaran tak kenyal sentiasa membalikkan kedua-dua objek",
        "zh": "非弹性碰撞总是使两个物体反向运动",
    }
    errors = []
    for field in ("prompt", "feedback", "explanation"):
        text = activity.get(field, {})
        if not isinstance(text, dict):
            continue
        for locale, phrase in forbidden.items():
            if phrase in str(text.get(locale, "")).casefold():
                errors.append(f"{activity.get('id', '?')}.{field}.{locale}: universal inelastic reversal claim")
    return errors

def audit(root=ROOT):
    errors = []
    packages = list((root / "content").glob("chapter-*/section-*/package.json"))
    for path in packages:
        data = json.loads(path.read_text(encoding="utf-8"))
        for activity in data.get("activities", []):
            errors.extend(known_claim_errors(activity))
    return {"packages": len(packages), "errors": errors, "witness": collision_witness(),
            "scope": "Known-claim regression and exact invariant witness only; not general scientific or translation approval."}

if __name__ == "__main__":
    result = audit()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(bool(result["errors"]))
