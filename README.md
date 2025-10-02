# User Screens 4 Isaac

A modern Express.js server built with TypeScript for managing user interface screens and components. This project provides a RESTful API for creating, managing, and organizing user interface screens for Isaac's applications.

## Features

- ✅ **TypeScript** - Full TypeScript support with strict configuration
- ✅ **Express.js** - Fast, unopinionated web framework
- ✅ **CORS** - Cross-Origin Resource Sharing enabled
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Logging** - Request/response logging middleware
- ✅ **Static Files** - Serve static files from public directory
- ✅ **Health Checks** - Built-in health check endpoints
- ✅ **RESTful API** - CRUD operations for user screens and components
- ✅ **Screen Management** - Create, update, and organize UI screens
- ✅ **Hot Reload** - Development server with auto-restart

## Project Structure

```
express_server/
├── src/
│   ├── middleware/
│   │   ├── errorHandler.ts    # Error handling middleware
│   │   └── logger.ts          # Request logging middleware
│   ├── routes/
│   │   ├── api.ts            # General API routes (/api/*)
│   │   ├── screens.ts        # Screen management routes (/api/screens/*)
│   │   └── health.ts         # Health check routes
│   └── index.ts              # Main server file
├── public/
│   └── index.html            # Static HTML documentation
├── package.json
├── tsconfig.json
└── README.md
```

## Quick Start

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Start development server**
   ```bash
   bun run dev
   ```

3. **Access the server**
   - Server: http://localhost:3003
   - API Documentation: http://localhost:3003
   - Health Check: http://localhost:3003/health

### Why Bun?

This project uses [Bun](https://bun.sh/) instead of npm for better performance and compatibility with corporate security environments. Bun provides:
- ⚡ **Faster installs** - Up to 10x faster than npm
- 🔒 **Better security compatibility** - Works well with corporate firewalls
- 🔄 **Hot reload** - Built-in watch mode with `--watch`
- 📦 **All-in-one** - Runtime, bundler, and package manager

## Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build TypeScript to JavaScript
- `bun start` - Start production server with Bun
- `bun run start:prod` - Start production server with Node.js (requires build first)

## API Endpoints

### Health Endpoints
- `GET /health` - Server health status
- `GET /health/ping` - Simple ping/pong

### Screen Management API
- `GET /api/screens` - Get all screens (supports ?type= and ?status= filters)
- `GET /api/screens/:id` - Get specific screen by ID
- `POST /api/screens` - Create new screen
- `PUT /api/screens/:id` - Update screen
- `DELETE /api/screens/:id` - Delete screen
- `GET /api/screens/meta/types` - Get available screen types

### General API Endpoints
- `GET /api/hello` - Hello message
- `GET /api/users` - Get all users (sample data)
- `GET /api/users/:id` - Get user by ID

## Example Usage

### Get all screens
```bash
curl http://localhost:3000/api/screens
```

### Get screens by type
```bash
curl http://localhost:3000/api/screens?type=authentication
```

### Create a new screen
```bash
curl -X POST http://localhost:3000/api/screens \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Registration Screen",
    "type": "authentication", 
    "description": "User registration form",
    "components": ["email-input", "password-input", "confirm-password", "register-button"],
    "status": "draft"
  }'
```

### Update a screen
```bash
curl -X PUT http://localhost:3000/api/screens/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Login Screen",
    "type": "authentication",
    "description": "Enhanced login interface with social auth",
    "components": ["email-input", "password-input", "login-button", "social-auth-buttons"],
    "status": "active"
  }'
```

### Delete a screen
```bash
curl -X DELETE http://localhost:3000/api/screens/1
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

## Development

The server includes:
- **Hot reload** - Changes automatically restart the server
- **TypeScript compilation** - Real-time TypeScript checking
- **Request logging** - All requests are logged with timing
- **Error handling** - Centralized error handling with stack traces
- **CORS enabled** - Ready for frontend integration

## Next Steps

To extend this server, you can:

1. **Add a database** - Integrate MongoDB, PostgreSQL, or MySQL
2. **Add authentication** - JWT tokens, sessions, or OAuth
3. **Add validation** - Request validation with Joi or Yup
4. **Add testing** - Unit and integration tests with Jest
5. **Add documentation** - Swagger/OpenAPI documentation
6. **Add rate limiting** - Protect against abuse
7. **Add caching** - Redis or in-memory caching
