/*
  # Lock down public access to chat and contact tables
  The original chat policies let the public (anon) key read and update every
  row in chat_conversations and chat_messages, so anyone with the key that
  ships in the website's JavaScript could download every visitor's name, email,
  phone and chat history.
  All reads and writes now go through the `chat` and `contact-form` edge
  functions, which use the service role. RLS stays enabled with no anon or
  authenticated policies, so the public key can no longer touch these tables.
  Deploy the new `chat` edge function and the matching website build BEFORE
  running this, or the live chat widget will stop saving conversations.
*/
DROP POLICY IF EXISTS "Anyone can create conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can view own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Anyone can create messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can view messages" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
-- Belt and braces: remove table privileges from the public roles too.
REVOKE ALL ON chat_conversations FROM anon, authenticated;
REVOKE ALL ON chat_messages FROM anon, authenticated;
REVOKE ALL ON contact_submissions FROM anon, authenticated;
-- Indexes for the rate-limit checks in the edge functions.
CREATE INDEX IF NOT EXISTS idx_chat_conversations_created_at ON chat_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);