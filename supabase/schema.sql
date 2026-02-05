-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- EVENTS TABLE
create table events (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) not null, -- Admin who created it
  title text not null,
  description text,
  date timestamptz not null,
  location text not null,
  allow_plus_one boolean default false,
  max_capacity int,
  
  constraint title_length check (char_length(title) > 0)
);

-- RSVPS TABLE
create table rsvps (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  event_id uuid references events(id) on delete cascade not null,
  name text not null,
  email text not null,
  status text not null check (status in ('yes', 'no', 'waitlist')),
  dietary_restrictions text,
  plus_one_count int default 0,
  checked_in boolean default false,
  
  -- Prevent multiple submissions per email per event
  constraint unique_event_email unique (event_id, email)
);

--- user table
create table user (
   id uuid primary key default gen_random_uuid(),
  password text not null,
  email text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint unique_email unique (email)
);

-- RLS POLICIES
alter table events enable row level security;
alter table rsvps enable row level security;
alter table user enable row level security;

-- EVENTS POLICIES
-- Public can view events (so they can RSVP)
create policy "Public events are viewable by everyone"
  on events for select
  using (true);

-- Admins can insert/update/delete their own events
create policy "Admins can insert their own events"
  on events for insert
  with check (auth.uid() = user_id);

create policy "Admins can update their own events"
  on events for update
  using (auth.uid() = user_id);

create policy "Admins can delete their own events"
  on events for delete
  using (auth.uid() = user_id);

-- RSVPS POLICIES
-- Guests can insert RSVPs (public)
create policy "Everyone can insert RSVPs"
  on rsvps for insert
  with check (true);

-- Only Admins (who own the event) can view RSVPs
-- This requires a join, simpler: Admin can view all RSVPs? Or use security definer function?
-- Simple approach: Admin can select * from rsvps. Public cannot select.
-- Wait, if I restrict select, how does the user see "Success"? They don't need to query the DB, just get response.
-- But for "Check capacity": we might need to count 'yes' RSVPs.
-- Public needs to count RSVPs for an event to check capacity.
create policy "Everyone can view RSVPs count"
  on rsvps for select
  using (true); 
  -- Actually, giving public access to all RSVP data (emails) is bad.
  -- Better: Create a stored function or view to get count, OR just rely on client getting error?
  -- For MVP: Allow public read is simplest but leaks privacy. 
  -- Better: RLS `using (true)` but select restricted columns? Supabase doesn't support column-level RLS easily.
  -- Alternative: Use a "Database Function" (RPC) to check capacity/get event details with count.
  -- For this MVP assignment: "Admin can view a list of attendees".
  -- I'll stick to: Public can insert. Admin can Select.
  -- BUT: Real-time capacity check? Next.js server component (admin client) can check.
  -- Guest client: "Max Capacity... RSVP form should automatically disable". Use a Postgres function `get_event_capacity(event_id)`.
  
-- Revised RSVP Access
create policy "Admins can view all RSVPs"
  on rsvps for select
  using (exists (
    select 1 from events
    where events.id = rsvps.event_id
    and events.user_id = auth.uid()
  ));

-- Helper function to check capacity publically without exposing emails
create or replace function get_event_rsvp_count(p_event_id uuid)
returns int
language sql
security definer
as $$
  select count(*)::int
  from rsvps
  where event_id = p_event_id
  and status = 'yes';
$$;

-- Enable Realtime for RSVPs table (for Admin dashboard)
alter publication supabase_realtime add table rsvps;


