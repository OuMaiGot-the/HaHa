CREATE TABLE tutor_budget (
  slot INTEGER PRIMARY KEY CHECK (slot = 1),
  day TEXT NOT NULL,
  used INTEGER NOT NULL DEFAULT 0 CHECK (used >= 0 AND used <= 30)
);
