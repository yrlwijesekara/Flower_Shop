# 🌸 Flower Shop - Full Stack E-commerce Application

A modern, full-featured flower shop e-commerce platform built with React.js frontend and Node.js/Express backend, featuring MongoDB database integration.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Product Categories](#product-categories)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🛒 E-commerce Core Features
- **Product Catalog** - Browse plants and flowers by categories
- **Advanced Search & Filtering** - Search products with text indexing and category filters
- **Shopping Cart** - Add, update, remove items with persistent storage
- **Wishlist** - Save favorite products for later purchase
- **Secure Checkout** - Multiple payment options (Cash on Delivery, Online Payment)
- **Order Management** - Track order status and history

### 👤 User Management
- **User Authentication** - Register, login, logout with JWT tokens
- **Profile Management** - Update personal information and addresses
- **Session Management** - Persistent cart and wishlist across sessions

### 🎨 User Experience
- **Responsive Design** - Mobile-first approach with modern UI
- **Interactive Components** - Carousels, product cards, and smooth animations
- **Real-time Updates** - Dynamic cart and wishlist updates
- **Breadcrumb Navigation** - Easy navigation with breadcrumbs
- **Product Reviews** - Customer feedback and ratings system

### 🛡️ Security & Performance
- **JWT Authentication** - Secure token-based authentication
- **Password Encryption** - bcrypt for secure password hashing
- **CORS Protection** - Cross-origin resource sharing configuration
- **Error Handling** - Comprehensive error handling and logging
- **MongoDB Indexing** - Optimized database queries with text search

## 🚀 Tech Stack

### Frontend
- **React.js 19.1.0** - Modern component-based UI library
- **Vite 7.0.4** - Fast build tool and development server
- **React Router DOM 7.7.1** - Client-side routing
- **React Icons 5.5.0** - Icon library
- **Leaflet** - Interactive maps for location services
- **CSS3** - Custom styling with responsive design

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 4.21.2** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token for authentication
- **bcryptjs** - Password hashing library
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Database
- **MongoDB Atlas** - Cloud database service
- **Mongoose 8.17.2** - Object Data Modeling (ODM) library

## 📁 Project Structure

```
Flower_Shop/
├── frontend/                    # React.js Frontend
│   ├── public/                  # Static assets
│   │   ├── images/             # Product images
│   │   ├── carousel/           # Carousel images
│   │   ├── admin/              # Admin panel assets
│   │   └── ...
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ...
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── ...
│   │   ├── services/           # API service functions
│   │   └── assets/             # Frontend assets
│   └── package.json
│
├── backend/                     # Node.js Backend
│   ├── config/                 # Configuration files
│   │   └── database.js         # MongoDB connection
│   ├── controllers/            # Route controllers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── wishlistController.js
│   │   ├── checkoutController.js
│   │   └── ...
│   ├── middleware/             # Express middleware
│   │   ├── auth.js            # Authentication middleware
│   │   ├── errorHandler.js    # Error handling
│   │   └── logger.js          # Request logging
│   ├── models/                 # MongoDB schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Wishlist.js
│   │   ├── Order.js
│   │   └── ...
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── wishlistRoutes.js
│   │   └── ...
│   ├── services/               # Business logic services
│   ├── scripts/                # Utility scripts
│   ├── .env                    # Environment variables
│   ├── server.js               # Main server file
│   └── package.json
│
└── README.md                    # Project documentation
```

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB Atlas account** (or local MongoDB installation)
- **Git** (for version control)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Hirunidiv/Flower_Shop.git
cd Flower_Shop
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file (see Environment Configuration section)
# The .env file should already be created with your MongoDB URI

# Start the backend server
npm start

# For development with auto-restart
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## ⚙️ Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://yehanjb:yehan123@cluster0.71nlycn.mongodb.net/flower_shop

# Server Configuration
PORT=8000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_strong_jwt_secret_key_here

# Optional: Additional configurations
SESSION_SECRET=your_session_secret
UPLOAD_PATH=./uploads
```

**Important:** 
- Replace `JWT_SECRET` with a strong, unique secret key
- Never commit the `.env` file to version control
- The `.env` file is already included in `.gitignore`

## 🎯 Usage

### Starting the Application

1. **Start Backend Server:**
   ```bash
   cd backend
   npm start
   ```
   Backend will run on: `http://localhost:8000`

2. **Start Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on: `http://localhost:5173`

### Default URLs

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000`
- **API Documentation:** `http://localhost:8000/api/docs`
- **Health Check:** `http://localhost:8000/health`

## 📚 API Endpoints

### Authentication Endpoints
```
POST /api/auth/register     # Register new user
POST /api/auth/login        # Login user
GET  /api/auth/me          # Get current user (Private)
PUT  /api/auth/profile     # Update user profile (Private)
PUT  /api/auth/password    # Update password (Private)
POST /api/auth/logout      # Logout user (Private)
```

### Product Endpoints
```
GET  /api/products              # Get all products with filtering
GET  /api/products/:id          # Get single product
GET  /api/products/featured     # Get featured products
GET  /api/products/bestsellers  # Get bestseller products
GET  /api/products/recent       # Get recent products
GET  /api/products/category/:category  # Get products by category
```

### Cart Endpoints
```
POST   /api/cart/session                    # Generate new session ID
GET    /api/cart/:sessionId                 # Get user's cart
POST   /api/cart/:sessionId/items          # Add item to cart
PUT    /api/cart/:sessionId/items/:productId  # Update cart item quantity
DELETE /api/cart/:sessionId/items/:productId  # Remove item from cart
DELETE /api/cart/:sessionId                # Clear entire cart
POST   /api/cart/:sessionId/merge          # Merge guest cart with user cart
```

### Wishlist Endpoints
```
GET    /api/wishlist           # Get user's wishlist (Private)
POST   /api/wishlist/add       # Add product to wishlist (Private)
DELETE /api/wishlist/remove    # Remove product from wishlist (Private)
POST   /api/wishlist/toggle    # Toggle product in wishlist (Private)
DELETE /api/wishlist/clear     # Clear entire wishlist (Private)
```

### Checkout Endpoints
```
POST /api/checkout/process     # Process order (Private)
GET  /api/orders              # Get user orders (Private)
GET  /api/orders/:id          # Get specific order (Private)
```

## 🌺 Product Categories

The application supports the following product categories:

### Main Categories:
- **Pothos** - Popular trailing houseplants
- **Aloe Vera** - Succulent plants with healing properties
- **Cactus** - Desert plants requiring minimal care
- **Tropical** - Exotic plants from tropical regions
- **Indoor Tree** - Large indoor plants
- **Flowering** - Plants that produce flowers
- **Air Purifying** - Plants that clean indoor air
- **Low Light** - Plants suitable for low-light conditions
- **Wedding Flowers** - Special occasion flowers

### Filter Categories:
- **Houseplants** - Indoor plants for home decoration
- **Valentine** - Romantic flowers for special occasions
- **Wedding** - Bridal and ceremonial flowers

## 🔐 Authentication

The application uses JWT (JSON Web Token) based authentication:

### Features:
- **Registration** - Create new user accounts
- **Login/Logout** - Secure session management
- **Password Encryption** - bcrypt hashing for security
- **Protected Routes** - Private endpoints requiring authentication
- **Token Refresh** - Automatic token renewal
- **Profile Management** - Update user information

### User Roles:
- **Customer** - Regular users who can browse and purchase
- **Admin** - Administrative users with management capabilities

## 🛒 Shopping Features

### Cart Management
- **Persistent Cart** - Cart data saved in localStorage and database
- **Session-based** - Guest users can add items before registration
- **Real-time Updates** - Automatic quantity and price calculations
- **Cart Merge** - Merge guest cart with user cart after login

### Wishlist System
- **Save for Later** - Add products to wishlist for future purchase
- **Easy Management** - Add/remove items with one click
- **Persistent Storage** - Wishlist synced across devices
- **Quick Add to Cart** - Move items from wishlist to cart

### Search & Filtering
- **Text Search** - Full-text search across product names and descriptions
- **Category Filtering** - Filter by plant categories
- **Price Range** - Filter products by price range
- **Sorting Options** - Sort by relevance, price, date, popularity

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-First** - Optimized for mobile devices
- **Tablet Support** - Perfect display on tablets
- **Desktop Enhanced** - Rich experience on larger screens

### Interactive Elements
- **Product Carousel** - Showcase featured products
- **Image Gallery** - Multiple product images
- **Smooth Animations** - CSS transitions and effects
- **Loading States** - Visual feedback during operations

### Navigation
- **Breadcrumbs** - Clear navigation path
- **Search Bar** - Global product search
- **Category Menu** - Easy category browsing
- **Quick Actions** - Add to cart/wishlist buttons

## 🚀 Performance Features

### Frontend Optimization
- **Vite Build Tool** - Fast development and build process
- **Code Splitting** - Optimized bundle sizes
- **Lazy Loading** - Load components on demand
- **Image Optimization** - Efficient image loading

### Backend Optimization
- **MongoDB Indexing** - Fast database queries
- **Response Caching** - Cache frequently requested data
- **Error Handling** - Comprehensive error management
- **Request Logging** - Monitor API usage

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev    # Start development server
npm run build  # Build for production
npm run lint   # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev    # Start with nodemon (auto-restart)
npm start      # Start production server
npm test       # Run tests (if available)
```

### Code Quality
- **ESLint** - JavaScript/React linting
- **Error Boundaries** - React error handling
- **Type Safety** - PropTypes validation
- **Code Organization** - Modular component structure

## 📱 Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License. See the `LICENSE` file for details.

## 👥 Authors

- **Hirunidiv** - *Initial work* - [GitHub Profile](https://github.com/Hirunidiv)

## 🙏 Acknowledgments

- React.js community for excellent documentation
- MongoDB for robust database solutions
- Express.js for simple and flexible web framework
- All contributors who helped improve this project

## 📞 Support

If you have any questions or need help with setup, please:

1. Check the [Issues](https://github.com/Hirunidiv/Flower_Shop/issues) page
2. Create a new issue if your problem isn't already listed
3. Provide detailed information about your environment and the issue

---

**Happy Coding! 🌸**
