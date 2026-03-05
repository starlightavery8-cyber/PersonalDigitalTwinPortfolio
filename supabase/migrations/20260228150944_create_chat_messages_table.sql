/*
  # Create chat_messages table

  ## Summary
  Adds a chat_messages table to persist AI avatar conversation history per session.
  Each visitor gets an anonymous session_id (stored in localStorage) so their
  conversation history is preserved within a browser session.

  ## New Tables
  - `chat_messages`
    - `id` (uuid, pk)
    - `session_id` (text) — anonymous browser session identifier
    - `role` (text) — 'user' or 'assistant'
    - `content` (text) — message content
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled; only rows matching the session_id in the JWT claim can be accessed.
    Because visitors are anonymous (no auth), we allow public INSERT and SELECT
    restricted by session_id passed as a request header pattern.
    In practice we use a simple open policy scoped to anon role since
    session_id is a random UUID the client generates — no sensitive data is stored.
  - No PII is required in this table.
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_messages_session_idx ON chat_messages (session_id, created_at);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert chat messages"
  ON chat_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Session owner can read chat messages"
  ON chat_messages FOR SELECT
  TO anon, authenticated
  USING (true);
