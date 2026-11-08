"""Verify the actual quota SQL concurrently and the self-contained deployment build."""
import concurrent.futures
from contextlib import closing
import importlib.util
import json
import sqlite3
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class TutorPilotTests(unittest.TestCase):
    def test_quota_is_atomic_persistent_and_does_not_store_identity(self):
        result = subprocess.run(['node', '--input-type=module', '-e',
            "import{ROLL_OVER_SQL,RESERVE_SQL}from './server/tutor-worker.mjs';console.log(JSON.stringify([ROLL_OVER_SQL,RESERVE_SQL]));"],
            cwd=ROOT, capture_output=True, text=True, check=True)
        rollover, reserve = json.loads(result.stdout)
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / 'budget.sqlite'
            with closing(sqlite3.connect(path)) as connection:
                connection.executescript((ROOT / 'server/drizzle/0000_tutor_budget.sql').read_text())

            def call(day='2026-11-09'):
                with closing(sqlite3.connect(path, timeout=10)) as connection, connection:
                    connection.execute('BEGIN IMMEDIATE')
                    connection.execute(rollover, (day,))
                    return bool(connection.execute(reserve, (day, 30)).fetchall())

            with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
                self.assertEqual(sum(pool.map(lambda _: call(), range(50))), 30)
            self.assertFalse(call())
            self.assertFalse(call('2026-11-08'), 'A clock rollback must not reset the cap')
            self.assertTrue(call('2026-11-10'))
            with closing(sqlite3.connect(path)) as connection:
                self.assertEqual(connection.execute('SELECT * FROM tutor_budget').fetchall(), [(1, '2026-11-10', 1)])
                self.assertEqual([r[1] for r in connection.execute('PRAGMA table_info(tutor_budget)')], ['slot', 'day', 'used'])

    def test_private_worker_build_has_all_assets_and_no_hub_migration(self):
        spec = importlib.util.spec_from_file_location('pilot_builder', ROOT / 'scripts/build_tutor_pilot.py')
        builder = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(builder)
        with tempfile.TemporaryDirectory() as temporary:
            output = Path(temporary) / 'pilot'
            count, size = builder.build(output, 'https://synthetic-pilot.chatgpt.site')
            self.assertGreater(count, 8)
            self.assertLess(size, 1_000_000)
            source = (output / 'dist/server/index.js').read_text(encoding='utf-8')
            self.assertIn('export default pilotWorker', source)
            self.assertNotIn("from '../", source)
            self.assertIn('/physics-notes/models.js', source)
            self.assertIn('Private tutor pilot', source)
            self.assertIn(builder.HUB + '/index.html', source)
            self.assertTrue((output / 'drizzle/meta/_journal.json').is_file())
            subprocess.run(['node', '--check', str(output / 'dist/server/index.js')], check=True, capture_output=True)
            with self.assertRaises(ValueError):
                builder.build(Path(temporary) / 'invalid', 'http://untrusted.invalid')
