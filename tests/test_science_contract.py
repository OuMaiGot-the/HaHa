import unittest
from scripts.audit_science_contract import audit, collision_witness, known_claim_errors

class ScienceContractTests(unittest.TestCase):
    def test_exact_inelastic_counterexample(self):
        result = collision_witness()
        self.assertTrue(result["momentumConserved"])
        self.assertFalse(result["reversalRequired"])
        self.assertEqual(result["kineticEnergyRatio"], "5/8")

    def test_known_claims_rejected_in_each_locale(self):
        bad = {"id": "synthetic", "explanation": {
            "en": "Inelastic collisions always reverse both objects.",
            "ms": "Perlanggaran tak kenyal sentiasa membalikkan kedua-dua objek.",
            "zh": "非弹性碰撞总是使两个物体反向运动。"}}
        self.assertEqual(len(known_claim_errors(bad)), 3)
        self.assertFalse(known_claim_errors({"id": "correct", "feedback": {"en": "Reversal is not required."}}))

    def test_existing_packages_have_no_known_claim(self):
        result = audit()
        self.assertFalse(result["errors"])
        self.assertGreaterEqual(result["packages"], 15)
