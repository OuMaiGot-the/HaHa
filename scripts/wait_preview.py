"""Wait for the CI preview server to serve its catalog before browser testing."""
import json
import time
from urllib.error import URLError
from urllib.request import urlopen


def main():
    deadline = time.monotonic() + 20
    last_error = "No response"
    while time.monotonic() < deadline:
        try:
            with urlopen("http://127.0.0.1:8765/catalog.json", timeout=1) as response:
                catalog = json.load(response)
            if isinstance(catalog, list) and catalog:
                print("Preview catalog is ready.")
                return
            last_error = "Catalog is empty or invalid"
        except (URLError, OSError, ValueError) as error:
            last_error = str(error)
        time.sleep(0.2)
    raise SystemExit("Preview server did not become ready: " + last_error)


if __name__ == "__main__":
    main()
