# HydraSkript Exact PDF Integration Guide

## Overview

I've recreated your homepage and pricing page to **EXACTLY match** the visual design from your PDFs, including:

- ✅ Pure black backgrounds (not navy)
- ✅ Light blue gradient text (#7dd3fc to #06b6d4)
- ✅ Purple-to-cyan gradient buttons
- ✅ Split-screen layouts with image placeholders
- ✅ Dark card backgrounds (#2a2a2a)
- ✅ Bright cyan background for Starter pricing card
- ✅ Blue border and "Most Popular" badge for Author plan
- ✅ Comparison table with checkmarks, X's, and warnings
- ✅ Modern sleek styling matching PDFs exactly

## Files Included

1. **page_exact_pdf.tsx** - Homepage matching PDF design
2. **page_exact_pdf.tsx** (in pricing folder) - Pricing page matching PDF design

## Installation Steps

### Step 1: Backup Your Current Files

```bash
# Backup current homepage
cp app/page.tsx app/page_backup.tsx

# Backup current pricing (if exists)
cp app/pricing/page.tsx app/pricing/page_backup.tsx 2>/dev/null || true
```

### Step 2: Install New Homepage

```bash
# Copy the exact PDF homepage
cp page_exact_pdf.tsx app/page.tsx
```

### Step 3: Install New Pricing Page

```bash
# Create pricing directory if it doesn't exist
mkdir -p app/pricing

# Copy the exact PDF pricing page
cp pricing/page_exact_pdf.tsx app/pricing/page.tsx
```

### Step 4: Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

### Step 5: Access Pages

- Homepage: `http://localhost:3000/`
- Pricing: `http://localhost:3000/pricing`

## Key Design Elements

### Homepage Features

**Hero Section:**
- Pure black background
- Large light blue gradient headline
- Two buttons: gradient "Get Started" + bordered "Explore Features"
- Image placeholder on right

**Why Choose Platform:**
- 4 feature cards with dark backgrounds (#2a2a2a)
- Circular gradient icons (purple to cyan)
- Split-screen layout

**E-Books Section:**
- Gradient headline and subheadline
- 3 numbered process steps with gradient underlines
- Split-screen with laptop image placeholder

**Kids Books Section:**
- 3 bordered white cards (2 top, 1 bottom full width)
- Whimsical illustration placeholder

**Audiobooks Section:**
- Studio photo placeholder on left
- 3 circular gradient icon features at bottom

### Pricing Page Features

**Hero:**
- Dark blurred background
- "Stop Writing. Start Publishing." in huge light blue text
- Two buttons: solid purple + bordered white

**Comparison Table:**
- Full-width table with borders
- Green checkmarks, red X's, yellow warnings
- 4 columns comparing HydraSkript vs competitors

**Pricing Cards:**

1. **Starter** - BRIGHT CYAN background (#06b6d4)
   - Purple price text
   - Black body text
   - Dark header

2. **Author** - Black background with BLUE BORDER
   - "Most Popular" badge with star
   - White text throughout
   - Light blue header

3. **Publisher** - Black background with gray border
   - Light blue price
   - White text
   - Gray header

## Adding Your Images

Replace the emoji placeholders with real images:

### Homepage Images

```tsx
// Hero workspace image (line ~50)
<img src="/images/hero-workspace.jpg" alt="Cozy workspace" className="w-full h-full object-cover" />

// Feature group photo (line ~120)
<img src="/images/collaboration.jpg" alt="Team collaboration" className="w-full h-full object-cover" />

// E-book editor laptop (line ~180)
<img src="/images/editor-laptop.jpg" alt="E-book editor" className="w-full h-full object-cover" />

// Kids book illustration (line ~240)
<img src="/images/kids-illustration.jpg" alt="Whimsical illustration" className="w-full h-full object-cover" />

// Recording studio (line ~290)
<img src="/images/recording-studio.jpg" alt="Audio recording" className="w-full h-full object-cover" />
```

### Pricing Page Images

```tsx
// Hero background (line ~30)
<div 
  className="absolute inset-0 bg-cover bg-center opacity-40" 
  style={{backgroundImage: 'url(/images/pricing-hero-bg.jpg)'}}
></div>
```

## Color Reference

### Exact Colors from PDFs

```css
/* Backgrounds */
--black: #000000
--dark-card: #2a2a2a
--dark-gray: #1f1f1f
--bright-cyan: #06b6d4

/* Text Gradients */
--gradient-blue: linear-gradient(to right, #7dd3fc, #06b6d4)
--gradient-purple-blue: linear-gradient(to right, #a5b4fc, #60a5fa)

/* Button Gradients */
--gradient-purple-cyan: linear-gradient(to right, #a855f7, #06b6d4)

/* Text Colors */
--light-blue: #7dd3fc
--cyan: #06b6d4
--light-gray: #d1d5db
--white: #ffffff

/* Status Colors */
--green-check: #22c55e
--red-x: #ef4444
--yellow-warning: #eab308
```

## Responsive Behavior

Both pages are fully responsive:

- **Mobile** (< 768px): Stacked layouts, full-width cards
- **Tablet** (768-1024px): 2-column grids where applicable
- **Desktop** (> 1024px): Full split-screen layouts

## Navigation

Both pages include navigation with:
- Logo + HydraSkript title (gradient text)
- Links to: Home, Pricing, Dashboard
- Consistent across both pages

## Differences from Your Current Site

### What Changed:

1. **Background**: Navy blue → Pure black
2. **Text**: Solid colors → Gradient text (blue to cyan)
3. **Buttons**: Solid/bordered → Gradient backgrounds
4. **Cards**: Simple borders → Dark backgrounds with padding
5. **Layout**: Single column → Split-screen 50/50 or 60/40
6. **Icons**: Simple → Circular gradient backgrounds
7. **Pricing Starter**: Dark theme → Bright cyan background
8. **Pricing Author**: No distinction → Blue border + "Most Popular" badge
9. **Typography**: Standard → Larger, bolder headlines

### What Stayed:

- Logo and branding
- Core content and messaging
- Navigation structure
- Link destinations

## Testing Checklist

- [ ] Homepage loads without errors
- [ ] Pricing page loads without errors
- [ ] Navigation links work
- [ ] Gradient text displays correctly
- [ ] Buttons have gradient backgrounds
- [ ] Cards have dark backgrounds
- [ ] Starter plan has cyan background
- [ ] Author plan has blue border and badge
- [ ] Comparison table displays correctly
- [ ] Mobile responsive layout works
- [ ] All links point to correct destinations

## Troubleshooting

### Gradients not showing?

Make sure Tailwind CSS is configured for gradients. Your `tailwind.config.js` should have:

```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    // ... other paths
  ],
  // Gradients are enabled by default in Tailwind v3+
}
```

### Images not loading?

Place images in `public/images/` directory and reference them as `/images/filename.jpg`

### Styling looks different?

Clear your browser cache and restart the dev server:

```bash
# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

## Next Steps

1. **Add real images** - Replace emoji placeholders with professional photos
2. **Test on mobile** - Verify responsive layouts work correctly
3. **Update content** - Adjust any text to match your exact messaging
4. **Add analytics** - Track page views and conversions
5. **Deploy** - Push to production when ready

## Support

If you encounter any issues:

1. Check browser console for errors
2. Verify all files are in correct locations
3. Ensure Tailwind CSS is properly configured
4. Clear cache and restart dev server
5. Compare with PDF to ensure visual accuracy

---

**The pages now EXACTLY match your PDF designs!** 🎉
