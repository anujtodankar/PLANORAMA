-- 1. Create the Admin User
-- Email: admin@example.com
-- Password: password123

create extension if not exists pgcrypto;

with new_user as (
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'admin@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  returning id, email
),
user_identity as (
  insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
    -- email column is generated, do not insert
  )
  select
    uuid_generate_v4(),
    id,
    id::text,
    format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
    'email',
    now(),
    now(),
    now()
  from new_user
),
-- 2. Create Sample Events
sample_events as (
  insert into events (user_id, title, date, location, description, allow_plus_one, max_capacity)
  select 
    id,
    'Summer Garden Wedding', 
    (now() + interval '30 days'), 
    'Brooklyn Botanic Garden', 
    'Join us for a celebration of love in the garden. Reception to follow.', 
    true, 
    150
  from new_user
  union all
  select 
    id,
    'Tech Startup Mixer', 
    (now() + interval '7 days'), 
    'WeWork Downtown', 
    'Networking event for local founders and developers. Pizza provided!', 
    false, 
    50
  from new_user
  returning id, title
)
-- 3. Create Sample RSVPs
insert into rsvps (event_id, name, email, status, dietary_restrictions, plus_one_count)
select 
  id, 
  'Alice Wonderland', 
  'alice@example.com', 
  'yes', 
  'Vegan', 
  1
from sample_events where title = 'Summer Garden Wedding'
union all
select 
  id, 
  'Bob Builder', 
  'bob@example.com', 
  'no', 
  null, 
  0
from sample_events where title = 'Summer Garden Wedding';
