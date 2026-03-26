# Testing Guide for New Features

## Prerequisites
1. Ensure migrations are run: `php artisan migrate:fresh --seed`
2. Seed testimonials: `php artisan db:seed --class=TestimonialSeeder`
3. Build assets: `npm run build`
4. Start server: `php artisan serve`

## Testing the Testimonial Carousel

### Visual Tests
1. **Navigate to Homepage**
   - Scroll down to the "Testimonials" section (between Blog and Visitor Stats)
   - Verify the section header displays correctly
   - Check that the testimonial card has proper styling

2. **Auto-Slide Feature**
   - Wait 5 seconds
   - Verify the carousel automatically transitions to the next testimonial
   - Check that the transition is smooth
   - Verify dot indicators update correctly

3. **Manual Navigation**
   - Click the right arrow button
   - Verify it moves to the next testimonial
   - Click the left arrow button
   - Verify it moves to the previous testimonial
   - Check that auto-play stops after manual interaction

4. **Dot Indicators**
   - Click on different dots
   - Verify each dot navigates to the correct testimonial
   - Check that the active dot is highlighted (elongated pill shape)

5. **Read More Toggle**
   - Find a testimonial with a long comment (>200 characters)
   - Verify "Read more" button appears
   - Click "Read more" - comment should expand
   - Click "Read less" - comment should collapse

6. **Responsive Design**
   - Test on mobile viewport (< 768px)
   - Test on tablet viewport (768px - 1024px)
   - Test on desktop viewport (> 1024px)
   - Verify navigation buttons adjust position
   - Check text sizes are appropriate

### Dark Mode Tests
1. Toggle dark mode using the navbar button
2. Verify testimonial card background changes
3. Check text colors are readable
4. Verify star ratings are visible
5. Check navigation buttons have proper contrast

## Testing the Enhanced Navbar

### Visual Tests
1. **Scroll Through Sections**
   - Start at the top of the page
   - Slowly scroll down through each section
   - Verify the navbar highlights the correct section
   - Check that the active indicator appears smoothly

2. **Active Link Styling**
   - Verify gradient background appears on active link
   - Check bottom gradient line is visible
   - Verify subtle border ring is present
   - Ensure styling matches the design (sky-primary colors)

3. **Hover Effects**
   - Hover over inactive navbar links
   - Verify background color changes
   - Check text color transitions
   - Ensure transitions are smooth (300ms)

4. **Click Navigation**
   - Click each navbar link
   - Verify smooth scroll to section
   - Check that the link becomes active
   - Ensure the indicator updates immediately

### Dark Mode Tests
1. Toggle dark mode
2. Verify active link colors change appropriately
3. Check hover states work in dark mode
4. Verify gradient backgrounds are visible but subtle

## Database Tests

### Verify Testimonials Data
```bash
php artisan tinker
```

```php
// Check testimonials count
\App\Models\PortfolioRating::whereNotNull('comment')->count();
// Should return 5

// View all testimonials
\App\Models\PortfolioRating::whereNotNull('comment')->get();

// Check a specific testimonial
\App\Models\PortfolioRating::first();
```

### Add a New Testimonial
```php
\App\Models\PortfolioRating::create([
    'name' => 'Test User',
    'rating' => 5,
    'comment' => 'This is a test testimonial to verify the carousel works with new data.',
]);
```

Refresh the page and verify the new testimonial appears in the carousel.

## Browser Compatibility Tests

Test in the following browsers:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## Performance Tests

1. **Page Load Time**
   - Open DevTools Network tab
   - Refresh the page
   - Verify assets load quickly
   - Check for any console errors

2. **Animation Performance**
   - Open DevTools Performance tab
   - Record while carousel auto-slides
   - Verify smooth 60fps animations
   - Check for any layout thrashing

3. **Memory Leaks**
   - Open DevTools Memory tab
   - Take a heap snapshot
   - Let carousel run for 2 minutes
   - Take another snapshot
   - Verify no significant memory increase

## Accessibility Tests

1. **Keyboard Navigation**
   - Tab through navbar links
   - Verify focus states are visible
   - Press Enter on a link - should navigate
   - Tab to carousel navigation buttons
   - Press Enter/Space - should navigate

2. **Screen Reader**
   - Use a screen reader (NVDA, JAWS, VoiceOver)
   - Verify ARIA labels are announced
   - Check testimonial content is readable
   - Verify navigation buttons are properly labeled

3. **Color Contrast**
   - Use a contrast checker tool
   - Verify all text meets WCAG AA standards
   - Check both light and dark modes

## Expected Results

### Testimonial Carousel
- ✅ Displays 5 sample testimonials
- ✅ Auto-slides every 5 seconds
- ✅ Manual navigation works smoothly
- ✅ Dot indicators update correctly
- ✅ Read more/less toggle works
- ✅ Responsive on all screen sizes
- ✅ Dark mode styling is correct

### Enhanced Navbar
- ✅ Active link has gradient background
- ✅ Bottom gradient line indicator visible
- ✅ Subtle border ring present
- ✅ Smooth transitions on hover
- ✅ Correct section highlighting on scroll
- ✅ Dark mode colors are appropriate

## Troubleshooting

### Testimonials Not Showing
- Check database: `php artisan tinker` → `\App\Models\PortfolioRating::count()`
- Verify seeder ran: `php artisan db:seed --class=TestimonialSeeder`
- Check browser console for errors

### Navbar Not Highlighting
- Verify section IDs match navbar links
- Check scroll position detection logic
- Ensure sections have proper IDs: about, experience, skills, projects, achievements, testimonials, blog, contact

### Styling Issues
- Clear browser cache
- Rebuild assets: `npm run build`
- Check for CSS conflicts in DevTools
- Verify Tailwind classes are compiling

### Auto-Slide Not Working
- Check browser console for JavaScript errors
- Verify React component is mounting correctly
- Check if testimonials array has data
