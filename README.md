# Axle IA Website

A modern, multilingual website for Axle IA - providing cutting-edge AI solutions for businesses across Dubai and Côte d'Ivoire.

## 🌟 Features

### ✨ Core Functionality
- **Faithful Recreation** of axle-ia.com design
- **Multilingual Support** (English/French) with auto-detection
- **Regional Differentiation** for Dubai and Côte d'Ivoire
- **Responsive Design** optimized for all devices
- **Professional Animations** and smooth interactions

### 🔗 ClickUp Integration
- **Smart Routing** based on form type and region
- **Candidate Applications** → Recruitment lists
- **General Contacts** → Regional CRM lists
- **Real-time Form Submission** with error handling
- **Bilingual Success/Error Messages**

### 📱 User Experience
- **Mobile-First Design** with hamburger navigation
- **Accessibility Features** with keyboard navigation
- **Performance Optimized** with lazy loading
- **SEO Friendly** with semantic HTML

## 🏗️ Project Structure

```
axle-ia-website/
├── index.html              # Main landing page
├── css/
│   ├── styles.css          # Main styles
│   └── responsive.css      # Responsive breakpoints
├── js/
│   ├── main.js            # Core functionality
│   ├── translations.js    # Language system
│   └── clickup-integration.js # ClickUp API integration
├── pages/
│   ├── blog.html          # Blog section (future)
│   └── careers.html       # Careers page (future)
├── assets/
│   ├── images/            # Image assets
│   └── icons/             # Icon files
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Local web server (optional but recommended)

### Installation

1. **Clone or download** the project files
2. **Open in browser** directly or serve via local server

#### Option A: Direct Browser
```bash
open index.html
```

#### Option B: Local Server (Recommended)
```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## ⚙️ ClickUp Configuration

The website is pre-configured with your ClickUp integration:

### 🎯 Form Routing
- **Dubai Contacts** → `Virtual Office > CRM > Contacts Dubai`
- **CI Contacts** → `Virtual Office > CRM > Contacts CI`
- **Dubai Applications** → `Virtual Office > CRM > Recrutement > Candidats Dubai`
- **CI Applications** → `Virtual Office > CRM > Recrutement > Candidats CI`

### 📋 Task Creation
Each form submission creates a structured task with:
- **Contact Information** (name, email, company)
- **Regional Context** (Dubai/CI)
- **Language Preference** (EN/FR)
- **Submission Details** (timestamp, source)
- **Appropriate Tags** for filtering

## 🌐 Multilingual System

### Language Detection
1. **User Preference** (localStorage)
2. **Browser Language** (navigator.language)
3. **Default** (English)

### Adding Translations
Edit `js/translations.js`:

```javascript
const translations = {
    en: {
        new_key: "English text"
    },
    fr: {
        new_key: "Texte français"
    }
};
```

Use in HTML:
```html
<p data-translate="new_key">Default text</p>
```

## 🎨 Customization

### Colors
Edit CSS variables in `css/styles.css`:

```css
:root {
    --primary-color: #0066ff;
    --secondary-color: #003d99;
    /* ... other colors */
}
```

### Content
- **Main text**: Edit `index.html` directly
- **Translations**: Update `js/translations.js`
- **Contact info**: Modify footer sections

### Adding Pages
1. Create HTML file in `pages/`
2. Copy navigation from `index.html`
3. Include same CSS/JS files
4. Add navigation link

## 📱 Responsive Breakpoints

- **Large Desktop**: 1400px+
- **Desktop**: 1200px+
- **Tablet Landscape**: 992px
- **Tablet Portrait**: 768px
- **Mobile**: 576px
- **Small Mobile**: 480px

## 🔧 Browser Support

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

## 📊 Performance Features

- **Lazy Loading** for images
- **Intersection Observer** for animations
- **Throttled Scroll Events**
- **Optimized CSS/JS**
- **Efficient DOM Queries**

## 🎯 SEO Features

- **Semantic HTML5** structure
- **Meta tags** for descriptions/keywords
- **Proper heading hierarchy**
- **Alt tags** for images
- **Structured data** ready

## 🚀 Deployment Options

### GitHub Pages
1. Push to GitHub repository
2. Enable Pages in repository settings
3. Select source branch
4. Access at `username.github.io/repo-name`

### Netlify
1. Connect GitHub repository
2. Build settings: None (static site)
3. Publish directory: `/`
4. Deploy automatically

### Vercel
1. Import from GitHub
2. Framework preset: Other
3. Deploy instantly

### Traditional Hosting
1. Upload all files via FTP/SFTP
2. Ensure `index.html` is in root
3. Configure server (if needed)

## 📞 Support

### Contact Information
- **Email**: hello@axle-ia.com
- **Website**: axle-ia.com

### Technical Issues
1. Check browser console for errors
2. Verify ClickUp configuration
3. Test form submissions
4. Check network connectivity

## 📄 License

© 2024 Axle IA. All rights reserved.

---

**Built with ❤️ for Axle IA**  
*Transforming businesses through AI solutions*