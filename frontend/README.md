# BookStore Frontend

A modern React application for the online bookstore.

## Features

- 🔐 User authentication (Login/Register)
- 📚 Browse books with search functionality
- 📖 View book details
- 🛒 Shopping cart
- 📦 Order management
- 🎨 Modern, responsive UI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Backend Connection

Make sure the backend server is running on `http://localhost:8081`. You can change the API base URL in `src/services/api.js` if needed.

## Project Structure

```
src/
├── components/       # React components
│   ├── BookList.js
│   ├── BookDetail.js
│   ├── Cart.js
│   ├── Login.js
│   ├── Register.js
│   ├── Orders.js
│   ├── Navbar.js
│   └── Home.js
├── context/          # React Context providers
│   ├── AuthContext.js
│   └── CartContext.js
├── services/         # API service layer
│   └── api.js
└── App.js            # Main app component with routing
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## Technologies Used

- React 19
- React Router DOM
- Axios
- CSS3
