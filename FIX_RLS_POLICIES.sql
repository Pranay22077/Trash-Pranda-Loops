-- Fix Row Level Security policies that might be blocking reads
-- Run this in Supabase SQL Editor

-- Allow anyone to read levels (they're public data)
DROP POLICY IF EXISTS "Anyone can view levels" ON public.levels;
CREATE POLICY "Anyone can view levels"
    ON public.levels FOR SELECT
    TO public
    USING (true);

-- Allow anyone to read achievements (they're public data)
DROP POLICY IF EXISTS "Anyone can view achievements" ON public.achievements;
CREATE POLICY "Anyone can view achievements"
    ON public.achievements FOR SELECT
    TO public
    USING (true);

-- Allow users to read their own progress
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
CREATE POLICY "Users can view own progress"
    ON public.user_progress FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Allow users to insert their own progress
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
CREATE POLICY "Users can insert own progress"
    ON public.user_progress FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own progress
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress"
    ON public.user_progress FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('levels', 'achievements', 'user_progress')
ORDER BY tablename, policyname;
