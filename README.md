# Link: https://zencampus.netlify.app/

---

# ZenCampus

Smart campus management web application built with Next.js (App Router), TypeScript and Tailwind CSS. ZenCampus provides admin and student dashboards, canteen ordering, laundry management, maintenance, forums, notices, polls and more.

---

# ZenCampus

Smart campus management platform built with Next.js, TypeScript and Tailwind CSS. ZenCampus is a microservices-based architecture consisting of independent applications for different campus services including admin dashboard, canteen ordering, laundry management, maintenance, forums, notices, complaints and more.

---

## Table of Contents

- **Project**: Overview and features
- **Architecture**: Microservices structure and design
- **Microservices**: Individual service descriptions
- **Tech Stack**: Libraries and runtimes
- **Quick Start**: Install, run, build commands
- **Environment**: Required environment variables
- **APIs & Models**: High-level API routes and data models
- **Development**: Coding, linting and type checks
- **Deployment**: Notes for production deployment
- **Contributing**: Workflow and guidelines

---

## Project

ZenCampus is a comprehensive campus management platform designed as a microservices architecture. Each service runs independently with its own Next.js application, database models, and API routes. The platform targets accommodation and student-life workflows including canteen menus & orders, laundry bookings, maintenance requests, cleaning requests, notices, forum discussions, complaint management, and administrative oversight.

### Key Capabilities

- Microservices architecture with independent deployable services
- Role-based access control for admins and students
- Canteen menu and ordering system
- Laundry bookings and machine status tracking
- Maintenance and cleaning ticket management
- Forum discussions with posts & polls
- Notice board and announcements
- Complaint management system
- Student and admin dashboards
- Promotional landing page

---

## Architecture

ZenCampus follows a **microservices architecture** where each domain service is an independent Next.js application. This design provides:

- **Scalability**: Each service can be scaled independently based on demand
- **Maintainability**: Clear separation of concerns with isolated codebases
- **Flexibility**: Services can be deployed, updated, or replaced independently
- **Resilience**: Failure in one service doesn't affect others

### Service Communication

Each service:
- Runs on a dedicated port (3000-3008)
- Has its own authentication configuration (NextAuth)
- Connects to shared or independent MongoDB databases
- Uses consistent UI components and design system
- Shares common patterns (validation, middleware, models)

### Microservices Overview

```mermaid
graph TB
    User[User/Browser]
    
    subgraph ZenCampus Microservices
        Campus[Campus Dashboard<br/>Port 3000]
        Canteen[Canteen Service<br/>Port 3001]
        Wash[Laundry/Wash<br/>Port 3002]
        Fix[Maintenance/Fix<br/>Port 3003]
        Notice[Notice Board<br/>Port 3004]
        Connect[Forum/Connect<br/>Port 3005]
        Clean[Cleaning Service<br/>Port 3006]
        Resolve[Complaints/Resolve<br/>Port 3007]
        Promo[Promotional Site<br/>Port 3008]
    end
    
    subgraph Data Layer
        MongoDB[(MongoDB)]
    end
    
    User --> Campus
    User --> Canteen
    User --> Notice
    User --> Connect
    User --> Clean
    User --> Resolve
    User --> Wash
    User --> Fix
    User --> Promo
    
    Campus -.-> MongoDB
    Canteen -.-> MongoDB
    Notice -.-> MongoDB
    Connect -.-> MongoDB
    Clean -.-> MongoDB
    Resolve -.-> MongoDB
    Wash -.-> MongoDB
    Fix -.-> MongoDB
```

---

## Microservices

### 1. Campus (`/campus` - Port 3000)
**ZenCampus - Unified Campus Management System**

The central hub and main dashboard application providing:
- Admin and student dashboards
- User management and authentication
- Timetable management
- Statistics and reporting
- Unified navigation to other services
- Student profile management

**Key Models**: User, Timetable, Stats, Reports

---

### 2. Canteen (`/canteen` - Port 3001)
**ZenCanteen - Canteen and Food Ordering System**

Food ordering and canteen management service:
- Browse canteen menu items
- Place and track food orders
- Order history and status tracking
- Menu management (admin)
- QR code generation for orders

**Key Models**: CanteenOrder, MenuItem, Menu

---

### 3. Wash (`/wash` - Port 3002)
**ZenWash - Laundry Management System**

Laundry booking and machine management:
- View available washing machines
- Book laundry slots
- Track machine status (idle/in-use/maintenance)
- Booking history
- Real-time machine availability

**Key Models**: LaundryBooking, Machine

---

### 4. Fix (`/fix` - Port 3003)
**ZenMaintenance - Maintenance Request System**

Infrastructure maintenance and repair requests:
- Submit maintenance requests
- Upload photos/documents
- Track request status
- Admin ticket management
- Priority-based queue

**Key Models**: MaintenanceRequest, Attachment

---

### 5. Notice (`/notice` - Port 3004)
**ZenNotice - Notice Board Management System**

Announcements and notice board:
- View campus notices and announcements
- Create and publish notices (admin)
- Categorize notices (academic, events, alerts)
- Archive and search notices
- Priority and expiry management

**Key Models**: Notice, NoticeCategory

---

### 6. Connect (`/connect` - Port 3005)
**ZenForum - Discussion Forum System**

Community forum and discussions:
- Create and participate in forum posts
- Create and vote in polls
- Comment and reply system
- Topic categories
- User engagement tracking

**Key Models**: ForumPost, Poll, Comment, Vote

---

### 7. Clean (`/clean` - Port 3006)
**ZenCleaning - Room Cleaning Request System**

Room cleaning and housekeeping service:
- Submit room cleaning requests
- Schedule cleaning sessions
- Track cleaning status
- Rate cleaning service
- Recurring cleaning schedules

**Key Models**: CleaningRequest, CleaningSchedule

---

### 8. Resolve (`/resolve` - Port 3007)
**ZenComplain - Student Complaint Management System**

Student grievance and complaint management:
- Submit complaints and feedback
- Track complaint resolution status
- Admin response and resolution system
- Complaint categories
- Anonymous complaint option

**Key Models**: Complaint, ComplaintResponse

---

### 9. Promo (`/promo` - Port 3008)
**ZenCampus Promotional Website**

Marketing and promotional landing page:
- Feature showcase
- Service highlights
- Hero sections with animations
- Responsive design
- Call-to-action sections

**Tech**: Next.js 16, React 19, Framer Motion, Tailwind CSS 4

---

## Tech Stack

### Core Technologies
- **Next.js 15/16** — App Router, pages, layouts and server components
- **React 18/19** — UI framework
- **TypeScript 5** — Type safety
- **Tailwind CSS 3/4** — Styling framework

### Authentication & Security
- **NextAuth (Auth.js) v5** — Authentication and session management
- **bcryptjs** — Password hashing
- **Zod** — Runtime validation

### Database & ORM
- **MongoDB** — Primary database
- **Mongoose** — ODM for MongoDB

### UI Components & Libraries
- **Radix UI** — Headless UI primitives
- **Lucide React** — Icon library
- **class-variance-authority** — Component variants
- **Framer Motion** — Animations (promo)
- **Sonner** — Toast notifications
- **next-themes** — Theme management
- **QRCode** — QR code generation

### Development Tools
- **ESLint** — Code linting
- **PostCSS** — CSS processing
- **Autoprefixer** — CSS vendor prefixes

### Node Requirements
Node engine: `>=18.17.0` (see package.json in each service)

---

## Quick Start

### Running Individual Services

Each service can be run independently:

```bash
# Navigate to a service directory
cd campus  # or canteen, wash, fix, notice, connect, clean, resolve

# Install dependencies
npm install

# Create .env file (see Environment section)
cp .env.example .env.local

# Run in development
npm run dev

# Build for production
npm run build
npm run start

# Type check and lint
npm run type-check
npm run lint
```

### Service Ports

| Service | Port | Command |
|---------|------|---------|
| Campus | 3000 | `npm run dev` |
| Canteen | 3001 | `npm run dev` |
| Wash | 3002 | `npm run dev` |
| Fix | 3003 | `npm run dev` |
| Notice | 3004 | `npm run dev` |
| Connect | 3005 | `npm run dev` |
| Clean | 3006 | `npm run dev` |
| Resolve | 3007 | `npm run dev` |
| Promo | 3008 | `npm run dev` |

### Running All Services

You can run all services simultaneously using a process manager or multiple terminal windows:

```bash
# Terminal 1
cd campus && npm run dev

# Terminal 2
cd canteen && npm run dev

# Terminal 3
cd wash && npm run dev

# ... and so on
```

Or use a tool like `concurrently` or `pm2` for managing multiple processes.

---

## Environment Variables

Each service requires a `.env.local` file in its root directory. Create this file with the following variables:

### Required for All Services

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/zencampus
# or use MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/dbname

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000  # Adjust port for each service

# Auth.js v5
AUTH_SECRET=your-auth-secret-key
AUTH_URL=http://localhost:3000      # Adjust port for each service
```

### Optional Variables

```env
# Email (for password reset, notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password

# File Uploads
STORAGE_PATH=./public/uploads

# Platform-specific (Netlify, Vercel, etc.)
NETLIFY=true
```

### Service-Specific Ports

Update `NEXTAUTH_URL` and `AUTH_URL` for each service:
- Campus: `http://localhost:3000`
- Canteen: `http://localhost:3001`
- Wash: `http://localhost:3002`
- Fix: `http://localhost:3003`
- Notice: `http://localhost:3004`
- Connect: `http://localhost:3005`
- Clean: `http://localhost:3006`
- Resolve: `http://localhost:3007`

**Note**: The promo site doesn't require authentication or database configuration.

---

## Project Structure

Each service (except promo) follows a similar structure:

```
service-name/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── (admin)/           # Admin routes (route group)
│   ├── (auth)/            # Auth routes (route group)
│   ├── (dashboard)/       # Dashboard routes (route group)
│   └── api/               # API Route Handlers
│       ├── auth/          # Authentication endpoints
│       └── ...            # Service-specific APIs
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ui/               # UI primitives
├── hooks/                # Custom React hooks
│   └── useApi.ts
├── lib/                  # Shared utilities
│   ├── db.ts            # Database connection
│   ├── utils.ts         # Utility functions
│   └── validations.ts   # Zod schemas
├── models/              # Mongoose models
├── types/               # TypeScript types
├── public/              # Static assets
│   └── uploads/         # File uploads
├── auth.ts              # Auth configuration
├── auth.config.ts       # Auth config
├── middleware.ts        # Next.js middleware
├── next.config.ts       # Next.js config
├── tailwind.config.ts   # Tailwind config
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

### Promo Site Structure

```
promo/
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # React components
│   └── lib/            # Utilities
├── public/             # Static assets
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## APIs & Models

Each service exposes its own REST API endpoints under `/api`. Below is a high-level overview:

### Campus Service APIs
- `/api/auth/[...nextauth]` — NextAuth configuration
- `/api/auth/me` — Current user info
- `/api/students` — Student management
- `/api/timetable` — Timetable CRUD
- `/api/stats` — Statistics
- `/api/reports` — Reports

### Canteen Service APIs
- `/api/canteen/menu` — Menu items
- `/api/canteen/orders` — Orders CRUD
- `/api/canteen/orders/[id]` — Order details

### Wash Service APIs
- `/api/laundry` — Laundry bookings
- `/api/machines` — Machine status
- `/api/machines/[id]` — Machine details

### Fix Service APIs
- `/api/maintenance` — Maintenance requests
- `/api/maintenance/[id]` — Request details
- `/api/maintenance/upload` — File uploads

### Notice Service APIs
- `/api/notices` — Notices CRUD
- `/api/notices/[id]` — Notice details

### Connect Service APIs
- `/api/forum/posts` — Forum posts
- `/api/forum/polls` — Polls
- `/api/forum/posts/[id]` — Post details

### Clean Service APIs
- `/api/cleaning` — Cleaning requests
- `/api/cleaning/[id]` — Request details

### Resolve Service APIs
- `/api/complaints` — Complaints CRUD
- `/api/complaints/[id]` — Complaint details

---

## Development

### Common Patterns

All services share common development patterns:

**1. Database Connection Caching**
```typescript
// lib/db.ts
// Caches Mongoose connection across serverless invocations
```

**2. API Route Handlers**
```typescript
// app/api/resource/route.ts
export async function GET(request: Request) {
  await connectDB();
  // ... implementation
}
```

**3. Zod Validation**
```typescript
// lib/validations.ts
import { z } from 'zod';
export const schema = z.object({ /* ... */ });
```

**4. Auth Middleware**
```typescript
// middleware.ts
// Route protection and role-based access
```

### Development Commands

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build

# Start production server
npm run start
```

### Debugging Tips

- Check server logs in the terminal running `next dev`
- Use browser DevTools for client-side debugging
- Add temporary console.logs in Route Handlers (avoid logging secrets)
- Use TypeScript type checking to catch errors early
- Check MongoDB connection issues via logs

---

## Deployment

### Individual Service Deployment

Each service can be deployed independently to platforms like:
- **Vercel** (recommended for Next.js)
- **Netlify** (with `@netlify/plugin-nextjs`)
- **AWS**, **Google Cloud**, **Azure**
- **Docker** containers

### Deployment Checklist

For each service:

1. **Environment Variables**
   - Set all required env vars on deployment platform
   - Update `NEXTAUTH_URL`/`AUTH_URL` to production URLs
   - Use production MongoDB connection string
   - Configure SMTP settings if needed

2. **Database**
   - Ensure MongoDB is accessible from deployment platform
   - Use MongoDB Atlas for cloud-hosted database
   - Configure IP whitelist if required

3. **File Uploads**
   - Configure persistent storage (S3, Cloudinary, etc.)
   - Update `STORAGE_PATH` or use cloud storage adapters

4. **Build Configuration**
   - Verify `next.config.ts` settings
   - Test production build locally first
   - Check for any environment-specific code

5. **Domain & SSL**
   - Configure custom domains for each service
   - Enable HTTPS/SSL certificates
   - Update CORS settings if needed

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy a service
cd campus
vercel --prod
```

### Netlify Deployment

Each service includes `@netlify/plugin-nextjs` configuration.

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy a service
cd campus
netlify deploy --prod
```

### Docker Deployment

Create a `Dockerfile` in each service directory:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Contributing

### Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make changes in relevant service directories
4. Test thoroughly (run type-check and lint)
5. Commit with descriptive messages
6. Push and create a pull request

### Guidelines

- **Code Style**: Follow existing patterns and conventions
- **Components**: Keep components small, composable, and reusable
- **Types**: Use TypeScript for type safety
- **Validation**: Use Zod for runtime validation
- **Testing**: Test changes locally before submitting PR
- **Documentation**: Update README when adding features
- **Commits**: Write clear, descriptive commit messages

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Service(s) Affected
- [ ] Campus
- [ ] Canteen
- [ ] Wash
- [ ] Fix
- [ ] Notice
- [ ] Connect
- [ ] Clean
- [ ] Resolve
- [ ] Promo

## Testing
- [ ] Type check passed
- [ ] Lint passed
- [ ] Tested locally
- [ ] All services still work

## Screenshots (if UI changes)
Add screenshots here
```

---

## Troubleshooting

### Common Issues

**Database Connection Errors**
- Verify `MONGODB_URI` is correct
- Check network access and IP whitelist (MongoDB Atlas)
- Ensure MongoDB is running (local development)

**Auth/Session Issues**
- Verify `NEXTAUTH_SECRET` and `AUTH_SECRET` are set
- Check `NEXTAUTH_URL` matches the service URL and port
- Clear browser cookies and try again

**Port Conflicts**
- Ensure no other process is using the service port
- Check `package.json` scripts for correct port assignment
- Use `lsof -i :3000` to find processes using a port

**Build Errors**
- Run `npm run type-check` to find TypeScript errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**Upload Issues**
- Verify `public/uploads` directory exists and is writable
- Check file size limits in Next.js config
- Consider using cloud storage for production

### Getting Help

- Check service-specific logs in the terminal
- Review MongoDB logs for database issues
- Check browser DevTools console for client errors
- Review Next.js documentation for framework issues

---

## License

<<<<<<< HEAD
This project is private and proprietary.

---

## Credits

Built with ❤️ using Next.js, React, TypeScript, and Tailwind CSS.

---

## Project Statistics

- **Services**: 9 independent microservices
- **Tech Stack**: Next.js 15/16, React 18/19, TypeScript 5
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth (Auth.js) v5
- **UI Framework**: Tailwind CSS 3/4
- **Deployment**: Vercel/Netlify ready
=======
- App entry and global layout: `app/layout.tsx`, `app/globals.css`
- Auth & middleware: `api/auth`, `middleware.ts`, `lib/auth-middleware.ts`
- DB: `lib/db.ts`
- Models: `models/*` (entities)
- APIs: `api/*/route.ts`

---
