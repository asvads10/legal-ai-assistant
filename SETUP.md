# 🚀 Quick Setup Guide

## Getting Your Project on GitHub

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Name it: `legal-ai-assistant`
4. Description: `Browser-based legal document analyzer with clause extraction, risk assessment, and structured JSON output. No API keys required!`
5. Choose **Public**
6. **DO NOT** initialize with README (we already have one)
7. Click **Create repository**

### Step 2: Upload Your Code

**Option A: Using Git (Recommended)**

```bash
cd legal-ai-assistant
git init
git add .
git commit -m "Initial commit: Legal AI Assistant"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/legal-ai-assistant.git
git push -u origin main
```

**Option B: Using GitHub's Web Interface**

1. On your new repository page, click **uploading an existing file**
2. Drag and drop all files from the `legal-ai-assistant` folder
3. Scroll down and click **Commit changes**

### Step 3: Enable GitHub Pages (Free Hosting!)

1. Go to your repository → **Settings**
2. Scroll to **Pages** section (left sidebar)
3. Under **Source**, select **main** branch
4. Click **Save**
5. Wait 1-2 minutes
6. Your site will be live at: `https://YOUR_USERNAME.github.io/legal-ai-assistant/`

### Step 4: Add Topics/Tags

1. Go to your repository main page
2. Click the ⚙️ gear icon next to **About**
3. Add topics:
   - `legal-tech`
   - `document-analysis`
   - `nlp`
   - `parser`
   - `javascript`
   - `structured-output`
   - `web-app`
   - `portfolio-project`

### Step 5: Pin to Your Profile

1. Go to your GitHub profile
2. Click **Customize your pins**
3. Select `legal-ai-assistant`
4. Click **Save pins**

## Testing Locally

Simply open `index.html` in your browser:

**macOS/Linux:**
```bash
cd legal-ai-assistant
open index.html
```

**Windows:**
```bash
cd legal-ai-assistant
start index.html
```

Or just double-click `index.html` in your file explorer!

## File Structure

```
legal-ai-assistant/
├── index.html              # Main interface
├── styles.css              # Styling
├── app.js                  # UI logic
├── legal-parser.js         # Parsing engine
├── samples.js              # Sample documents
├── README.md               # Main documentation
├── FEATURES.md             # Feature details
├── CONTRIBUTING.md         # Contribution guide
├── SCREENSHOTS.md          # Screenshot guide
├── LICENSE                 # MIT License
└── .gitignore             # Git ignore rules
```

## Next Steps

1. ✅ **Test locally** - Open index.html and try the samples
2. ✅ **Push to GitHub** - Follow Step 1-2 above
3. ✅ **Enable Pages** - Follow Step 3 for free hosting
4. ✅ **Take screenshots** - See SCREENSHOTS.md for guide
5. ✅ **Share your work** - Add to your resume/portfolio!

## Customization Ideas

### Easy Wins
- Change color scheme in `styles.css` (update CSS variables)
- Add your name/info to the footer
- Add more sample documents
- Modify the header text

### Advanced
- Add new clause types in `legal-parser.js`
- Improve entity extraction patterns
- Add PDF upload support
- Create additional export formats

## Troubleshooting

**Problem: Page doesn't load properly**
- Make sure all files are in the same folder
- Check browser console for errors (F12)
- Try a different browser

**Problem: GitHub Pages not working**
- Wait a few minutes after enabling
- Ensure main branch is selected
- Check repository is public

**Problem: Features not working**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check that JavaScript is enabled
- Try in incognito/private mode

## Getting Help

- Open an issue on GitHub
- Check the FEATURES.md documentation
- Review the code comments in legal-parser.js

## Share Your Success! 🎉

Once deployed, share your project:
- LinkedIn: Post your GitHub Pages link
- Twitter: Share with #LegalTech #WebDev
- Reddit: r/webdev, r/javascript
- Dev.to: Write an article about building it

---

**Built by you!** 🚀 Now go show it off on your GitHub profile!
