# Flower Shop Backend API

A comprehensive Node.js/Express backend API for the Flower Shop e-commerce application with MongoDB integration.

## 🌸 Features

- **Complete Product Management**: CRUD operations for plants and flowers
- **Advanced Filtering**: Category, price range, stock status, and custom filters
- **Search Functionality**: Full-text search across product names and descriptions
- **Comprehensive Product Schema**: Detailed product information including care instructions, specifications, and shipping details
- **RESTful API Design**: Clean and intuitive endpoint structure
- **MongoDB Integration**: Efficient data storage with Mongoose ODM
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **API Documentation**: Built-in API documentation endpoint

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Flower_Shop/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb+srv://yehanjb:yehan123@cluster0.71nlycn.mongodb.net/flower_shop
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5174
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Verify installation**
   Visit `http://localhost:5000/health` to check if the API is running.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /health
```

### API Documentation
```
GET /api/docs
```

## 🛍️ Product Endpoints

### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` - Filter by category (Pothos, Aloe Vera, Cactus, etc.)
- `filterCategory` - Filter by filter category (houseplants, valentine, wedding)
- `tab` - Filter by tab (recent, popular, special)
- `featured` - Filter featured products (true/false)
- `bestseller` - Filter bestseller products (true/false)
- `inStock` - Filter by stock status (true/false)
- `search` - Search query
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sortBy` - Sort field (name, price, createdAt, etc.)
- `sortOrder` - Sort order (asc/desc)
- `page` - Page number for pagination
- `limit` - Items per page

**Example:**
```bash
curl "http://localhost:5000/api/products?category=Pothos&featured=true&page=1&limit=10"
```

### Get Single Product
```http
GET /api/products/:id
```

### Create Product
```http
POST /api/products
```

**Request Body:**
```json
{
  "name": "Snake Plant",
  "category": "Cactus",
  "filterCategory": "houseplants",
  "price": 149,
  "quantity": "1",
  "description": "Beautiful snake plant perfect for beginners",
  "shortDescription": "Low-maintenance indoor plant",
  "image": "https://example.com/snake-plant.jpg",
  "features": ["Air purifying", "Low maintenance", "Pet safe"],
  "tags": ["indoor", "beginner", "air-purifying"],
  "specifications": {
    "size": "Medium (12-18 inches)",
    "potSize": "6 inch pot",
    "height": "12-18 inches",
    "origin": "West Africa"
  },
  "careInstructions": {
    "difficulty": "Easy",
    "placement": "Bright, indirect light",
    "watering": "Water when soil is completely dry",
    "feeding": "Monthly during growing season"
  },
  "plantDetails": {
    "sunlight": "Bright Indirect Light",
    "water": "When soil is dry",
    "soil": "Well-draining potting mix",
    "temperature": "65-75°F",
    "humidity": "Low (30-40%)",
    "toxicity": "Pet Safe"
  },
  "shipping": {
    "freeShipping": true,
    "shippingTime": "3-5 business days",
    "returnPolicy": "30-day return policy",
    "packaging": "Eco-friendly packaging"
  },
  "featured": false,
  "bestseller": false,
  "inStock": true
}
```

### Update Product
```http
PUT /api/products/:id
```

### Delete Product
```http
DELETE /api/products/:id
```

### Specialized Endpoints

#### Get Featured Products
```http
GET /api/products/featured
```

#### Get Bestseller Products
```http
GET /api/products/bestsellers
```

#### Get Recent Products
```http
GET /api/products/recent
```

#### Get Products by Category
```http
GET /api/products/category/:category
```

#### Search Products
```http
GET /api/products/search/:query
```

#### Update Product Stock
```http
PATCH /api/products/:id/stock
```

**Request Body:**
```json
{
  "inStock": true
}
```

#### Bulk Update Products
```http
PATCH /api/products/bulk-update
```

**Request Body:**
```json
{
  "productIds": ["id1", "id2", "id3"],
  "updateData": {
    "featured": true,
    "bestseller": false
  }
}
```

## 🗂️ Product Schema

### Required Fields
- `name` - Product name (String, required)
- `category` - Product category (String, required)
- `price` - Product price (Number, required)
- `quantity` - Available quantity (String, required)
- `description` - Product description (String, required)
- `image` - Main product image URL (String, required)

### Optional Fields
- `shortDescription` - Brief product summary
- `filterCategory` - Filter category (houseplants, valentine, wedding)
- `gallery` - Additional product images array
- `features` - Product features array
- `tags` - Product tags array
- `specifications` - Product specifications object
- `careInstructions` - Care instructions object
- `plantDetails` - Plant care details object
- `shipping` - Shipping information object
- `rating` - Product rating (0-5)
- `reviewCount` - Number of reviews
- `inStock` - Stock availability (Boolean)
- `featured` - Featured product flag (Boolean)
- `bestseller` - Bestseller flag (Boolean)

## 🔧 Development

### Available Scripts

```bash
# Start development server with nodemon
npm run dev

# Start production server
npm start

# Run tests (when implemented)
npm test
```

### Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   └── productController.js # Product business logic
├── middleware/
│   ├── errorHandler.js      # Global error handling
│   └── logger.js           # Request logging
├── models/
│   └── Product.js          # Product schema and model
├── routes/
│   └── productRoutes.js    # API route definitions
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies and scripts
├── README.md              # Documentation
└── server.js              # Main application entry point
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration time | `30d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5174` |

## 🚀 Deployment

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string
6. Update the `MONGO_URI` in your `.env` file

### Production Deployment

1. **Set environment variables**
   ```bash
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_production_mongodb_uri
   ```

2. **Install production dependencies**
   ```bash
   npm ci --only=production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

## 🔒 Security Features

- Input validation using Mongoose schema validators
- Error handling middleware
- CORS configuration
- Environment variable protection
- MongoDB injection prevention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please check the API documentation at `http://localhost:5000/api/docs` or refer to this README.

## 🔄 Version History

- **v1.0.0** - Initial release with complete product management API

## 🌐 Related Projects

- **Frontend**: React.js application (../frontend/)
- **Database**: MongoDB Atlas