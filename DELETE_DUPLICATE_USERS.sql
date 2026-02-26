-- First, let's see ALL users in auth.users
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'username' as username,
  created_at
FROM auth.users
ORDER BY created_at;

-- The error says username "Hello" already exists
-- This means there's ANOTHER user in auth.users that doesn't have a profile yet
-- And when the script tries to create a profile, it conflicts with existing "Hello_1" or "Hello_2"

-- Let's see which users DON'T have profiles
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'username' as username,
  CASE 
    WHEN p.id IS NULL THEN '❌ NO PROFILE'
    ELSE '✅ HAS PROFILE'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at;

-- Now let's manually create profiles for users who don't have them
-- This will handle the duplicate username issue

INSERT INTO public.profiles (
  id,
  username,
  display_name,
  total_score,
  total_snacks_collected,
  total_loops_completed,
  total_play_time,
  highest_level,
  current_level,
  experience_points,
  rank,
  created_at,
  updated_at
)
SELECT 
  u.id,
  -- Generate unique username
  CASE 
    WHEN NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE username = COALESCE(u.raw_user_meta_data->>'username', 'user_' || substr(u.id::text, 1, 8))
    )
    THEN COALESCE(u.raw_user_meta_data->>'username', 'user_' || substr(u.id::text, 1, 8))
    ELSE 'user_' || substr(u.id::text, 1, 8) || '_' || EXTRACT(EPOCH FROM NOW())::INTEGER
  END as username,
  COALESCE(u.raw_user_meta_data->>'display_name', u.raw_user_meta_data->>'username', 'Player'),
  0, 0, 0, 0, 1, 1, 0,
  'Rookie Raccoon',
  u.created_at,
  NOW()
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);

-- Unlock level 1 for users who don't have it
INSERT INTO public.user_progress (
  user_id,
  level_id,
  unlocked,
  attempts,
  best_score,
  completed,
  stars
)
SELECT 
  p.id as user_id,
  l.id as level_id,
  true, 0, 0, false, 0
FROM public.profiles p
CROSS JOIN public.levels l
WHERE l.level_number = 1
  AND NOT EXISTS (
    SELECT 1 FROM public.user_progress up 
    WHERE up.user_id = p.id AND up.level_id = l.id
  );

-- Verify everything
SELECT 
  'Profiles created' as status,
  COUNT(*) as count
FROM public.profiles

UNION ALL

SELECT 
  'Users without profiles' as status,
  COUNT(*) as count
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);
