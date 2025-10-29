# 📊 Portfolio Financial Hub (PFH)

<div align="center">
  
  ![PFH Banner](https://img.shields.io/badge/PFH-Portfolio_Financial_Hub-0ea5e9?style=for-the-badge&logo=trello)
  
  **Enterprise-Grade Portfolio Management & Financial Tracking Platform**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.76-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
  [![License](https://img.shields.io/badge/License-ISC-green?style=flat-square)](LICENSE)

</div>

---

## 🎯 Overview

**Portfolio Financial Hub (PFH)** is a modern, full-stack web application that combines powerful portfolio management with comprehensive financial tracking. Built with Next.js 15 and powered by Supabase, PFH delivers an enterprise-grade solution for managing projects, tasks, and finances—all in one unified platform.

### ✨ Key Features

#### 📊 **Portfolio Management**
- **6 Visualization Modes** - Bubble Chart, Kanban Board, Process Map, Table View, Calendar, and List
- **Drag-and-Drop Interface** - Intuitive task management with React DnD
- **Interactive Bubble Chart** - Visualize projects by Value vs Risk with NPV-sized bubbles
- **Process Mapping** - Create workflow diagrams with React Flow
- **Calendar Integration** - Timeline-based project planning with React Big Calendar
- **Advanced Filtering** - Sort, search, and filter tasks across all views

#### 💰 **Financial Management System**
- **Transaction Tracking** - Complete income/expense management
- **Department Organization** - Multi-department financial allocation
- **Real-time Reporting** - Interactive charts and financial analytics
- **Budget Management** - Track spending against department budgets
- **Export Capabilities** - Download reports as PNG, PDF, or CSV

#### 🔐 **Authentication & Security**
- **Supabase Auth** - Secure user authentication and authorization
- **Row Level Security (RLS)** - Database-level access control
- **Protected Routes** - Client-side route protection
- **Multi-workspace Support** - Isolated workspaces per user

#### 🎨 **Modern UI/UX**
- **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support** - System-aware theme switching
- **Accessible Components** - WCAG-compliant UI elements
- **Touch-Optimized** - 44px minimum touch targets for mobile
- **Safe Area Support** - Proper spacing for notched devices

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** 9.0+ or **yarn** 1.22+
- **Git** for version control
- **Supabase Account** (for backend services - optional for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MMansy19/PPH.git
   cd PFH
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database** (if using Supabase)
   
   Run the SQL scripts in order:
   ```bash
   # Navigate to supabase directory
   cd supabase
   
   # Run each script in the Supabase SQL Editor
   # 1. 01_schema.sql
   # 2. 02_rls_policies.sql
   # 3. 03_functions.sql
   # 4. 04_seed_data.sql
   # 5. 05_financial_schema.sql
   # 6. 06_financial_rls_policies.sql
   # 7. 07_financial_seed_data.sql (optional)
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) 🎉

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

---

## 🛠️ Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.6 | React framework with App Router & Server Components |
| **React** | 19.2.0 | UI library for building interactive interfaces |
| **TypeScript** | 5.0+ | Type-safe JavaScript development |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |

### UI & Components

| Technology | Purpose |
|------------|---------|
| **Shadcn/ui** | Pre-built accessible components |
| **Radix UI** | Unstyled, accessible component primitives |
| **Lucide React** | Beautiful & consistent icons |
| **class-variance-authority** | Component variant management |
| **tailwind-merge** | Tailwind class conflict resolution |

### Data Visualization

| Technology | Purpose |
|------------|---------|
| **Recharts** | Interactive charts and graphs |
| **React Flow (@xyflow/react)** | Process mapping and node-based diagrams |
| **React Big Calendar** | Full-featured calendar component |

### State & Data Management

| Technology | Purpose |
|------------|---------|
| **Zustand** | Lightweight state management |
| **Supabase** | Backend-as-a-Service (Auth, Database, Storage) |
| **TanStack Table** | Headless table component |

### Utilities

| Technology | Purpose |
|------------|---------|
| **React DnD** | Drag-and-drop functionality |
| **date-fns** | Modern date utility library |
| **html2canvas** | Screenshot/export to PNG |
| **jsPDF** | PDF generation |

---

## 📁 Project Structure

```
PFH/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── app/                 # Main dashboard application
│   │   │   ├── financial/       # Financial management module
│   │   │   │   ├── transactions/  # Transaction management
│   │   │   │   ├── reports/       # Financial reports
│   │   │   │   └── departments/   # Department management
│   │   │   ├── layout.tsx       # Dashboard layout with sidebar
│   │   │   └── page.tsx         # Dashboard home
│   │   ├── auth/                # Authentication pages
│   │   │   ├── login/           # Login page
│   │   │   ├── register/        # Registration page
│   │   │   ├── forgot-password/ # Password recovery
│   │   │   └── verify/          # Email verification
│   │   ├── layout.tsx           # Root layout (header/footer)
│   │   ├── page.tsx             # Landing page
│   │   └── globals.css          # Global styles & utilities
│   │
│   ├── components/
│   │   ├── Dashboard/           # Dashboard components
│   │   │   ├── ModeSwitcher.tsx    # View mode selector
│   │   │   ├── ExportButtons.tsx   # Export functionality
│   │   │   ├── MobileMenu.tsx      # Mobile navigation
│   │   │   └── WorkspaceSelector.tsx
│   │   ├── financial/           # Financial module components
│   │   │   ├── FinancialDashboard.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   ├── ReportsView.tsx
│   │   │   └── DepartmentManagement.tsx
│   │   ├── views/               # Different visualization modes
│   │   │   ├── PortfolioBubbleChart.tsx
│   │   │   ├── TableView.tsx
│   │   │   ├── MapView.tsx
│   │   │   ├── BoardView.tsx
│   │   │   ├── ListView.tsx
│   │   │   └── CalendarView.tsx
│   │   ├── auth/                # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── OTPVerificationForm.tsx
│   │   ├── Layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AppNavigation.tsx
│   │   ├── forms/               # Form components
│   │   │   └── TaskForm.tsx
│   │   └── ui/                  # Shadcn UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── ...
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts           # Authentication hooks
│   │   ├── useTasks.ts          # Task management
│   │   ├── useFinancialData.ts  # Financial data hooks
│   │   ├── useMediaQuery.ts     # Responsive breakpoints
│   │   └── useResponsive.ts     # Responsive utilities
│   │
│   ├── lib/                     # Utility functions & config
│   │   ├── supabase.ts          # Supabase client
│   │   ├── supabase-server.ts   # Server-side Supabase
│   │   ├── auth.ts              # Auth utilities
│   │   ├── tasks.ts             # Task utilities
│   │   ├── financial-service.ts # Financial API service
│   │   ├── utils.ts             # General utilities
│   │   ├── csv.ts               # CSV export utilities
│   │   └── schema.ts            # Zod validation schemas
│   │
│   ├── store/                   # Zustand state management
│   │   └── useTasksStore.ts     # Global tasks store
│   │
│   ├── types/                   # TypeScript definitions
│   │   ├── index.ts             # Core types
│   │   └── financial.ts         # Financial types
│   │
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx      # Authentication context
│   │
│   └── utils/                   # Utility functions
│       └── dates.ts             # Date formatting utilities
│
├── supabase/                    # Database schemas & migrations
│   ├── 01_schema.sql            # Core database schema
│   ├── 02_rls_policies.sql      # Row Level Security
│   ├── 03_functions.sql         # Database functions
│   ├── 04_seed_data.sql         # Sample data
│   ├── 05_financial_schema.sql  # Financial tables
│   ├── 06_financial_rls_policies.sql
│   └── 07_financial_seed_data.sql
│
├── docs/                        # Documentation
│   ├── SETUP_GUIDE.md           # Detailed setup instructions
│   ├── PROJECT_STATUS.md        # Current project status
│   ├── ENHANCEMENT_SUMMARY.md   # Recent improvements
│   └── seo/                     # SEO documentation
│
---

## 🎬 Getting Started Guide

### 1️⃣ First Time Setup

After installation, follow these steps to get started:

1. **Create an Account**
   - Navigate to `/auth/register`
   - Fill in your details and verify your email

2. **Create Your First Workspace**
   - Click "Create New Workspace" on the dashboard
   - Name your workspace and set it as default

3. **Add Tasks/Projects**
   - Click the "+" button to add your first task
   - Fill in details like title, value, risk, NPV, priority, etc.

4. **Explore Views**
   - Switch between Bubble Chart, Table, Map, Calendar, Board, and List views
   - Each view offers unique insights into your portfolio

5. **Set Up Financial Tracking** (Optional)
   - Navigate to `/app/financial`
   - Create departments
   - Add transactions (income/expenses)
   - View financial reports and analytics

---

## 📸 Screenshots & Features

### Portfolio Management

#### 🔵 Bubble Chart View
Visualize your entire portfolio at a glance with interactive bubbles representing projects sized by NPV.

#### 📋 Table View
Complete CRUD operations with sortable columns, filtering, and inline editing.

#### 🗺️ Process Map View
Create workflow diagrams and process maps using React Flow's node-based editor.

#### 📅 Calendar View
Timeline-based planning with drag-and-drop task scheduling.

#### 📝 Kanban Board View
Organize tasks in columns by status with drag-and-drop functionality.

#### 📃 List View
Simple, clean list of all tasks with quick actions.

### Financial Management

#### 💰 Financial Dashboard
- Real-time financial summaries
- Income vs Expenses tracking
- Net amount calculations
- Transaction counts

#### 📊 Interactive Reports
- Department-wise spending analysis
- Category-based expense breakdown
- Monthly/yearly financial trends
- Exportable charts and graphs

#### 🏢 Department Management
- Create and manage departments
- Assign budgets to departments
- Track spending per department
- Department performance analytics

#### 💳 Transaction Management
- Add income/expense transactions
- Categorize transactions
- Attach to specific departments
- Track transaction status

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin operations | No |
| `NEXT_PUBLIC_APP_URL` | Your app's URL (for redirects) | No |

### Tailwind Configuration

The project includes custom Tailwind configurations:
- **Extended Breakpoints**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`
- **Custom Utilities**: `touch-target`, `safe-area-*`, `container-responsive`
- **Dark Mode**: System preference-based theming

### Database Schema

The application uses two main schema groups:

**Portfolio Schema:**
- `workspaces` - User workspaces
- `tasks` - Portfolio tasks/projects
- `users` - User profiles

**Financial Schema:**
- `financial_categories` - Transaction categories
- `financial_departments` - Organizational departments
- `financial_transactions` - Income/expense records

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MMansy19/PPH)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables
   - Deploy!

3. **Configure Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Redeploy if needed

### Deploy to Other Platforms

PFH can be deployed to any platform that supports Next.js:
- **Netlify** - Use the Netlify CLI or Git integration
- **Railway** - One-click deploy from GitHub
- **DigitalOcean App Platform** - Deploy from Git
- **AWS Amplify** - Connect your repository
- **Self-hosted** - Build and run with `npm run build && npm start`

---

## 📚 Documentation

For more detailed information, check out:

- **[Setup Guide](docs/SETUP_GUIDE.md)** - Comprehensive setup instructions
- **[Project Status](docs/PROJECT_STATUS.md)** - Current features and roadmap
- **[Enhancement Summary](docs/ENHANCEMENT_SUMMARY.md)** - Recent improvements
- **[SEO Guide](docs/seo/SEO_GUIDE.md)** - SEO optimization tips

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling (avoid custom CSS when possible)
- Write meaningful commit messages
- Add comments for complex logic
- Ensure responsive design for all new features
- Test on multiple browsers and devices

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please open an issue:

1. Go to the [Issues](https://github.com/MMansy19/PPH/issues) page
2. Click "New Issue"
3. Choose "Bug Report" or "Feature Request"
4. Fill in the template with details

---

## 📝 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with amazing open-source technologies:

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open Source Firebase Alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework
- [Shadcn/ui](https://ui.shadcn.com/) - Re-usable Components
- [Radix UI](https://www.radix-ui.com/) - Accessible Components
- [Recharts](https://recharts.org/) - Chart Library
- [React Flow](https://reactflow.dev/) - Node-Based UI

---

## 📧 Contact

**Mohamed Mansy** - [@MMansy19](https://github.com/MMansy19)

Project Link: [https://github.com/MMansy19/PPH](https://github.com/MMansy19/PPH)

Live Demo: [https://pph.vercel.app](https://pph.vercel.app)

---

<div align="center">

**Made with ❤️ using Next.js & Supabase**

⭐ Star this repo if you find it helpful!

</div>
├── public/                  # Static assets
└── ...config files
```

---

## 📊 Features Deep Dive

### 1. Portfolio Bubble Chart
Visualize your entire portfolio at a glance:
- **X-axis**: Value (1-10)
- **Y-axis**: Risk (1-10)  
- **Bubble Size**: NPV in millions
- **Color Coding**: Categories (Big Bets, Line Extensions, LTOs, Other)

### 2. Interactive Table View
Manage tasks with full CRUD operations:
- Add, edit, and delete tasks
- 6 key columns: Title, Category, Value, Risk, NPV, Actions
- Color-coded category badges
- Responsive mobile design

### 3. Export Capabilities
Download your data in multiple formats:
- **PNG**: High-quality image export
- **PDF**: Professional document format
- **CSV**: Spreadsheet-compatible data

---

## 🎨 Screenshots

### Landing Page
![Landing Page](https://via.placeholder.com/800x400?text=PPH+Landing+Page)

### Portfolio Bubble Chart
![Portfolio View](https://via.placeholder.com/800x400?text=Portfolio+Bubble+Chart)

### Table View with CRUD
![Table View](https://via.placeholder.com/800x400?text=Interactive+Table+View)

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Supabase (Optional - for database persistence)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Tailwind Configuration

Customize colors, fonts, and more in `tailwind.config.ts`

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting & Formatting
npm run lint         # Run ESLint
npm run format       # Format with Prettier (if configured)
```

---

## 🗺️ Roadmap

- [x] **Phase 1**: Landing page & Portfolio Bubble Chart
- [x] **Phase 2**: Table View with full CRUD + Exports
- [ ] **Phase 3**: React Flow Process Map
- [ ] **Phase 4**: Calendar & Timeline Views
- [ ] **Phase 5**: Kanban Board with drag-and-drop
- [ ] **Phase 6**: Real-time collaboration
- [ ] **Phase 7**: Advanced analytics & reporting

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mahmoud Mansy**

- Portfolio: [mahmoud-mansy.vercel.app](https://mahmoud-mansy.vercel.app/)
- GitHub: [@MMansy19](https://github.com/MMansy19)
- LinkedIn: [mahmoud-mansy](https://www.linkedin.com/in/mahmood-mansy)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Vercel](https://vercel.com) for seamless deployment
- Inspired by portfolio management best practices

---

<div align="center">
  
  **Built with ❤️ by Mahmoud Mansy**
  
  ⭐ Star this repo if you find it helpful!
  
</div>
