# Geo-Rebus

A geography rebus game where players solve riddles to find secret locations.

## Features

- Interactive quiz with 3 questions
- Background images for visual clues (with lazy loading)
- WebP image format support with automatic fallback to JPG
- Responsive design
- Accessibility features (ARIA labels, alt text)
- Fuzzy answer matching with Levenshtein distance

## Local Testing

### Prerequisites

- A web browser
- Node.js (optional, for image optimization)

### Running Locally

1. Simply open `index.html` in your web browser
2. Or use a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (with http-server)
   npx http-server
   ```
3. Navigate to `http://localhost:8000`

## Image Optimization

The project includes a script to optimize images and generate WebP versions.

### Setup

```bash
npm install
```

### Running Image Optimization

```bash
npm run optimize-images
```

This script will:
- Generate WebP versions of all JPG images in the `images/` directory
- Create optimized/resized versions for better performance
- Preserve original files

### Adding Images

1. Place your source images (JPG format) in the `images/` directory
2. Run `npm run optimize-images` to generate optimized versions
3. Reference them in HTML using both `data-bg-jpg` and `data-bg-webp` attributes

Example:
```html
<div class="question-card" 
     data-bg-jpg="/images/your-image.jpg" 
     data-bg-webp="/images/your-image.webp">
```

## Deployment

This site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### GitHub Pages Setup

1. Ensure GitHub Pages is enabled in repository settings
2. Set source to "GitHub Actions"
3. Push to `main` branch to trigger deployment
4. Site will be available at: `https://bengt-olav65.github.io/Geo-rebus-test2/`

### Manual Deployment

The deployment workflow uses GitHub Actions (`.github/workflows/deploy.yml`):
- Runs on push to `main` branch
- Uses `peaceiris/actions-gh-pages@v3` action
- Publishes repository root to GitHub Pages
- No build step required - deploys static files as-is

## Project Structure

```
.
├── index.html              # Main HTML file
├── styles.css              # Stylesheet
├── script.js               # JavaScript (answer checking, lazy loading, WebP detection)
├── README.md               # This file
├── package.json            # Node.js dependencies and scripts
├── images/                 # Image assets directory
│   ├── README.md           # Images directory documentation
│   ├── rebus2.jpg          # Background image for question 2
│   └── rebus2.webp         # WebP version (generated)
├── scripts/
│   └── optimize-images.js  # Image optimization script
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions deployment workflow
```

## Accessibility

- Semantic HTML structure
- ARIA labels for background images
- Visually hidden alt text for screen readers
- Keyboard navigation support (Enter key to submit)
- High contrast color schemes

## Browser Support

- Modern browsers with ES6 support
- WebP support (with JPG fallback for older browsers)
- IntersectionObserver API for lazy loading (with graceful degradation)

## License

This project is for educational and personal use.
