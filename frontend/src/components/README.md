# Responsive Navbar Component

This is a fully responsive navbar component for the Flower Shop application, built with React and CSS.

## Features

- **Fully Responsive**: Adapts to different screen sizes (1400px, 1200px, 992px, 768px, 480px)
- **Mobile Menu**: Hamburger menu for mobile devices
- **Fixed Position**: Stays at the top of the page while scrolling
- **Modern Design**: Clean, professional appearance with shadow effects
- **Accessibility**: Includes ARIA labels and proper semantic HTML

## Responsive Breakpoints

- **1400px and above**: Full desktop layout
- **1200px**: Slightly smaller spacing and font sizes
- **992px**: Compact desktop layout
- **768px and below**: Mobile layout with hamburger menu
- **480px and below**: Extra compact mobile layout

## Styling

The component uses:
- **Font**: Familjen Grotesk (imported from Google Fonts)
- **Primary Color**: #164C0D (forest green)
- **Background**: White with shadow
- **Font Weight**: 700 (bold) for navigation items

## Component Structure

```jsx
<nav className="navbar">
  <div className="navbar-container">
    <div className="navbar-logo">
      <img src="/logo.svg" alt="Flora Shop Logo" />
    </div>
    
    <div className="mobile-menu-toggle">
      <!-- Hamburger icon -->
    </div>
    
    <div className="navbar-menu">
      <ul className="navbar-nav">
        <!-- Navigation items -->
      </ul>
      
      <div className="navbar-actions">
        <!-- Cart and User buttons -->
      </div>
    </div>
  </div>
</nav>
```

## Usage

1. Import the component:
```jsx
import Navbar from './components/Navbar';
```

2. Add it to your App component:
```jsx
function App() {
  return (
    <>
      <Navbar />
      {/* Your other content */}
    </>
  );
}
```

## Customization

### Logo
Replace `/logo.svg` with your own logo file in the `public` folder.

### Colors
Update the color variables in `Navbar.css`:
```css
color: #164C0D; /* Change this to your brand color */
```

### Navigation Items
Modify the navigation items in `Navbar.jsx`:
```jsx
<li className="nav-item">
  <a href="#your-section" className="nav-link">YOUR ITEM</a>
</li>
```

### Active State
The active navigation item has an underline. Update the active class in JavaScript or CSS as needed.

## Mobile Behavior

- On screens 768px and below, the navigation switches to a mobile menu
- The hamburger icon toggles the mobile menu
- Menu items are displayed vertically in a full-screen overlay
- Body scroll is disabled when the mobile menu is open
- Clicking on navigation items automatically closes the mobile menu

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- ES6+ JavaScript features used

## Dependencies

- React 18+
- Google Fonts (Familjen Grotesk)
- SVG icons for cart and user actions
