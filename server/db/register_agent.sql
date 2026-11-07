-- Run as the database owner in Supabase SQL Editor AFTER the backend creates tables.
-- First register/confirm a regular Auth account. Replace BOTH values below.
-- This file is a manual provisioning template, never executed by application startup.
DO $$
DECLARE
    agent_email text := 'REPLACE_WITH_CONFIRMED_AUTH_EMAIL';
    agent_name text := 'REPLACE_WITH_COMPANY_OR_BANK_NAME';
    agent_type text := 'COMPANY'; -- COMPANY or BANK
    account_id uuid;
BEGIN
    IF agent_type NOT IN ('COMPANY', 'BANK') THEN
        RAISE EXCEPTION 'Agent type must be COMPANY or BANK';
    END IF;
    SELECT id INTO STRICT account_id FROM auth.users
    WHERE email = agent_email AND email_confirmed_at IS NOT NULL;
    INSERT INTO public.agents (id, name, type) VALUES (account_id, agent_name, agent_type);
END $$;
-- Verify: SELECT id, name, type FROM public.agents;
-- Desativar a identificação de agente:
-- UPDATE public.agents SET active = false WHERE id = 'AUTH_USER_UUID';
