# Task Manager - Full-Stack Web Application

A comprehensive task management system built with **ASP.NET Core 8.0** (Backend), **React 18** (Frontend), **Entity Framework Core** (Database), and **xUnit** (Testing). This modern application features complete user authentication, role-based access control, responsive design, and an intuitive user interface for managing tasks efficiently.

## ✨ Key Highlights

- 🔐 **Complete Authentication System** with JWT tokens and secure password hashing
- 🎨 **Modern Glass Morphism UI** with smooth animations and responsive design
- 📱 **Mobile-First Responsive Design** optimized for all device sizes
- 🛡️ **Role-Based Access Control** (User, Admin) with protected routes
- 🚀 **Real-Time Validation** with enhanced user feedback
- 🎯 **User-Specific Task Management** with advanced filtering
- 🌟 **Professional Grade Design System** with consistent styling

## 🚀 Features

### 🔐 Authentication & Security
- **JWT Authentication** with secure token management
- **BCrypt Password Hashing** for maximum security
- **Protected Routes** with role-based access control
- **Auto-logout** on token expiration
- **Remember User Sessions** with local storage
- **Password Validation** with strength requirements
- **Account Creation** with email uniqueness validation

### 🎨 Modern UI/UX Design
- **Glass Morphism Design** with backdrop blur effects
- **Smooth Animations** and micro-interactions
- **Professional Color System** with CSS custom properties
- **Responsive Typography** with perfect scaling
- **Enhanced Form Controls** with better accessibility
- **Loading States** and interactive feedback
- **Modern Card Layouts** with elevated shadows

### 📱 Responsive Design
- **Mobile-First Approach** with breakpoints for all screen sizes
- **Touch-Optimized Controls** for mobile devices
- **Adaptive Layouts** that work on any device
- **iOS-Safe Font Sizes** to prevent unwanted zoom
- **Landscape Mode Support** with special handling
- **Cross-Browser Compatibility** with modern CSS features

### Backend (ASP.NET Core 8.0 API)
- **RESTful API** with comprehensive CRUD operations
- **JWT Authentication** with role-based authorization
- **Password Security** using BCrypt hashing
- **Data Validation** using Data Annotations and custom validators
- **User Management** with last login tracking and account status
- **Task Filtering** by user, status, category, and priority
- **Swagger/OpenAPI Documentation** with authentication support
- **Asynchronous Operations** for optimal performance
- **Error Handling** with consistent response formats

### Frontend (React 18)
- **Modern React** with hooks and functional components
- **Authentication Context** with global state management
- **Protected Routes** with automatic redirection
- **Form Validation** with real-time feedback
- **Loading States** with professional spinners
- **Error Handling** with user-friendly messages
- **Responsive Navigation** with conditional rendering
- **Professional Theming** with CSS custom properties

### Database (Entity Framework Core)
- **Code-First Approach** with comprehensive migrations
- **User Authentication Schema** with secure password storage
- **Enhanced User Model** with role management and login tracking
- **One-to-Many Relationships**: User → Tasks with proper constraints
- **Data Seeding** for development and testing
- **SQLite** for development (zero-configuration setup)
- **SQL Server** support for production environments
- **Migration History** with proper versioning

### Testing (xUnit)
- **Comprehensive Unit Tests** for all controller actions
- **Authentication Testing** with JWT token validation
- **Integration Tests** using InMemory database
- **Security Testing** for protected endpoints
- **Validation Testing** for all data models
- **Full Workflow Testing** (register → login → CRUD operations)

## 🏗️ Enhanced Architecture

```
TaskManager/
├── backend/
│   ├── TaskManager.API/              # Main API project
│   │   ├── Controllers/              # API controllers with auth
│   │   │   ├── AuthController.cs     # Authentication endpoints
│   │   │   ├── UsersController.cs    # User management
│   │   │   └── TasksController.cs    # Task management
│   │   ├── Models/                   # Enhanced entity models
│   │   │   ├── User.cs              # User with auth fields
│   │   │   └── TaskItem.cs          # Task model
│   │   ├── DTOs/                     # Data Transfer Objects
│   │   │   ├── AuthDtos.cs          # Authentication DTOs
│   │   │   ├── UserDtos.cs          # User DTOs
│   │   │   └── TaskDtos.cs          # Task DTOs
│   │   ├── Data/                     # Database context
│   │   │   └── TaskManagerDbContext.cs
│   │   ├── Services/                 # Business logic services
│   │   ├── Middleware/              # Custom middleware
│   │   └── Program.cs               # App configuration with JWT
│   ├── TaskManager.Tests/            # Comprehensive test suite
│   └── TaskManager.sln              # Solution file
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── Navbar.jsx          # Enhanced navigation
│   │   │   └── ProtectedRoute.tsx   # Route protection
│   │   ├── pages/                   # Page components
│   │   │   ├── LoginPage.tsx        # Modern login form
│   │   │   ├── RegisterPage.tsx     # Modern registration
│   │   │   ├── HomePage.jsx         # Dashboard
│   │   │   ├── TasksPage.jsx        # Task management
│   │   │   └── ProfilePage.jsx      # User profile
│   │   ├── context/                 # React Context
│   │   │   └── AuthContext.tsx      # Authentication state
│   │   ├── services/                # API service layer
│   │   │   ├── authService.ts       # Authentication API
│   │   │   └── api.js              # General API client
│   │   ├── styles/                  # Styling
│   │   │   └── index.css           # Modern design system
│   │   └── App.jsx                  # Main application
│   ├── package.json                 # Dependencies
│   └── vite.config.js              # Vite configuration
└── README.md                        # This enhanced documentation
```
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API service layer
│   │   └── App.jsx              # Main React application
│   ├── package.json             # Dependencies and scripts
│   └── vite.config.js           # Vite configuration
└── README.md                    # This file
```

## 🛠️ Technologies Used

### Backend
- **ASP.NET Core 8.0** - Latest .NET framework
- **Entity Framework Core 8.0** - Modern ORM with migrations
- **JWT Authentication** - Secure token-based authentication
- **BCrypt.Net** - Industry-standard password hashing
- **Swagger/OpenAPI** - Interactive API documentation
- **xUnit** - Comprehensive testing framework
- **SQLite/SQL Server** - Flexible database options

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool with HMR (Hot Module Replacement)
- **React Router DOM v6** - Client-side routing with protected routes
- **Axios** - Promise-based HTTP client with interceptors
- **Bootstrap 5.3** - Responsive CSS framework
- **FontAwesome** - Professional icon library
- **CSS Custom Properties** - Modern styling with design tokens

### Design System
- **Glass Morphism UI** - Modern translucent design aesthetic
- **CSS Grid & Flexbox** - Advanced layout systems
- **CSS Animations** - Smooth transitions and micro-interactions
- **Responsive Breakpoints** - Mobile-first responsive design
- **Modern Color Palette** - Carefully selected color system
- **Typography Scale** - Consistent font sizing and hierarchy

### Development Tools
- **VS Code** - Primary development environment
- **ESLint** - Code linting for JavaScript/TypeScript
- **Prettier** - Code formatting for consistency
- **Git** - Version control system
- **npm** - Package management

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **.NET 8.0 SDK** or later - [Download here](https://dotnet.microsoft.com/download)
- **Node.js v18** or later - [Download here](https://nodejs.org/)
- **Git** for version control - [Download here](https://git-scm.com/)
- **Visual Studio Code** or **Visual Studio 2022** (recommended)
- **SQL Server** (optional - SQLite is used by default for development)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TaskManager
```

### 2. Backend Setup

#### Navigate to the backend directory:
```bash
cd backend/TaskManager.API
```

#### Restore NuGet packages:
```bash
dotnet restore
```

#### Install Entity Framework tools (if not already installed):
```bash
dotnet tool install --global dotnet-ef
```

#### Apply database migrations:
```bash
# Create migration (if needed)
dotnet ef migrations add InitialMigration

# Update database
dotnet ef database update
```

#### Run the API:
```bash
dotnet run --urls "http://localhost:5000"
```

The API will start at `http://localhost:5000` with Swagger documentation available at the root URL.

### 3. Frontend Setup

#### Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

#### Install dependencies:
```bash
npm install
```

#### Start the development server:
```bash
npm run dev
```

The React application will start at `http://localhost:5173` (Vite's default port).

### 4. First-Time Setup

1. **Register a new account** at `http://localhost:5173/register`
2. **Login** with your credentials at `http://localhost:5173/login`
3. **Start managing tasks** from the dashboard

## 🔐 Authentication Flow

### Registration Process
1. Navigate to `/register`
2. Fill in: First Name, Last Name, Email, Password, Confirm Password, Role
3. System validates email uniqueness and password strength
4. Account created with secure password hashing (BCrypt)
5. Automatic login after successful registration

### Login Process
1. Navigate to `/login`
2. Enter email and password
3. System validates credentials and generates JWT token
4. Token stored securely in local storage
5. Automatic redirection to dashboard

### Security Features
- **JWT Tokens** with expiration handling
- **Automatic logout** on token expiry
- **Protected routes** require authentication
- **Role-based access** (User/Admin permissions)
- **Password hashing** using BCrypt (cost factor 12)

## 📚 API Documentation

Once the backend is running, you can access the interactive Swagger documentation at:
- **Swagger UI**: `http://localhost:5000`
- **API Base URL**: `http://localhost:5000/api`

### 🔐 Authentication Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/validate` - Validate current JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### 👥 User Management Endpoints

#### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/{id}` - Update user details
- `DELETE /api/users/{id}` - Delete user (Admin only)
- `GET /api/users/role/{role}` - Get users by role (Admin only)

### ✅ Task Management Endpoints

#### Tasks
- `GET /api/tasks` - Get current user's tasks
- `GET /api/tasks/{id}` - Get specific task by ID
- `GET /api/tasks/user/{userId}` - Get tasks by user (Admin only)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update existing task
- `PATCH /api/tasks/{id}/status` - Update task status only
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/filter` - Advanced task filtering

#### Task Filtering Parameters
- `status` - Filter by task status (Pending, InProgress, Completed)
- `priority` - Filter by priority level (Low, Medium, High)
- `category` - Filter by task category
- `dueDate` - Filter by due date range
- `assignedTo` - Filter by assigned user (Admin only)

## 🎯 Application Features in Detail

### 🔐 User Authentication & Authorization
- **Secure Registration** with email validation and password strength requirements
- **JWT-Based Login** with automatic token refresh capabilities  
- **Role-Based Access Control** (User/Admin) with different permission levels
- **Protected Routes** that redirect unauthenticated users to login
- **Session Management** with persistent login state across browser sessions
- **Automatic Logout** on token expiration with user notification

### ✅ Advanced Task Management
- **User-Specific Tasks** - Each user sees only their assigned tasks
- **Rich Task Properties** - Title, description, priority, category, due dates
- **Status Tracking** - Pending → InProgress → Completed workflow
- **Priority Levels** - Visual indicators for Low, Medium, High priority tasks
- **Category Organization** - Custom categories for task organization
- **Due Date Management** - Calendar integration with overdue notifications
- **Task Assignment** - Admin users can assign tasks to other users

### 📊 Dashboard & Analytics
- **Personal Dashboard** with task overview and statistics
- **Visual Priority Indicators** with color-coded priority levels
- **Progress Tracking** with completion percentages and trends
- **Recent Activity** showing latest task updates and completions
- **Quick Actions** for creating and updating tasks efficiently

### 🎨 Modern User Interface
- **Glass Morphism Design** with translucent cards and backdrop blur effects
- **Smooth Animations** including hover effects, loading states, and transitions
- **Responsive Navigation** with collapsible mobile menu and user dropdown
- **Professional Forms** with real-time validation and error messaging
- **Loading States** with elegant spinners and skeleton loading
- **Toast Notifications** for user feedback on actions and errors

## 📱 Responsive Design Features

### 🖥️ Desktop Experience (1200px+)
- **Wide Layout** with optimal content spacing and generous padding
- **Enhanced Cards** with maximum width constraints for readability  
- **Professional Spacing** with 3rem padding for visual hierarchy
- **Advanced Hover Effects** with smooth transitions and micro-interactions

### 💻 Tablet Experience (768px - 1199px)
- **Adaptive Columns** that stack appropriately for tablet screens
- **Touch-Optimized Controls** with larger tap targets and spacing
- **Balanced Typography** with proper scaling for medium screens
- **Optimized Form Layouts** with logical field grouping

### 📱 Mobile Experience (320px - 767px)
- **Mobile-First Design** with full-width responsive layout
- **Touch-Friendly Interface** with 44px minimum touch targets
- **iOS-Safe Font Sizes** (16px minimum) to prevent unwanted zoom
- **Optimized Navigation** with collapsible menu and easy access
- **Thumb-Friendly Actions** positioned for natural mobile interaction

### 🔄 Orientation Support
- **Portrait Mode** optimized for scrolling and reading
- **Landscape Mode** with adjusted spacing and layout for wider screens
- **Dynamic Viewport** handling for rotating devices
- **Flexible Content** that adapts to available screen real estate

## 🧪 Running Tests

### Backend Tests

#### Run all tests:
```bash
cd backend
dotnet test
```

#### Run specific test categories:
```bash
# Authentication tests only
dotnet test --filter Category=Authentication

# Integration tests only  
dotnet test --filter Category=Integration

# Unit tests only
dotnet test --filter Category=Unit
```

#### Run tests with detailed output and coverage:
```bash
dotnet test --verbosity normal --collect:"XPlat Code Coverage"
```

### Test Coverage Areas

#### 🔐 Authentication Tests
- **Registration Flow**: Email validation, password hashing, account creation
- **Login Process**: Credential validation, JWT token generation, user sessions
- **Token Validation**: JWT expiration, refresh token logic, security checks
- **Authorization**: Role-based access control, protected endpoint testing

#### 👥 User Management Tests  
- **CRUD Operations**: Create, read, update, delete user accounts
- **Validation**: Email uniqueness, role assignment, data constraints
- **Security**: Password hashing verification, unauthorized access prevention

#### ✅ Task Management Tests
- **Task Operations**: Full CRUD lifecycle for task management
- **User Association**: Task-user relationship validation and filtering
- **Status Updates**: Task workflow and state transition testing
- **Data Integrity**: Foreign key constraints and referential integrity

#### 🔗 Integration Tests
- **End-to-End Workflows**: Complete user journey testing
- **API Response Validation**: HTTP status codes, response formats
- **Database Integration**: Entity relationships and data persistence
- **Authentication Integration**: Protected routes and token validation

## 🚀 Deployment Guide

### 🔧 Local Production Build

#### Backend Production Build:
```bash
cd backend/TaskManager.API
dotnet publish -c Release -o ./publish
```

#### Frontend Production Build:
```bash
cd frontend  
npm run build
# Builds optimized production files to ./dist
```

### ☁️ Cloud Deployment Options

#### Microsoft Azure
- **Azure App Service** - Deploy the ASP.NET Core API
- **Azure Static Web Apps** - Host the React frontend  
- **Azure SQL Database** - Production database hosting
- **Azure Key Vault** - Secure configuration management

#### Other Cloud Platforms
- **Vercel/Netlify** - Frontend hosting with CDN
- **Heroku/Railway** - Full-stack deployment
- **DigitalOcean App Platform** - Container-based deployment

### 🔐 Production Configuration

#### Environment Variables:
```bash
# Backend Configuration
ASPNETCORE_ENVIRONMENT=Production
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRY_HOURS=24
DATABASE_CONNECTION_STRING=your-production-db-string

# Frontend Configuration  
VITE_API_URL=https://your-api-domain.com/api
VITE_ENVIRONMENT=production
```

#### Security Considerations:
- **HTTPS Enforcement** with SSL certificates
- **CORS Configuration** for production domains
- **JWT Secret Management** using secure vaults
- **Database Security** with encrypted connections
- **Rate Limiting** for API endpoints

## 📁 Enhanced Project Structure

### Backend Architecture
```
TaskManager.API/
├── Controllers/
│   ├── AuthController.cs            # 🔐 Authentication endpoints
│   ├── UsersController.cs           # 👥 User management with role-based access
│   └── TasksController.cs           # ✅ Task CRUD with user filtering
├── Models/
│   ├── User.cs                      # Enhanced user model with auth fields
│   └── TaskItem.cs                  # Task model with relationships
├── DTOs/
│   ├── AuthDtos.cs                  # Authentication data transfer objects
│   │   ├── LoginData               # Login request model
│   │   ├── RegisterData            # Registration request model
│   │   ├── AuthResponse            # Authentication response
│   │   └── ChangePasswordData      # Password change model
│   ├── UserDtos.cs                  # User-related DTOs
│   └── TaskDtos.cs                  # Task-related DTOs
├── Data/
│   ├── TaskManagerDbContext.cs      # EF Core context with auth tables
│   └── Migrations/                  # Database migration files
├── Services/                        # Business logic layer
├── Middleware/                      # Custom middleware components
├── Extensions/                      # Service configuration extensions
└── Program.cs                       # App startup with JWT configuration
```

### Frontend Architecture  
```
src/
├── components/
│   ├── Navbar.jsx                   # 🧭 Enhanced navigation with user menu
│   ├── ProtectedRoute.tsx           # 🛡️ Route protection wrapper
│   ├── LoadingSpinner.jsx           # ⏳ Loading state components
│   └── ErrorBoundary.jsx            # 🚨 Error handling component
├── pages/
│   ├── auth/                        # 🔐 Authentication pages
│   │   ├── LoginPage.tsx           # Modern login with glass morphism
│   │   └── RegisterPage.tsx        # Enhanced registration form
│   ├── HomePage.jsx                 # 🏠 Dashboard with user statistics
│   ├── TasksPage.jsx               # ✅ Task management interface
│   ├── ProfilePage.jsx             # 👤 User profile and settings
│   ├── CreateTaskPage.jsx          # ➕ Task creation form
│   └── TaskDetailsPage.jsx         # 📝 Individual task view
├── context/
│   ├── AuthContext.tsx             # 🔑 Global authentication state
│   └── ThemeContext.tsx            # 🎨 Theme management (if applicable)
├── services/
│   ├── authService.ts              # 🔐 Authentication API calls
│   ├── userService.ts              # 👥 User management APIs  
│   ├── taskService.ts              # ✅ Task management APIs
│   └── apiClient.ts                # 🌐 HTTP client with interceptors
├── hooks/                          # Custom React hooks
│   ├── useAuth.ts                  # Authentication hook
│   ├── useLocalStorage.ts          # Local storage management
│   └── useApi.ts                   # API call management
├── utils/                          # Utility functions
│   ├── dateUtils.ts               # Date formatting and manipulation
│   ├── validationUtils.ts         # Form validation helpers
│   └── storageUtils.ts            # Storage management utilities
├── styles/
│   ├── index.css                  # 🎨 Modern design system with CSS variables
│   ├── components.css             # Component-specific styles
│   └── animations.css             # Animation definitions
└── App.jsx                        # Main application with routing
```

## ⚙️ Configuration Details

### Backend Configuration (`appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=TaskManager.db"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secure-jwt-secret-key-here",
    "ExpiryHours": 24,
    "Issuer": "TaskManagerAPI",
    "Audience": "TaskManagerApp"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://your-production-domain.com"
    ]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### Frontend Configuration (`package.json`)
```json
{
  "name": "taskmanager-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host",
    "build": "vite build", 
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx,ts,tsx",
    "lint:fix": "eslint . --ext js,jsx,ts,tsx --fix"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0", 
    "react-router-dom": "^6.15.0",
    "axios": "^1.5.0",
    "bootstrap": "^5.3.0"
  }
}
```

### Database Schema Enhancement
```sql
-- Users table with authentication fields
CREATE TABLE Users (
    UserId INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL, 
    Email TEXT UNIQUE NOT NULL,
    PasswordHash TEXT NOT NULL,        -- BCrypt hashed password
    Role TEXT NOT NULL,               -- 'User' or 'Admin'
    CreatedAt DATETIME NOT NULL,
    LastLoginAt DATETIME,             -- Track login activity
    IsActive BOOLEAN DEFAULT 1        -- Account status
);

-- Tasks table with user relationships
CREATE TABLE Tasks (
    TaskId INTEGER PRIMARY KEY AUTOINCREMENT,
    Title TEXT NOT NULL,
    Description TEXT,
    Priority TEXT NOT NULL,           -- 'Low', 'Medium', 'High'
    Category TEXT,
    Status TEXT NOT NULL,             -- 'Pending', 'InProgress', 'Completed'
    DueDate DATETIME,
    CreatedAt DATETIME NOT NULL,
    UpdatedAt DATETIME NOT NULL,
    CompletedAt DATETIME,
    UserId INTEGER NOT NULL,          -- Foreign key to Users
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);
```

## 🤝 Contributing

We welcome contributions to the Task Manager project! Here's how you can help:

### 🔄 Development Workflow

1. **Fork the repository** and clone your fork locally
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/amazing-new-feature
   ```
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly:
   ```bash
   # Backend tests
   cd backend && dotnet test
   
   # Frontend linting  
   cd frontend && npm run lint
   ```
5. **Commit your changes** with a clear message:
   ```bash
   git commit -m "feat: add amazing new feature with improved UX"
   ```
6. **Push to your fork** and create a Pull Request:
   ```bash
   git push origin feature/amazing-new-feature
   ```

### 📝 Contribution Guidelines

- **Code Style**: Follow existing patterns and use ESLint/Prettier for frontend
- **Testing**: Add tests for new features and ensure existing tests pass
- **Documentation**: Update README and code comments as needed
- **Commits**: Use conventional commit messages (feat, fix, docs, refactor, etc.)
- **Performance**: Consider performance implications of changes
- **Accessibility**: Ensure UI changes maintain accessibility standards

### 🐛 Reporting Issues

When reporting bugs or requesting features, please include:
- **Clear description** of the issue or feature request
- **Steps to reproduce** (for bugs)
- **Expected vs actual behavior**
- **Environment details** (OS, browser, .NET version, Node version)
- **Screenshots** if applicable

## � License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## �‍💻 Authors & Acknowledgments

### Development Team
- **Lead Developer** - Full-stack development, architecture, and testing
- **UI/UX Designer** - Modern glass morphism design and responsive layouts
- **Security Specialist** - JWT authentication and security implementation

### Special Thanks
- **ASP.NET Core Team** - For the excellent web framework
- **React Team** - For the powerful frontend library  
- **Bootstrap Team** - For the responsive CSS framework
- **FontAwesome** - For the professional icon library
- **Vite Team** - For the lightning-fast build tool

### Inspiration & Learning
- Built as a comprehensive demonstration of modern full-stack development
- Implements industry best practices for authentication and security
- Showcases responsive design and modern UI/UX principles
- Follows clean architecture and separation of concerns

## 🆘 Support & Troubleshooting

### Common Issues & Solutions

#### Backend Issues
```bash
# Database migration issues
dotnet ef database drop --force
dotnet ef database update

# Port conflicts
netstat -ano | findstr :5000
# Kill process if needed: taskkill /F /PID <pid>

# Package restore issues  
dotnet clean
dotnet restore
```

#### Frontend Issues
```bash
# Node modules issues
rm -rf node_modules package-lock.json
npm install

# Port conflicts (Vite uses 5173 by default)
npm run dev -- --port 3000

# Build issues
npm run build
npm run preview
```

#### Authentication Issues
- **Login fails**: Check JWT secret configuration
- **Token expires**: Verify JWT expiry settings  
- **CORS errors**: Ensure frontend URL is in CORS policy
- **Registration issues**: Check email uniqueness and password validation

### Getting Help

1. **Check the Swagger Documentation** at `http://localhost:5000`
2. **Review the test cases** for expected behavior examples
3. **Check browser console** for frontend errors
4. **Review API logs** for backend issues
5. **Open an issue** on GitHub with detailed information

### Performance Optimization Tips

- **Backend**: Use async/await for database operations
- **Frontend**: Implement code splitting and lazy loading
- **Database**: Add indexes for frequently queried fields
- **API**: Implement caching for static data
- **Frontend**: Optimize bundle size with tree shaking

---

## 🎉 Final Notes

This Task Manager application demonstrates modern full-stack development with:

✅ **Secure Authentication** with JWT tokens and BCrypt hashing  
✅ **Modern UI/UX** with glass morphism and responsive design  
✅ **Professional Code Quality** with comprehensive testing  
✅ **Production-Ready Architecture** with proper separation of concerns  
✅ **Excellent Developer Experience** with hot reloading and debugging tools  
✅ **Comprehensive Documentation** for easy setup and contribution  

**Ready to start managing your tasks like a pro? 🚀**

### Quick Start Commands
```bash
# Backend
cd backend/TaskManager.API && dotnet run --urls "http://localhost:5000"

# Frontend (new terminal)
cd frontend && npm run dev

# Access at: http://localhost:5173
```

**Happy Task Managing! �✨**