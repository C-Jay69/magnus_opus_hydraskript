# Supabase Setup Guide

This guide will help you set up Supabase as your database for Magnus Opus Hydraskript.

## Why Supabase?

Supabase provides:
- **Managed PostgreSQL** - No server management required
- **Free Tier** - 500MB database, 1GB file storage, 2GB bandwidth
- **Built-in Auth** - Optional authentication system
- **Real-time** - WebSocket support for live updates
- **Storage** - Alternative to Cloudflare R2 for file storage
- **Auto-backups** - Daily backups included

## Step-by-Step Setup

### 1. Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

### 2. Create a New Project

1. Click "New Project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: `magnus-opus` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (or Pro if needed)
4. Click "Create new project"
5. Wait 2-3 minutes for provisioning

### 3. Get Your Database Connection String

1. In your project dashboard, go to **Settings** (gear icon)
2. Click **Database** in the sidebar
3. Scroll to **Connection string**
4. Select **URI** tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abc123xyz.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the password you set in step 2

### 4. Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://abc123xyz.supabase.co`
   - **anon public key**: `eyJhbG...` (for client-side)
   - **service_role key**: `eyJhbG...` (for server-side, keep secret!)

### 5. Update Your .env File

Add these to your `.env` file:

```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"

# Supabase (optional, for using Supabase Storage instead of Cloudflare R2)
SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 6. Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push
```

This will create all the necessary tables in your Supabase database.

### 7. Verify Setup

Open Prisma Studio to verify your database:

```bash
npx prisma studio
```

You should see all your tables (users, projects, chapters, etc.) in the Prisma Studio interface.

## Optional: Use Supabase Storage

Instead of Cloudflare R2, you can use Supabase Storage for file uploads:

### Create a Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Name it `magnum-opus-assets`
4. Set to **Public** (for cover images, exports)
5. Click "Create bucket"

### Update Your Code

You'll need to modify `lib/export.ts` to use Supabase Storage instead of Cloudflare R2. Here's a helper function:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function uploadToSupabase(
  filePath: string,
  fileBuffer: Buffer,
  contentType: string
) {
  const { data, error } = await supabase.storage
    .from('magnum-opus-assets')
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: true,
    })

  if (error) throw error

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('magnum-opus-assets')
    .getPublicUrl(filePath)

  return urlData.publicUrl
}
```

## Troubleshooting

### Connection Issues

If you can't connect to the database:
1. Check your password is correct (no special characters causing issues)
2. Verify your IP isn't blocked (Supabase allows all IPs by default)
3. Make sure you're using the correct connection string format

### Migration Errors

If `prisma db push` fails:
1. Check your DATABASE_URL is correct
2. Ensure your Supabase project is fully provisioned
3. Try `npx prisma db push --force-reset` (WARNING: deletes all data)

### Performance Issues

Free tier limits:
- 500MB database size
- 2GB bandwidth per month
- 50MB file upload limit

If you exceed these, consider upgrading to Pro ($25/month).

## Next Steps

1. ✅ Database is set up
2. ✅ Tables are created
3. 📝 Create your first admin user
4. 🚀 Start building!

For more information, visit the [Supabase Documentation](https://supabase.com/docs).
