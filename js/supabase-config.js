/* ============================================================
   Mana-Properties – Supabase Configuration
   ============================================================
   FREE TIER SETUP (No credit card needed):
   1. Go to https://supabase.com → Sign up free
   2. Click "New Project" → name it "mana-properties"
   3. Wait ~2 minutes for the project to spin up
   4. Go to Settings → API → copy:
        • Project URL  → paste as SUPABASE_URL below
        • anon/public key → paste as SUPABASE_ANON_KEY below
   5. Run this SQL in the SQL Editor to create the profiles table:

      CREATE TABLE profiles (
        id         UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
        name       TEXT,
        phone      TEXT,
        photo_url  TEXT,
        role       TEXT DEFAULT 'user',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        saved_properties  JSONB DEFAULT '[]',
        posted_properties JSONB DEFAULT '[]'
      );
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Users can view own profile"   ON profiles FOR SELECT USING (auth.uid() = id);
      CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
      CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

   6. Authentication → Providers:
        • Email: already enabled by default
        • Google: enable → add Client ID & Secret from Google Cloud Console
        • Phone: enable → add Twilio/MessageBird credentials (optional)
   ============================================================ */

const SUPABASE_URL      = 'YOUR_SUPABASE_PROJECT_URL';   // e.g. https://xxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_PUBLIC_KEY';

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
