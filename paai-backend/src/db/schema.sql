-- =========================================================
-- PAAI ISO 27001 Audit Platform — Database Schema
-- =========================================================

-- =========================================================
-- ISO Controls (seeded separately via seed.sql)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.controlos_iso (
  id          SERIAL PRIMARY KEY,
  codigo      VARCHAR(10) NOT NULL,
  titulo      TEXT NOT NULL,
  dominio     VARCHAR(100) NOT NULL,
  recomendacao TEXT
);

-- =========================================================
-- Companies (authenticated entities)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.companies (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  mfa_secret  VARCHAR(255),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- Audits
-- =========================================================
CREATE TABLE IF NOT EXISTS public.audits (
  id          SERIAL PRIMARY KEY,
  company_id  INTEGER NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  start_date  DATE DEFAULT CURRENT_DATE,
  end_date    DATE,
  status      VARCHAR(20) DEFAULT 'IN_PROGRESS'
                CHECK (status IN ('IN_PROGRESS', 'COMPLETED'))
);

-- =========================================================
-- Audit Responses
-- =========================================================
CREATE TABLE IF NOT EXISTS public.audit_responses (
  id          SERIAL PRIMARY KEY,
  audit_id    INTEGER NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  controlo_id INTEGER NOT NULL REFERENCES public.controlos_iso(id) ON DELETE CASCADE,
  compliant   BOOLEAN,
  observation TEXT,
  UNIQUE (audit_id, controlo_id)
);

-- =========================================================
-- Indexes
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_audits_company     ON public.audits(company_id);
CREATE INDEX IF NOT EXISTS idx_responses_audit    ON public.audit_responses(audit_id);
CREATE INDEX IF NOT EXISTS idx_responses_controlo ON public.audit_responses(controlo_id);
