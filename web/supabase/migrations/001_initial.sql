-- ═══════════════════════════════════════════════════
-- Secrets of the University — Initial Database Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════

-- Subscribers (email captures from signup forms)
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lessons (24 lessons across 4 departments)
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL CHECK (department IN ('finance','health','careers','systems')),
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  teaser TEXT NOT NULL,
  content TEXT,
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User progress (which lessons have been completed)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Comments (per-lesson discussion threads)
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Push notification subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  keys JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- ═══════════════════════════════════════════════════
-- Row-Level Security Policies
-- ═══════════════════════════════════════════════════

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscribers: service role only (API route inserts)
CREATE POLICY "Service role manages subscribers" ON subscribers FOR ALL USING (true);

-- Lessons: anyone can read published lessons
CREATE POLICY "Anyone can read published lessons" ON lessons FOR SELECT USING (is_published = true);

-- User progress: users can read/write their own
CREATE POLICY "Users manage own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

-- Comments: anyone can read, authenticated can insert, owners can delete
CREATE POLICY "Anyone can read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Push subscriptions: users manage their own
CREATE POLICY "Users manage own push subscriptions" ON push_subscriptions FOR ALL USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════
-- Seed Data — 24 Lessons
-- ═══════════════════════════════════════════════════

INSERT INTO lessons (slug, department, code, title, teaser, sort_order) VALUES
-- Finance
('credit-score-decoded', 'finance', 'FIN 101', 'The credit score algorithm, decoded', 'The five inputs, what actually moves them, and the 30-day fixes most people never try.', 1),
('index-fund-wins', 'finance', 'FIN 102', 'Why your first index fund beats your best stock pick', 'The math of diversification, in plain English — and how to start with $50.', 2),
('negotiation-scripts', 'finance', 'FIN 103', 'Negotiation scripts that survive contact with HR', 'Word-for-word scripts for salary, bills, and rent — and the silence that does the heavy lifting.', 3),
('crypto-without-cult', 'finance', 'FIN 104', 'Crypto without the cult', 'What blockchains actually do, what the tickers mean, and how to size risk you can live with.', 4),
('tax-moves', 'finance', 'FIN 105', 'The tax moves hiding in plain sight', 'Deductions, retirement accounts, and timing tricks the form instructions won''t explain.', 5),
('reading-tickers', 'finance', 'FIN 106', 'Reading a market ticker like a native', 'Indexes vs. stocks, what 24h change really tells you, and why red days aren''t emergencies.', 6),
-- Health
('read-bloodwork', 'health', 'HLTH 101', 'How to read your own bloodwork', 'CBC, metabolic panel, lipids, thyroid — what each marker means, what the ranges hide, and when to push back.', 1),
('sleep-construction', 'health', 'HLTH 102', 'Sleep is not rest. It is construction.', 'Circadian architecture, REM debt, the adenosine cycle — and why the alarm clock is a saboteur.', 2),
('nutrition-no-cult', 'health', 'HLTH 103', 'Nutrition without the cult', 'Macros, micronutrients, glycemic load — stripped of ideology. What the meta-analyses actually say.', 3),
('anxiety-algorithm', 'health', 'HLTH 104', 'The anxiety algorithm, decoded', 'The HPA axis, cortisol feedback loops, vagal tone — your nervous system has settings. Learn them.', 4),
('exercise-medicine', 'health', 'HLTH 105', 'Exercise is medicine — literally', 'VO₂ max, Zone 2 training, the minimum effective dose. What moves the needle and what is noise.', 5),
('gut-speaks', 'health', 'HLTH 106', 'The gut speaks first', 'Microbiome, the enteric nervous system, short-chain fatty acids. Your second brain is not a metaphor.', 6),
-- Careers
('resume-survives-machine', 'careers', 'CAR 101', 'The résumé that survives the machine', 'Applicant tracking systems discard 75% of submissions before a human sees them. Format is doctrine.', 1),
('interview-answers', 'careers', 'CAR 102', 'Interview answers they actually remember', 'The STAR method is known. The version that lands — situation, tension, resolution — is not taught.', 2),
('salary-negotiation', 'careers', 'CAR 103', 'Salary negotiation: the silence after the number', 'Name a number and stop talking. The discomfort is the negotiation. Most people fill it — and lose.', 3),
('hidden-network', 'careers', 'CAR 104', 'The network no one tells you to build', 'Not LinkedIn connections. Not coffee chats. The five-person board of advisors you assemble quietly.', 4),
('cover-letters', 'careers', 'CAR 105', 'Cover letters that open doors', 'Three sentences. The problem they have. The proof you''ve solved it. The ask. Everything else is noise.', 5),
('ninety-day-rule', 'careers', 'CAR 106', 'The 90-day rule no manager explains', 'Reputation is set in the first quarter. What you do before you''re asked determines what you''re trusted with after.', 6),
-- Systems
('bill-to-law', 'systems', 'SYS 101', 'How a bill actually becomes a law — the unabridged version', 'Committees, riders, reconciliation, and the steps the civics textbook left out.', 1),
('reading-contracts', 'systems', 'SYS 102', 'Reading a contract like the party who wrote it', 'Indemnity clauses, arbitration traps, and the sentences that matter most.', 2),
('mapping-power', 'systems', 'SYS 103', 'The org chart is a lie — mapping real power', 'Informal networks, information brokers, and who actually decides.', 3),
('filing-government', 'systems', 'SYS 104', 'How to file anything with the government and have it work', 'Forms, deadlines, chain-of-custody — the bureaucratic survival guide.', 4),
('insurance-dictionary', 'systems', 'SYS 105', 'Insurance is a language — here is the dictionary', 'Premiums, deductibles, exclusions, and the words that determine payouts.', 5),
('algorithm-literacy', 'systems', 'SYS 106', 'How algorithms decide what you see, buy, and believe', 'Recommendation engines, ranking signals, and the invisible hand of code.', 6)
ON CONFLICT (slug) DO NOTHING;
