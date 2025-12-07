# How to Get Your Gemini API Key

The AI chatbot feature in this application uses **Google's Gemini Pro** model to provide intelligent vehicle diagnostics and repair assistance.

## Step 1: Visit Google AI Studio

Go to [https://ai.google.dev](https://ai.google.dev) and sign in with your Google account.

## Step 2: Get Your API Key

1. Click on **"Get API key"** in the top navigation
2. Click **"Create API key"** 
3. Choose an existing Google Cloud project or create a new one
4. Copy the generated API key

## Step 3: Add to Your Environment

1. Navigate to the `frontend` folder in your project
2. Create or edit the `.env` file
3. Add the following line:
   ```
   VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
   ```
3. Replace `YOUR_API_KEY_HERE` with your actual key
4. Restart your dev server (`npm run dev`)

### For Production (GitHub Pages):
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `VITE_GEMINI_API_KEY`
5. Value: Your API key
6. Click **"Add secret"**
7. Push any commit to trigger rebuild

## Step 4: Test It!
1. Go to your dashboard
2. Click the 🤖 chat button (bottom-right)
3. Type: "My car won't start"
4. You should get an AI response!

## Troubleshooting

**Error: "Invalid API key"**
- Double-check the API key is correct
- Make sure it starts with `AIza`
- No spaces before/after the key
- Restart dev server after adding `.env`

**Error: "Gemini API key is not configured"**
- Check the `.env` file exists in `frontend/` folder
- Variable name must be exactly `VITE_GEMINI_API_KEY`
- For production, verify GitHub secret is added

**Chat button doesn't work**
- Open browser console (F12)
- Look for error messages
- Check if `@google/generative-ai` package is installed

## API Limits (Free Tier)

- **60 requests per minute**
- **1,500 requests per day**
- More than enough for testing and personal use!

## Need Help?

If you're stuck, check:
1. [Google AI Studio Documentation](https://ai.google.dev/tutorials)
2. Browser console for errors
3. Make sure `npm install` completed successfully
