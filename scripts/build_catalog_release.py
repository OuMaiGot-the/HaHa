#!/usr/bin/env python3
"""Build a multi-chapter static learner catalog from repository packages.

Only packages with a supported schema and nonempty activities are published.
Individual package pages reuse the existing validated standalone release builder.
"""
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from scripts.build_public_release import build

def main():
    output = (ROOT / (sys.argv[1] if len(sys.argv) > 1 else "preview")).resolve()
    if output.exists() and any(output.iterdir()):
        raise SystemExit("Output directory must be empty: " + str(output))
    approved_only = "--approved-only" in sys.argv[2:]
    packages = []
    for source in sorted((ROOT / "content").glob("chapter-*/section-*/package.json")):
        try:
            data = json.loads(source.read_text(encoding="utf-8"))
            if not isinstance(data, dict) or not isinstance(data.get("activities"), list) or not data["activities"]:
                continue
            allowed_statuses = {"approved", "published"} if approved_only else {"draft", "review", "approved", "published"}
            if data.get("status") not in allowed_statuses:
                continue
            relative = source.parent.relative_to(ROOT / "content")
            target = output / "learn" / relative
            build(target, source)
            index = target / "index.html"
            index.write_text(index.read_text(encoding="utf-8").replace('data-package-url="', 'data-catalog-url="../../../index.html" data-package-url="'), encoding="utf-8")
            packages.append({
                "id": data.get("packageId", str(relative)),
                "chapter": data.get("chapter", relative.parts[0]),
                "subchapter": data.get("subchapter", relative.parts[1]),
                "activities": len(data["activities"]),
                "activityMetadata": [{k: a.get(k, "") for k in ("id", "objective", "difficulty")} for a in data["activities"]],
                "url": "learn/" + relative.as_posix() + "/index.html",
                "status": data.get("status"),
            })
        except (ValueError, KeyError, OSError) as exc:
            print("Skipping invalid package", source, exc, file=sys.stderr)
    if not packages:
        raise SystemExit("No publishable learning packages")
    output.mkdir(parents=True, exist_ok=True)
    (output / ".nojekyll").touch()
    (output / "catalog.json").write_text(json.dumps(packages, indent=2), encoding="utf-8")
    # No HTML is assembled from untrusted package strings. Browser renders textContent.
    shutil.copyfile(ROOT / "app" / "catalog.html", output / "index.html")
    shutil.copyfile(ROOT / "app" / "catalog.js", output / "catalog.js")
    shutil.copyfile(ROOT / "app" / "learning.js", output / "learning.js")
    for asset in ("study.js", "hub-copy.js", "hub.css", "hub-orbit.svg"):
        shutil.copyfile(ROOT / "app" / asset, output / asset)
    print(f"Published {len(packages)} packages in {len(set(p['chapter'] for p in packages))} chapters" + (" (approved only)" if approved_only else " (preview mode)"))

if __name__ == "__main__":
    main()
