# Online Bookstore

A full-stack online bookstore application with React frontend and Spring Boot backend.

## Project Structure

```
Online-bookstore/
├── backend/          # Spring Boot backend (Java)
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/         # React frontend
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

## Features

- 🔐 JWT-based authentication
- 📚 Book browsing and search
- 🛒 Shopping cart
- 📦 Order management
- 👤 User registration and login

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Run the Spring Boot application:
```bash
./mvnw spring-boot:run
```

The backend will run on `http://localhost:8081`

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get JWT token

### Books
- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `POST /api/books` - Create a book (authenticated)
- `PUT /api/books/{id}` - Update a book (authenticated)
- `DELETE /api/books/{id}` - Delete a book (authenticated)

### Orders
- `GET /api/orders` - Get all orders (authenticated)
- `GET /api/orders/history/{userId}` - Get user's order history (authenticated)
- `POST /api/orders` - Place an order (authenticated)

## Technologies

### Backend
- Spring Boot 4.0.0
- Spring Security with JWT
- MongoDB
- Maven

### Frontend
- React 19
- React Router DOM
- Axios
- CSS3

## Notes

- Make sure MongoDB is running and configured in `backend/src/main/resources/application.properties`
- The backend must be running before using the frontend
- JWT tokens are stored in localStorage
