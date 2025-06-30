# Legal Matters Application

A legal practice management system built with React TypeScript frontend and .NET Core backend.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** package manager
- **.NET 9.0 SDK**
- **PostgreSQL** (running on localhost:5432)

## Database Setup

1. **Install PostgreSQL** and ensure it's running on `localhost:5432`

2. **Run database migrations:**
   ```bash
   cd be/LegalMattersAPI
   dotnet ef database update
   ```
   
   This will create the required tables and seed initial data.

## Backend Setup & Run

1. **Navigate to backend directory:**
   ```bash
   cd be/LegalMattersAPI
   ```

2. **Restore dependencies:**
   ```bash
   dotnet restore
   ```

3. **Run the backend:**
   ```bash
   dotnet run
   ```

The backend API will be available at `http://localhost:5001`

## Frontend Setup & Run

1. **Navigate to frontend directory:**
   ```bash
   cd fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`. 

You will not have a user account created to begin with. The app is configured to redirect you to the login page via axios at runtime. Click the sign up button on the bottom of the login form to switch to the sign up form and create a user. You can then use those same credentials to login and access the dashboard.

## Technology Stack

### Backend
- **.NET 9.0** with ASP.NET Core Web API
- **Entity Framework Core** with PostgreSQL
- **JWT Authentication** (configured)
- **BCrypt.Net** for password hashing

### Frontend
- **React 19.1.0** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS 4.0** for styling
- **Axios** for API communication

## Features

- User authentication and authorization
- Customer/client management
- Legal matter tracking
- Law firm association

## Development

### Frontend Development
- **Hot reload:** Changes are automatically reflected
- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Lint:** `npm run lint`

### Backend Development
- **Hot reload:** Enabled with `dotnet run`
- **Database updates:** `dotnet ef database update`
- **Create migration:** `dotnet ef migrations add MigrationName`

## Default Data

The application includes seed data:
- 3 sample customers
- 3 sample legal matters
- Ready for immediate testing

## Configuration

- **Backend:** Runs on port 5001
- **Frontend:** Runs on port 5173
- **Database:** PostgreSQL on localhost:5432
- **CORS:** Configured for development (all origins allowed)
