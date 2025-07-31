# 🚨 Troubleshooting API Keys Dashboard

## Common Issues and Solutions

### 🔧 "Error saving API key: {}" 

This empty error usually means Supabase isn't properly configured. Follow these steps:

#### ✅ Step 1: Check Environment Variables

1. **Verify `.env.local` exists** in your `my-app` directory
2. **Content should look like:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. **Restart your development server** after creating/modifying `.env.local`

#### ✅ Step 2: Verify Supabase Setup

1. **Check your Supabase project** is created and active
2. **Run the SQL schema** from `SUPABASE_SETUP.md` in your Supabase SQL Editor
3. **Verify the table exists** in your Supabase dashboard under "Table Editor"

#### ✅ Step 3: Test Connection

1. Click the **"🔗 Test"** button in your API Keys dashboard
2. Check browser console for detailed error messages
3. If successful, you should see "✅ Supabase connection successful!"

### 🔧 "Missing Supabase environment variables"

**Solution:**
1. Create `.env.local` file in `my-app` directory (not in root)
2. Add your Supabase credentials from Settings > API
3. Restart development server: `npm run dev`

### 🔧 "relation 'api_keys' does not exist"

**Solution:**
1. Go to Supabase dashboard > SQL Editor
2. Copy and run the SQL from `SUPABASE_SETUP.md`
3. Verify table appears in Table Editor

### 🔧 "Failed to load API keys"

**Solutions:**
1. Check network connection
2. Verify Supabase project is not paused
3. Check RLS policies are properly set
4. Try the "🔗 Test" button for more details

### 🔧 Environment Variables Not Loading

**Solutions:**
1. **File location**: `.env.local` must be in `my-app/` directory
2. **File name**: Must be exactly `.env.local` (not `.env` or `.env.production`)
3. **Restart required**: Always restart dev server after changes
4. **No quotes**: Don't wrap values in quotes unless they contain spaces

### 🔧 Supabase Project Issues

**Check these:**
1. **Project status**: Make sure it's not paused
2. **Billing**: Free tier has limits
3. **Region**: Some regions may have temporary issues
4. **URL format**: Should be `https://project-id.supabase.co`

## 🛠️ Quick Fixes

### Start Fresh
If nothing works, try this reset:

1. **Delete** `.env.local`
2. **Stop** development server (`Ctrl+C`)
3. **Create new** `.env.local` with fresh credentials
4. **Start** server: `npm run dev`
5. **Test connection** using the "🔗 Test" button

### Check Console
Always check your browser's Developer Console (F12) for detailed error messages.

### Verify Installation
Make sure Supabase is installed:
```bash
npm list @supabase/supabase-js
```

If not installed:
```bash
npm install @supabase/supabase-js
```

## 📞 Need More Help?

1. **Check browser console** for detailed errors
2. **Review `SUPABASE_SETUP.md`** for complete setup instructions
3. **Test connection** using the built-in test button
4. **Verify** all environment variables are correctly set 