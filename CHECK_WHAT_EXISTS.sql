-- Check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check what's in profiles table
SELECT id, username, display_name 
FROM public.profiles 
LIMIT 10;

-- Check users in auth
SELECT id, email, raw_user_meta_data->>'username' as username
FROM auth.users
LIMIT 10;
