# WhosGot MVP - Environment Setup

## Quick Start

The app works in demo mode with mock data when Supabase isn't configured.

## Full Functionality (Optional)

To enable full database functionality:

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Set up the database schema**:
   ```sql
   -- Create enum types
   CREATE TYPE "Category" AS ENUM ('HELP', 'THINGS', 'ADVICE_SKILLS', 'CONNECTIONS', 'OTHER');
   CREATE TYPE "Tag" AS ENUM ('URGENT', 'HEARTWARMING', 'RARE_FIND');

   -- Create tables
   CREATE TABLE "Request" (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     "authorId" UUID REFERENCES auth.users(id),
     title TEXT NOT NULL,
     description TEXT,
     category "Category" NOT NULL,
     tag "Tag",
     location TEXT,
     "photoUrl" TEXT,
     "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE TABLE "Response" (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     "requestId" UUID REFERENCES "Request"(id) ON DELETE CASCADE,
     "authorId" UUID REFERENCES auth.users(id),
     message TEXT NOT NULL,
     contact TEXT,
     "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Enable RLS and create policies**:
   ```sql
   -- Enable RLS
   ALTER TABLE "Request" ENABLE ROW LEVEL SECURITY;
   ALTER TABLE "Response" ENABLE ROW LEVEL SECURITY;

   -- Policies for Request
   CREATE POLICY "Public can read requests" ON "Request" FOR SELECT USING (true);
   CREATE POLICY "Users can insert own requests" ON "Request" FOR INSERT WITH CHECK (auth.uid() = "authorId");
   CREATE POLICY "Users can update own requests" ON "Request" FOR UPDATE USING (auth.uid() = "authorId");

   -- Policies for Response
   CREATE POLICY "Public can read responses" ON "Response" FOR SELECT USING (true);
   CREATE POLICY "Users can insert own responses" ON "Response" FOR INSERT WITH CHECK (auth.uid() = "authorId");
   CREATE POLICY "Users can update own responses" ON "Response" FOR UPDATE USING (auth.uid() = "authorId");
   ```

4. **Create environment file**:
   ```bash
   # Create .env file in project root
   VITE_NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Enable Email Auth** in Supabase Dashboard → Authentication → Providers

6. **Restart the dev server**:
   ```bash
   npm run dev
   ```

## Features

### ✅ Implemented
- **Request Creation**: Post new requests with categories and tags
- **Request Browsing**: View and filter all requests 
- **Request Details**: Full request view with responses
- **Response System**: Reply to requests with optional contact info
- **User Profiles**: View user's requests and responses
- **Authentication**: Email magic link + demo mode
- **Responsive Design**: Mobile-first, warm minimalist UI
- **Real-time Data**: Supabase integration with RLS
- **Demo Mode**: Works without configuration using mock data

### 🎯 Core Flows
1. **Post a Request** → AI suggests similar requests
2. **Browse Requests** → Filter by category, tag, location
3. **View Request Details** → See responses and respond
4. **User Profiles** → View activity history

The app gracefully handles both production Supabase integration and demo mode for easy development and testing.