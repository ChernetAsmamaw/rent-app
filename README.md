````markdown
# Property Rental Platform

A modern web application for property rentals built with Next.js, TypeScript, and PostgreSQL.

## Features

- 🔐 User Authentication (via Clerk)
- 🏠 Property Listings
- 📅 Booking Management
- ⭐ Review System
- 📊 Host Dashboard
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Frontend:**

  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS
  - Headless UI
  - Heroicons

- **Backend:**

  - Next.js API Routes
  - PostgreSQL
  - node-postgres (pg)

- **Authentication:**
  - Clerk

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Getting Started
1. Clone the repository:
2. Install dependencies:
3. Set up the database:
- Create a PostgreSQL database
- The schema will be automatically initialized when the application starts
4. Run the development server:
Open http://localhost:3000 to view the application.

## Project Structure
## Available Scripts
- npm run dev - Start development server with Turbopack
- npm run build - Build the application
- npm run start - Start production server
- npm run lint - Run ESLint
## Contributing
1. Fork the repository
2. Create your feature branch ( git checkout -b feature/amazing-feature )
3. Commit your changes ( git commit -m 'Add some amazing feature' )
4. Push to the branch ( git push origin feature/amazing-feature )
5. Open a Pull Request
## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Next.js
- Clerk
- Tailwind CSS
- Vercel
```
