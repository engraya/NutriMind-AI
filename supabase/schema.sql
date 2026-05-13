-- ============================================================
-- NutriMind AI — Supabase Database Schema
-- Run this SQL in your Supabase project's SQL editor.
-- ============================================================

-- ──────────────────────────────────────────────
-- 1. PROFILES (extends auth.users)
-- ──────────────────────────────────────────────
create table if not exists public.profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  full_name             text,
  avatar_url            text,
  age                   integer,
  gender                text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm             numeric(5,2),
  weight_kg             numeric(5,2),
  goal                  text check (goal in ('lose_weight', 'gain_muscle', 'maintain', 'improve_health')),
  activity_level        text check (activity_level in ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active')),
  target_calories       integer,
  target_protein        integer,
  target_carbs          integer,
  target_fat            integer,
  allergies             text[]  default '{}',
  dietary_restrictions  text[]  default '{}',
  cuisine_preferences   text[]  default '{}',
  onboarding_completed  boolean default false,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ──────────────────────────────────────────────
-- 2. MEAL PLANS
-- ──────────────────────────────────────────────
create table if not exists public.meal_plans (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  title               text not null,
  week_start          date not null,
  plan_data           jsonb not null,
  total_calories_avg  integer,
  is_active           boolean default false,
  created_at          timestamptz default now()
);

-- ──────────────────────────────────────────────
-- 3. NUTRITION LOGS
-- ──────────────────────────────────────────────
create table if not exists public.nutrition_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  meal_name   text not null,
  meal_type   text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  logged_at   timestamptz default now(),
  calories    integer not null,
  protein_g   numeric(6,2),
  carbs_g     numeric(6,2),
  fat_g       numeric(6,2),
  fiber_g     numeric(6,2),
  source      text check (source in ('manual', 'meal_plan', 'fridge_scan', 'recipe')),
  source_id   uuid,
  notes       text,
  image_url   text
);

-- ──────────────────────────────────────────────
-- 4. WATER LOGS
-- ──────────────────────────────────────────────
create table if not exists public.water_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  amount_ml   integer not null,
  logged_at   timestamptz default now()
);

-- ──────────────────────────────────────────────
-- 5. FRIDGE SCANS
-- ──────────────────────────────────────────────
create table if not exists public.fridge_scans (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.profiles(id) on delete cascade,
  image_url             text not null,
  cloudinary_id         text not null,
  detected_ingredients  jsonb,
  suggested_meals       jsonb,
  nutrition_info        jsonb,
  scanned_at            timestamptz default now()
);

-- ──────────────────────────────────────────────
-- 6. RECIPES (shared / cached)
-- ──────────────────────────────────────────────
create table if not exists public.recipes (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  description           text,
  image_url             text,
  cuisine_type          text,
  meal_type             text,
  diet_tags             text[]  default '{}',
  prep_time_min         integer,
  cook_time_min         integer,
  servings              integer,
  calories_per_serving  integer,
  protein_g             numeric(6,2),
  carbs_g               numeric(6,2),
  fat_g                 numeric(6,2),
  ingredients           jsonb not null default '[]',
  instructions          jsonb not null default '[]',
  source                text check (source in ('gemini', 'spoonacular', 'manual')),
  source_id             text,
  created_at            timestamptz default now()
);

-- ──────────────────────────────────────────────
-- 7. SAVED RECIPES (bookmarks)
-- ──────────────────────────────────────────────
create table if not exists public.saved_recipes (
  user_id     uuid references public.profiles(id) on delete cascade,
  recipe_id   uuid references public.recipes(id) on delete cascade,
  saved_at    timestamptz default now(),
  primary key (user_id, recipe_id)
);

-- ──────────────────────────────────────────────
-- 8. GROCERY LISTS
-- ──────────────────────────────────────────────
create table if not exists public.grocery_lists (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  meal_plan_id  uuid references public.meal_plans(id) on delete set null,
  title         text not null,
  week_start    date,
  items         jsonb not null default '[]',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ──────────────────────────────────────────────
-- 9. CHAT SESSIONS
-- ──────────────────────────────────────────────
create table if not exists public.chat_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text,
  messages    jsonb not null default '[]',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ──────────────────────────────────────────────
-- 10. WORKOUT PLANS
-- ──────────────────────────────────────────────
create table if not exists public.workout_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  week_start  date not null,
  plan_data   jsonb not null,
  is_active   boolean default false,
  created_at  timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_nutrition_logs_user_date on public.nutrition_logs (user_id, logged_at desc);
create index if not exists idx_water_logs_user_date on public.water_logs (user_id, logged_at desc);
create index if not exists idx_meal_plans_user on public.meal_plans (user_id, created_at desc);
create index if not exists idx_fridge_scans_user on public.fridge_scans (user_id, scanned_at desc);
create index if not exists idx_grocery_lists_user on public.grocery_lists (user_id, created_at desc);
create index if not exists idx_chat_sessions_user on public.chat_sessions (user_id, updated_at desc);
create index if not exists idx_recipes_cuisine on public.recipes (cuisine_type);
create index if not exists idx_recipes_meal_type on public.recipes (meal_type);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.meal_plans enable row level security;
alter table public.nutrition_logs enable row level security;
alter table public.water_logs enable row level security;
alter table public.fridge_scans enable row level security;
alter table public.recipes enable row level security;
alter table public.saved_recipes enable row level security;
alter table public.grocery_lists enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.workout_plans enable row level security;

-- profiles policies
create policy "Users can view own profile"     on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"   on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"   on public.profiles for insert with check (auth.uid() = id);

-- meal_plans policies
create policy "Users can manage own meal plans" on public.meal_plans for all using (auth.uid() = user_id);

-- nutrition_logs policies
create policy "Users can manage own nutrition logs" on public.nutrition_logs for all using (auth.uid() = user_id);

-- water_logs policies
create policy "Users can manage own water logs" on public.water_logs for all using (auth.uid() = user_id);

-- fridge_scans policies
create policy "Users can manage own fridge scans" on public.fridge_scans for all using (auth.uid() = user_id);

-- recipes policies (public read, service-role write)
create policy "Anyone can read recipes" on public.recipes for select using (true);

-- saved_recipes policies
create policy "Users can manage own saved recipes" on public.saved_recipes for all using (auth.uid() = user_id);

-- grocery_lists policies
create policy "Users can manage own grocery lists" on public.grocery_lists for all using (auth.uid() = user_id);

-- chat_sessions policies
create policy "Users can manage own chat sessions" on public.chat_sessions for all using (auth.uid() = user_id);

-- workout_plans policies
create policy "Users can manage own workout plans" on public.workout_plans for all using (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger on_grocery_lists_updated
  before update on public.grocery_lists
  for each row execute procedure public.handle_updated_at();

create trigger on_chat_sessions_updated
  before update on public.chat_sessions
  for each row execute procedure public.handle_updated_at();

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
