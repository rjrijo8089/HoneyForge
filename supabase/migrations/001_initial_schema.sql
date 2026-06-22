-- ============================================================
-- HoneyForge — Initial Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users (extended profile on top of Supabase Auth) ─────────
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'analyst', 'viewer')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Decoys ───────────────────────────────────────────────────
CREATE TABLE public.decoys (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                 TEXT NOT NULL,
  type                 TEXT NOT NULL,
  status               TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active','inactive','deploying','error')),
  ip_address           INET NOT NULL,
  port                 INTEGER NOT NULL CHECK (port BETWEEN 1 AND 65535),
  os                   TEXT,
  environment          TEXT NOT NULL DEFAULT 'prod',
  description          TEXT,
  tags                 TEXT[] DEFAULT '{}',
  interactions_count   INTEGER NOT NULL DEFAULT 0,
  last_interaction_at  TIMESTAMPTZ,
  created_by           UUID REFERENCES auth.users(id),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Threat Events ─────────────────────────────────────────────
CREATE TABLE public.threat_events (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  severity          TEXT NOT NULL CHECK (severity IN ('critical','high','medium','low','info')),
  status            TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','investigating','confirmed','false_positive','resolved')),
  source_ip         INET NOT NULL,
  source_port       INTEGER,
  target_decoy_id   UUID REFERENCES public.decoys(id),
  attack_type       TEXT NOT NULL,
  ttps              TEXT[] DEFAULT '{}',
  payload           TEXT,
  country_code      TEXT,
  country_name      TEXT,
  asn               TEXT,
  is_malicious      BOOLEAN NOT NULL DEFAULT true,
  confidence        SMALLINT NOT NULL DEFAULT 50 CHECK (confidence BETWEEN 0 AND 100),
  assigned_to       UUID REFERENCES auth.users(id),
  notes             TEXT,
  timestamp         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Detection Rules ──────────────────────────────────────────
CREATE TABLE public.detection_rules (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  type             TEXT NOT NULL CHECK (type IN ('sigma','yara','custom')),
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active','inactive','draft')),
  severity         TEXT NOT NULL CHECK (severity IN ('critical','high','medium','low')),
  description      TEXT,
  content          TEXT NOT NULL,
  tags             TEXT[] DEFAULT '{}',
  mitre_techniques TEXT[] DEFAULT '{}',
  hit_count        INTEGER NOT NULL DEFAULT 0,
  last_hit_at      TIMESTAMPTZ,
  created_by       UUID REFERENCES auth.users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Integrations ─────────────────────────────────────────────
CREATE TABLE public.integrations (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name               TEXT NOT NULL,
  type               TEXT NOT NULL CHECK (type IN ('siem','soar','threat_intel','ticketing','notification','custom')),
  status             TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('connected','disconnected','error','pending')),
  vendor             TEXT NOT NULL,
  description        TEXT,
  config             JSONB NOT NULL DEFAULT '{}',
  last_sync_at       TIMESTAMPTZ,
  events_forwarded   BIGINT NOT NULL DEFAULT 0,
  configured_by      UUID REFERENCES auth.users(id),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Reports ──────────────────────────────────────────────────
CREATE TABLE public.reports (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('executive','technical','threat_summary','compliance','custom')),
  status        TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('generating','ready','failed','scheduled')),
  format        TEXT NOT NULL CHECK (format IN ('pdf','csv','json')),
  period_start  DATE NOT NULL,
  period_end    DATE NOT NULL,
  file_size     BIGINT,
  file_path     TEXT,
  generated_at  TIMESTAMPTZ,
  scheduled_at  TIMESTAMPTZ,
  created_by    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Audit Logs ───────────────────────────────────────────────
CREATE TABLE public.audit_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES auth.users(id),
  user_email      TEXT NOT NULL,
  user_role       TEXT NOT NULL,
  action          TEXT NOT NULL,
  resource_type   TEXT NOT NULL,
  resource_id     UUID,
  resource_name   TEXT,
  details         JSONB NOT NULL DEFAULT '{}',
  ip_address      INET,
  user_agent      TEXT,
  success         BOOLEAN NOT NULL DEFAULT true,
  timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_threat_events_severity   ON public.threat_events(severity);
CREATE INDEX idx_threat_events_status     ON public.threat_events(status);
CREATE INDEX idx_threat_events_timestamp  ON public.threat_events(timestamp DESC);
CREATE INDEX idx_threat_events_decoy      ON public.threat_events(target_decoy_id);
CREATE INDEX idx_audit_logs_user_id       ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp     ON public.audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_action        ON public.audit_logs(action);
CREATE INDEX idx_decoys_status            ON public.decoys(status);

-- ── Row-Level Security ────────────────────────────────────────
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decoys          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detection_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs      ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read any profile, edit only their own
CREATE POLICY "profiles_read_all"  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_edit_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Everything else: authenticated users can read; writes are role-gated in app layer
CREATE POLICY "decoys_authenticated"    ON public.decoys          FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "threats_authenticated"   ON public.threat_events   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "rules_authenticated"     ON public.detection_rules FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "integ_authenticated"     ON public.integrations     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "reports_authenticated"   ON public.reports         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "audit_authenticated"     ON public.audit_logs       FOR ALL USING (auth.role() = 'authenticated');

-- ── Updated-at trigger ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_decoys_updated_at   BEFORE UPDATE ON public.decoys          FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_rules_updated_at    BEFORE UPDATE ON public.detection_rules  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles         FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
