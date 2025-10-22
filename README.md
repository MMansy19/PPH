# 📊 Personal Process Hub (PPH)

<div align="center">
  
  ![PPH Banner](https://img.shields.io/badge/PPH-Personal_Process_Hub-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNOSAxOXYtNmEyIDIgMCAwIDAtMi0ySDVhMiAyIDAgMCAwLTIgMnY2YTIgMiAwIDAgMCAyIDJoMmEyIDIgMCAwIDAgMi0yem0wIDBWOWEyIDIgMCAwIDEgMi0yaDJhMiAyIDAgMCAxIDIgMnYxMG0tNiAwYTIgMiAwIDAgMCAyIDJoMmEyIDIgMCAwIDAgMi0ybTAgMFY1YTIgMiAwIDAgMSAyLTJoMmEyIDIgMCAwIDEgMiAydjE0YTIgMiAwIDAgMS0yIDJoLTJhMiAyIDAgMCAxLTItMnoiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==)
  
  **A powerful portfolio management and process visualization tool**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 🎯 Overview

**Personal Process Hub (PPH)** is a comprehensive web application designed to help you visualize, manage, and optimize your project portfolio. Whether you're tracking tasks, analyzing risks, or mapping processes, PPH provides multiple interactive views to give you complete control over your workflow.

### ✨ Key Features

- **📊 Portfolio Bubble Chart** - Visualize projects by Value vs Risk with NPV-sized bubbles
- **📋 Interactive Table** - Full CRUD operations with sortable columns
- **🗺️ Process Map** - React Flow-based process mapping (coming soon)
- **📅 Calendar View** - Timeline-based project planning (coming soon)
- **📝 List & Board Views** - Kanban-style task management (coming soon)
- **💾 Export Capabilities** - Download as PNG, PDF, or CSV
- **🎨 Beautiful UI** - Shadcn/ui components with Tailwind CSS
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MMansy19/PPH.git

# Navigate to project directory
cd PPH

# Install dependencies
npm install

# Set up environment variables (optional)
cp .env.local.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app in action! 🎉

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15.5.6** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 3.4** | Utility-first styling |
| **Shadcn/ui** | Beautiful UI components |
| **Zustand** | Lightweight state management |
| **Recharts** | Interactive data visualization |
| **React Flow** | Process mapping diagrams |
| **Supabase** | Backend & database (optional) |
| **html2canvas + jsPDF** | Export functionality |

---

## 📁 Project Structure

```
PPH/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── app/             # Dashboard page
│   │   ├── layout.tsx       # Root layout with header/footer
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   ├── Dashboard/       # Dashboard-specific components
│   │   ├── forms/           # Form components (TaskForm)
│   │   ├── Landing/         # Landing page components
│   │   ├── Layout/          # Header & Footer
│   │   ├── ui/              # Shadcn UI components
│   │   └── views/           # Different view modes
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities & configurations
│   ├── store/               # Zustand state management
│   └── types/               # TypeScript type definitions
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
- LinkedIn: [mahmoud-mansy](https://linkedin.com/in/mahmoud-mansy)

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
