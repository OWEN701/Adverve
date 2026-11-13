# Project memory

## Product intent & audience

- Public-facing website with a live chat widget and a contact form that collects visitor PII (name, email, phone, chat history).
- Backend is Supabase (Postgres + Edge Functions); frontend is Vite + React.

## Brand personality & voice

- Not yet inferred from current interactions.

## Visual design & UX direction

- Live chat widget is embedded in the website build; its UI details are not yet specified.

## Decisions, constraints & rationale

- Supabase migrations live in `supabase/migrations/` with filename format `YYYYMMDDHHMMSS_description.sql`.
- Sensitive tables (`chat_conversations`, `chat_messages`, `contact_submissions`) have RLS enabled with **no** `anon` or `authenticated` policies; all table privileges revoked from those roles.
- All reads/writes to those tables go exclusively through Edge Functions (`chat`, `contact-form`) using the service-role key.
- Deployment order constraint: new edge functions + matching website build must ship **before** the lockdown migration runs, or the chat widget stops saving conversations.
- Migration applied 20261113120000 locked down public access by dropping six existing permissive policies and adding rate-limit indexes on `created_at` for all three tables.
- User expects SQL migrations to be run verbatim without alteration and without touching unrelated tables/files/secrets; raw query results should be pasted directly.

## Open questions & assumptions

- Edge functions `chat` and `contact-form` are assumed to exist and correctly use the service role.
- The website build is assumed to call these edge functions rather than accessing tables directly with the anon key.
- No details yet on chat widget UX, contact form fields, or non-Supabase architecture.