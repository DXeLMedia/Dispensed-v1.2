-- Step 1: Create the new table for social links

CREATE TABLE app_e255c3cdb5_social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_e255c3cdb5_user_profiles(user_id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE app_e255c3cdb5_social_links IS 'Stores social media links for user profiles.';

-- Step 2: Create the new table for tracks

CREATE TABLE app_e255c3cdb5_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES app_e255c3cdb5_user_profiles(user_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    artwork_url TEXT,
    track_url TEXT,
    duration TEXT, -- e.g., "3:45"
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE app_e255c3cdb5_tracks IS 'Stores individual tracks uploaded by DJs.';

-- Step 3: Set up Row Level Security (RLS) for the new tables

-- RLS for social_links
ALTER TABLE app_e255c3cdb5_social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public social links are viewable by everyone." ON app_e255c3cdb5_social_links FOR SELECT USING (true);
CREATE POLICY "Users can insert their own social links." ON app_e255c3cdb5_social_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own social links." ON app_e255c3cdb5_social_links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own social links." ON app_e255c3cdb5_social_links FOR DELETE USING (auth.uid() = user_id);

-- RLS for tracks
ALTER TABLE app_e255c3cdb5_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tracks are viewable by everyone." ON app_e255c3cdb5_tracks FOR SELECT USING (true);
CREATE POLICY "DJs can insert their own tracks." ON app_e255c3cdb5_tracks FOR INSERT WITH CHECK (auth.uid() = artist_id);
CREATE POLICY "DJs can update their own tracks." ON app_e255c3cdb5_tracks FOR UPDATE USING (auth.uid() = artist_id);
CREATE POLICY "DJs can delete their own tracks." ON app_e255c3cdb5_tracks FOR DELETE USING (auth.uid() = artist_id);


-- Step 4: Data Migration (Manual Step)
-- NOTE: A manual data migration script is required here to transfer existing data.
-- This script should be run before the columns are dropped.
-- Example logic:
-- - Unnest the 'socials' JSON from 'app_e255c3cdb5_dj_profiles' and 'app_e255c3cdb5_business_profiles' and insert into 'app_e255c3cdb5_social_links'.
-- - Unnest the 'portfolio_tracks' JSON from 'app_e255c3cdb5_dj_profiles' and insert into 'app_e255c3cdb5_tracks'.


-- Step 5: Drop the old JSON columns from the profile tables

ALTER TABLE app_e255c3cdb5_dj_profiles DROP COLUMN IF EXISTS socials;
ALTER TABLE app_e255c3cdb5_business_profiles DROP COLUMN IF EXISTS socials;
ALTER TABLE app_e255c3cdb5_dj_profiles DROP COLUMN IF EXISTS portfolio_tracks;
