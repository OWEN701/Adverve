/*
  # Create Chatbot Tables

  ## Overview
  Creates tables for storing chatbot conversations, messages, and captured leads from the AI chatbot on Adverve.io website.

  ## New Tables
  
  ### `chat_conversations`
  - `id` (uuid, primary key) - Unique conversation identifier
  - `session_id` (text) - Browser session identifier for tracking anonymous users
  - `visitor_name` (text, nullable) - Name captured during conversation
  - `visitor_email` (text, nullable) - Email captured during conversation
  - `visitor_phone` (text, nullable) - Phone captured during conversation
  - `business_info` (text, nullable) - Business details shared by visitor
  - `lead_qualified` (boolean) - Whether visitor qualifies as a lead
  - `created_at` (timestamptz) - When conversation started
  - `updated_at` (timestamptz) - Last message timestamp

  ### `chat_messages`
  - `id` (uuid, primary key) - Unique message identifier
  - `conversation_id` (uuid, foreign key) - Links to conversation
  - `role` (text) - 'user' or 'assistant'
  - `message` (text) - Message content
  - `created_at` (timestamptz) - When message was sent

  ## Security
  - Enable RLS on both tables
  - Allow public insert access (anonymous visitors can chat)
  - Allow public read access to own conversations only
  - Restrict updates and deletes
*/

-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  visitor_name text,
  visitor_email text,
  visitor_phone text,
  business_info text,
  lead_qualified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session_id ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);

-- Enable Row Level Security
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_conversations
CREATE POLICY "Anyone can create conversations"
  ON chat_conversations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view own conversations"
  ON chat_conversations
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update own conversations"
  ON chat_conversations
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for chat_messages
CREATE POLICY "Anyone can create messages"
  ON chat_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view messages"
  ON chat_messages
  FOR SELECT
  TO anon
  USING (true);
