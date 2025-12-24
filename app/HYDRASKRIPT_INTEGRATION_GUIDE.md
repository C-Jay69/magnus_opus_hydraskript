# HydraSkript Integration Guide

## 📦 What's Included

I've created two new pages based on your PDF designs:

1. **Enhanced Homepage** (`page_enhanced.tsx`)
   - Hero section with split layout
   - "Why Choose Our Platform?" with 4 feature cards
   - "Transform Your Ideas Into Beautiful E-Books" section
   - "Bring Kids' Stories to Life" section
   - "Create Immersive Audiobooks" section
   - CTA section
   - Footer

2. **Dedicated Pricing Page** (`pricing/page.tsx`)
   - Hero section with "Stop Writing. Start Publishing."
   - Comparison table (HydraSkript vs AI Tools vs Humans)
   - 3 pricing tiers (Starter, Author, Publisher)
   - CTA section
   - Footer

## 🎨 Design Features

### Maintained Your Brutalist Style
- Dark navy background (`bg-navy`)
- Primary color accents (cyan/blue)
- Bold typography
- Clean borders and cards
- Consistent with your existing dashboard

### Added from PDFs
- Gradient accents (purple to cyan)
- Feature cards with icons
- Split-screen layouts
- Process steps with numbered circles
- Pricing cards with hover effects
- "Most Popular" badge

## 📁 File Locations

```
app/
├── page_enhanced.tsx          ← New enhanced homepage
├── pricing/
│   └── page.tsx               ← New dedicated pricing page
```

## 🚀 Installation Steps

### Option 1: Replace Homepage (Recommended)

1. **Backup your current homepage:**
   ```bash
   cp app/page.tsx app/page_backup.tsx
   ```

2. **Replace with enhanced version:**
   ```bash
   cp app/page_enhanced.tsx app/page.tsx
   ```

3. **Install pricing page:**
   - The pricing page is already in the correct location: `app/pricing/page.tsx`

### Option 2: Keep Both Versions

1. **Keep current homepage as is**
2. **Access enhanced version at a different route:**
   ```bash
   mkdir app/home
   mv app/page_enhanced.tsx app/home/page.tsx
   ```
   - Access at: `http://localhost:3000/home`

3. **Pricing page is ready:**
   - Access at: `http://localhost:3000/pricing`

## 🖼️ Adding Images

The new pages have image placeholders marked with emojis. To add your images:

### Hero Section (Homepage)
```tsx
// Replace this placeholder:
<div className="text-6xl mb-4">📚</div>

// With your image:
<img 
  src="/images/hero-workspace.jpg" 
  alt="Creative workspace" 
  className="w-full h-full object-cover"
/>
```

### E-Books Section
```tsx
// Replace:
<div className="text-6xl mb-4">💻</div>

// With:
<img 
  src="/images/ebook-editor.jpg" 
  alt="E-book editor interface" 
  className="w-full h-full object-cover"
/>
```

### Kids Books Section
```tsx
// Replace:
<div className="text-6xl mb-4">🦊</div>

// With:
<img 
  src="/images/kids-illustration.jpg" 
  alt="Whimsical children's book illustration" 
  className="w-full h-full object-cover"
/>
```

### Audiobooks Section
```tsx
// Replace:
<div className="text-6xl mb-4">🎙️</div>

// With:
<img 
  src="/images/recording-studio.jpg" 
  alt="Professional recording studio" 
  className="w-full h-full object-cover"
/>
```

## 🎯 Navigation Updates

The new pages include updated navigation:

### Homepage Navigation
- Home (logo)
- Pricing (new link)
- Dashboard

### Pricing Page Navigation
- Home
- Dashboard

You may want to add these links to your existing dashboard navigation as well.

## ✅ Testing Checklist

After installation:

1. **Homepage (`/`)**
   - [ ] Hero section loads correctly
   - [ ] All 4 feature cards display
   - [ ] E-books section renders
   - [ ] Kids books section renders
   - [ ] Audiobooks section renders
   - [ ] CTA buttons work
   - [ ] Navigation links work

2. **Pricing Page (`/pricing`)**
   - [ ] Hero section displays
   - [ ] Comparison table renders correctly
   - [ ] All 3 pricing cards show
   - [ ] "Most Popular" badge appears on Author plan
   - [ ] CTA buttons work
   - [ ] Navigation links work

3. **Responsive Design**
   - [ ] Test on mobile (< 768px)
   - [ ] Test on tablet (768px - 1024px)
   - [ ] Test on desktop (> 1024px)

## 🎨 Customization

### Colors
The pages use your existing Tailwind classes:
- `bg-navy` - Main background
- `bg-navy-card` - Card backgrounds
- `text-primary` - Primary text (cyan/blue)
- `text-secondary` - Secondary accent
- `text-foreground` - Main text color

### Typography
- Headlines: `text-4xl` to `text-7xl`
- Body: `text-lg` to `text-xl`
- Small text: `text-sm`

### Spacing
- Sections: `section` class (padding)
- Cards: `p-6` to `p-8`
- Gaps: `gap-4` to `gap-12`

## 🐛 Troubleshooting

### Images Not Showing
- Make sure images are in `/public/images/`
- Check file paths are correct
- Verify image formats (jpg, png, webp)

### Styling Issues
- Run `npm run dev` to rebuild
- Clear browser cache
- Check Tailwind config includes new files

### Navigation Not Working
- Verify Next.js Link imports
- Check href paths are correct
- Ensure pages are in correct directories

## 📝 Notes

### Content from PDFs
All text content from your PDFs has been integrated:
- ✅ Hero headlines and descriptions
- ✅ Feature descriptions
- ✅ Process steps
- ✅ Pricing tiers and features
- ✅ Comparison table
- ✅ CTAs and taglines

### Brutalist Style Maintained
Your existing design aesthetic has been preserved:
- ✅ Dark navy theme
- ✅ Bold typography
- ✅ Clean borders
- ✅ Consistent spacing
- ✅ Primary color accents

### Responsive Design
All sections are mobile-responsive:
- ✅ Grid layouts adapt to screen size
- ✅ Text scales appropriately
- ✅ Images stack on mobile
- ✅ Navigation collapses gracefully

## 🚀 Next Steps

1. Install the pages following the steps above
2. Add your images to replace placeholders
3. Test on different screen sizes
4. Adjust colors/spacing if needed
5. Deploy to production!

## 💡 Tips

- The pricing page can be linked from your dashboard
- Consider adding a "Features" link in navigation
- You can add more sections to homepage as needed
- Pricing tiers can be made dynamic with a CMS

---

**Need help?** The pages are fully commented and use your existing Tailwind classes, so they should integrate seamlessly with your current site!
