# Inventory Management Client

A professional, modular frontend application for the Inventory Management API built with vanilla JavaScript and Vite.

## 🚀 Features

- **Products Management**: Full CRUD operations with pagination and search
- **Categories View**: Display categories with product counts
- **Low Stock Alerts**: Real-time monitoring of products below threshold
- **Modern UI**: Responsive design with CSS custom properties
- **Modular Architecture**: Clean separation of concerns with components, services, and utilities

## 📁 Project Structure

```
clienteSD/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── base/           # Base components (Component, Modal, Toast)
│   │   ├── layout/         # Layout components (Header, Footer)
│   │   ├── products/       # Product-related components
│   │   ├── categories/     # Category components
│   │   └── alerts/         # Alert components
│   ├── config/             # Application configuration
│   ├── services/           # API services (HTTP client, Products, Categories)
│   ├── styles/             # CSS stylesheets
│   ├── utils/              # Utility functions
│   ├── views/              # View controllers
│   └── main.js             # Application entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## ⚙️ Configuration

### API URL

The default API URL is `https://localhost:7001/api`. You can change it:

1. **Environment Variable**: Create a `.env` file:
   ```
   VITE_API_URL=https://your-api-url/api
   ```

2. **Runtime Configuration**: Use the API URL input in the footer

### CORS

Ensure your backend API has CORS configured for the frontend origin.

## 🎨 Architecture

### Components

All UI components extend the base `Component` class which provides:
- Lifecycle methods (mount, unmount)
- Event listener management
- DOM manipulation utilities

### Services

- **HttpClient**: Centralized HTTP handling with retry logic and error handling
- **ProductsService**: Product CRUD operations
- **CategoriesService**: Category operations

### Views

Each view manages a section of the application:
- **ProductsView**: Products list, search, pagination, and CRUD modals
- **CategoriesView**: Category cards display
- **AlertsView**: Low stock alerts table

## 🎹 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + 1` | Go to Products |
| `Alt + 2` | Go to Categories |
| `Alt + 3` | Go to Alerts |
| `Escape` | Close modal |

## 📦 Dependencies

### Production
- `toastify-js` - Toast notifications

### Development
- `vite` - Build tool and dev server
- `eslint` - Code linting
- `prettier` - Code formatting

## 🤝 API Endpoints

The application connects to the following API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get paginated products |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/search?q=` | Search products |
| GET | `/api/products/alerts` | Get low stock alerts |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get category by ID |

## 📝 License

MIT
