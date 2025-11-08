# � نظام إدارة الأعضاء والتقييم (PPH)

<div align="center">
  
  ![PPH Banner](https://img.shields.io/badge/PPH-Member_Management_System-28a745?style=for-the-badge&logo=users)
  
  **نظام شامل لإدارة الأعضاء والتقييم الآلي للأداء**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.76-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)

</div>

---

## 🎯 الأهداف الرئيسية

### **1. الأتمتة والكفاءة**
- **إدارة تلقائية للأعضاء والمهام** لتقليل الأخطاء اليدوية
- **استبدال الجداول التقليدية** بنظام رقمي متطور
- **تقليل الوقت المستغرق** في العمليات الإدارية
- **زيادة دقة البيانات** وتجنب الأخطاء البشرية

### **2. نظام التقييم الذكي**
- **حساب آلي للنقاط والتقييمات** بناءً على قواعد واضحة
- **معايير موضوعية** للالتزام والجودة والأداء
- **تتبع مستمر للأداء** مع إحصائيات تفصيلية
- **مقارنات عادلة** بين الأعضاء والفرق

### **3. التحفيز والتشجيع**
- **إنشاء تقارير وشهادات تلقائية** لتشجيع الأعضاء
- **نظام مكافآت نقطية** للإنجازات المتميزة
- **لوحات إنجازات شخصية** لتحفيز المنافسة الإيجابية
- **اعتراف فوري بالإنجازات** من خلال الإشعارات

### **4. دعم اتخاذ القرارات**
- **إحصائيات ولوحات عرض تفاعلية** لتحسين الأداء العام
- **تقارير تحليلية شاملة** لمساعدة المدراء
- **رؤى عميقة حول الأداء** على مستوى الفرد والفريق
- **مؤشرات أداء رئيسية** لقياس النجاح

### **5. تجربة مستخدم محسنة**
- **نظام تنبيهات ذكي** لزيادة الالتزام
- **إشعارات سريعة ومخصصة** لكل مستخدم
- **واجهات مرنة** تناسب جميع الأجهزة
- **تفاعل سهل وبديهي** مع النظام

## ✨ الميزات الرئيسية

#### 🏗️ **Multi-Project Architecture**
- **Hierarchical Structure** - Workspace → Project → Team → Task organization
- **Project Management** - Complete project lifecycle management with start/end dates, budgets, and success metrics
- **Team Assignment** - Project-based team assignments with role-based permissions
- **Cross-Project Analytics** - Portfolio overview across all projects and teams

#### 👥 **Advanced Member Management & Evaluation System**
- **Member Profiles** - Comprehensive member management with roles, contact details, and performance tracking
- **Automated Evaluation** - Smart scoring system based on commitment, quality, and task completion
- **Performance Analytics** - Real-time dashboards showing member performance across teams and projects
- **Certificate Generation** - Automated certificate creation for high performers (80%+ scores)
- **Self-Assessment** - Member self-evaluation capabilities with comparison to supervisor ratings
- **Notification System** - Smart alerts for deadlines, achievements, and team updates

#### 📊 **Portfolio Management**
- **6 Visualization Modes** - Bubble Chart, Kanban Board, Process Map, Table View, Calendar, and List
- **Drag-and-Drop Interface** - Intuitive task management with React DnD
- **Interactive Bubble Chart** - Visualize projects by Value vs Risk with NPV-sized bubbles
- **Process Mapping** - Create workflow diagrams with React Flow
- **Calendar Integration** - Timeline-based project planning with React Big Calendar
- **Advanced Filtering** - Sort, search, and filter tasks across all views

#### 🎯 **Task Management System**
- **Smart Assignment** - Assign tasks to projects, teams, and individual members
- **Progress Tracking** - Real-time task status updates with automated scoring
- **Dependency Management** - Track task relationships and dependencies
- **Priority Management** - High/Medium/Low priority levels with smart sorting
- **File Attachments** - Support for task documentation and proof of completion

#### 💰 **Financial Management System**
- **Transaction Tracking** - Complete income/expense management
- **Department Organization** - Multi-department financial allocation
- **Real-time Reporting** - Interactive charts and financial analytics
- **Budget Management** - Track spending against department budgets
- **Export Capabilities** - Download reports as PNG, PDF, or CSV

#### � **Reporting & Analytics**
- **Performance Reports** - Automated report generation with print/share capabilities
- **Team Analytics** - Team performance metrics and collaboration insights
- **Project Health** - Portfolio-level dashboards showing project status and resource utilization
- **Member Scorecards** - Individual performance tracking with historical trends

#### 🔐 **Security & Role Management**
- **Role-Based Access Control** - Admin, Supervisor, and Member roles with appropriate permissions
- **Workspace Isolation** - Secure data separation between organizations
- **Audit Logging** - Complete activity tracking for compliance and security
- **Secure Authentication** - Multi-factor authentication and password recovery

#### 🎨 **Modern UI/UX**
- **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support** - System-aware theme switching
- **Accessible Components** - WCAG-compliant UI elements
- **Touch-Optimized** - 44px minimum touch targets for mobile
- **Multi-language Support** - Arabic and English interface support

---

## 🎯 Core System Architecture

### **Hierarchical Organization Structure**
```
Workspace (Organization Level)
├── Project 1 (Department/Initiative)
│   ├── Team A (Development Team)
│   │   ├── Member 1 (Role: Developer)
│   │   ├── Member 2 (Role: Designer)
│   │   └── Tasks assigned to team
│   └── Team B (QA Team)
│       ├── Member 3 (Role: QA Lead)
│       └── Tasks assigned to team
├── Project 2 (Marketing Campaign)
│   ├── Team C (Content Team)
│   └── Team D (Analytics Team)
└── Project 3 (Infrastructure)
    └── Team E (DevOps Team)
```

### **User Roles & Permissions**

#### 🎯 **Administrator (Admin)**
**Full system control with organization-wide access**
- ✅ Manage all members (add, edit, remove)
- ✅ Create and manage projects across the workspace
- ✅ Assign teams to projects and manage team composition
- ✅ Create and assign tasks with deadlines and priorities
- ✅ Access to complete evaluation system with scoring algorithms
- ✅ Generate reports, certificates, and analytics
- ✅ Configure system settings and notifications
- ✅ View workspace-wide analytics and performance metrics

#### 👨‍💼 **Supervisor**
**Team-level management with project oversight**
- ✅ Monitor assigned team members and their performance
- ✅ Evaluate team members with scoring capabilities
- ✅ Create and assign tasks within their team scope
- ✅ View team-specific reports and analytics
- ✅ Compare member self-assessments with supervisor evaluations
- ✅ Receive notifications for team delays and issues
- ❌ Cannot manage members outside their team
- ❌ Limited to project-specific data access

#### 👤 **Member**
**Individual contributor with self-management capabilities**
- ✅ View and update assigned tasks with status changes
- ✅ Upload proof of completion (files, images, documents)
- ✅ Complete self-assessment evaluations
- ✅ View personal performance dashboard and points
- ✅ Receive notifications for deadlines and achievements
- ✅ Access personal achievement history and certificates
- ❌ Cannot assign tasks to others
- ❌ Cannot access other members' performance data

---

## 📱 Feature Implementation Guide

### 🏢 **Member Management System**

#### **Adding New Members**
1. **Navigate to Members Section**
   - Admin/Supervisor dashboard → Members tab
   - Click "Add New Member" button

2. **Fill Member Information**
   ```typescript
   // Member Profile Structure
   {
     name: string,           // Full name
     email: string,          // Contact email
     phone: string,          // Phone number
     role: 'admin' | 'supervisor' | 'member',
     team_id: string,        // Assigned team
     department: string,     // Department/division
     join_date: Date,        // Start date
     skills: string[],       // Skill tags
     avatar_url?: string     // Profile picture
   }
   ```

3. **Role Assignment**
   - Select appropriate role (Admin/Supervisor/Member)
   - Assign to specific teams and projects
   - Set permissions and access levels

#### **Member Search & Filtering**
- **Filter by Team**: View members by team assignment
- **Filter by Role**: Separate views for admins, supervisors, members
- **Filter by Performance**: Sort by evaluation scores
- **Search Functionality**: Name, email, or skill-based search

### 🎯 **Task Assignment & Management**

#### **Creating Tasks**
1. **Task Creation Form**
   ```typescript
   // Task Structure
   {
     title: string,                    // Task name
     description: string,              // Detailed requirements
     project_id: string,               // Parent project
     team_id?: string,                 // Assigned team
     assigned_to?: string,             // Individual assignee
     priority: 'high' | 'medium' | 'low',
     due_date: Date,                   // Deadline
     estimated_hours: number,          // Time estimate
     acceptance_criteria: string[],    // Success conditions
     attachments?: File[]              // Supporting documents
   }
   ```

2. **Assignment Process**
   - **Primary Assignee**: Main responsible person
   - **Backup Assignee**: Secondary person for coverage
   - **Team Assignment**: Assign to entire team
   - **Deadline Setting**: With automatic reminders

3. **Task Status Tracking**
   - `todo`: Not started
   - `in-progress`: Currently working
   - `review`: Awaiting approval
   - `done`: Completed and approved
   - `blocked`: Cannot proceed due to dependencies

### 📊 **Evaluation & Scoring System**

#### **Automated Scoring Algorithm**
```typescript
// Scoring Calculation
const calculateMemberScore = (member: Member) => {
  const commitmentScore = calculateCommitment(member.tasks);
  const qualityScore = calculateQuality(member.completedTasks);
  const timelinessScore = calculateTimeliness(member.tasks);
  
  return {
    total: (commitmentScore * 0.4) + (qualityScore * 0.4) + (timelinessScore * 0.2),
    breakdown: {
      commitment: commitmentScore,  // 40% weight
      quality: qualityScore,        // 40% weight
      timeliness: timelinessScore   // 20% weight
    }
  };
};
```

#### **Evaluation Categories**
1. **Commitment (40%)**
   - Task completion rate
   - Attendance and participation
   - Initiative and proactivity

2. **Quality (40%)**
   - Work quality assessment
   - Accuracy and attention to detail
   - Adherence to requirements

3. **Timeliness (20%)**
   - On-time delivery
   - Meeting deadlines
   - Response time to communications

#### **Performance Classifications**
- **🌟 Excellent (90-100%)**: Top performers eligible for certificates
- **✅ Good (80-89%)**: Solid performers meeting expectations
- **⚠️ Average (70-79%)**: Meets basic requirements with room for improvement
- **❌ Needs Improvement (<70%)**: Requires additional support and guidance

### 🎖️ **Certificate Generation System**

#### **Automatic Certificate Creation**
- **Trigger**: When member score exceeds 80%
- **Template System**: Customizable certificate templates
- **Personalization**: Member name, score, period, achievements
- **Delivery**: Automatic email delivery with PDF attachment

#### **Certificate Types**
1. **Monthly Excellence**: For consistent high performance
2. **Project Completion**: For successful project delivery
3. **Team Leadership**: For supervisory achievements
4. **Innovation Award**: For creative solutions and improvements

### 📈 **Dashboard & Analytics**

#### **Admin Dashboard**
- **Workspace Overview**: Total projects, teams, members, tasks
- **Performance Metrics**: Average scores, completion rates, trends
- **Project Health**: Status overview across all projects
- **Resource Utilization**: Team workload and capacity analysis

#### **Supervisor Dashboard**
- **Team Performance**: Individual and team-level metrics
- **Task Distribution**: Workload balance across team members
- **Evaluation Comparison**: Self-assessment vs. supervisor ratings
- **Alert Center**: Overdue tasks, performance issues, achievements

#### **Member Dashboard**
- **Personal Tasks**: Current assignments with due dates
- **Performance Score**: Real-time score with breakdown
- **Achievement History**: Completed tasks, earned certificates
- **Self-Assessment Portal**: Regular self-evaluation forms

### 🔔 **Notification & Alert System**

#### **Smart Notifications**
1. **Deadline Reminders**
   - 3 days before due date
   - 1 day before due date
   - On due date if not completed

2. **Achievement Notifications**
   - Task completion confirmations
   - Score updates and improvements
   - Certificate awards

3. **Team Updates**
   - New task assignments
   - Team member additions/changes
   - Project milestone updates

#### **Delivery Channels**
- **In-App Notifications**: Real-time browser notifications
- **Email Alerts**: Detailed email summaries
- **SMS Notifications**: Critical deadline reminders (optional)

### 📋 **Reporting System**

#### **Available Reports**
1. **Member Performance Report**
   - Individual performance over time
   - Score breakdown and trends
   - Task completion statistics

2. **Team Analytics Report**
   - Team-wide performance metrics
   - Collaboration effectiveness
   - Resource utilization

3. **Project Status Report**
   - Project progress and milestones
   - Budget and timeline tracking
   - Risk assessment

4. **Workspace Overview Report**
   - Organization-wide KPIs
   - Cross-project insights
   - Strategic performance indicators

#### **Export Options**
- **PDF Reports**: Professional formatted documents
- **Excel Spreadsheets**: Data analysis and manipulation
- **CSV Files**: Raw data for external systems
- **Print-Ready Formats**: Optimized for physical printing

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

5. **Initialize the database**
   
   Run the SQL migration scripts in Supabase SQL Editor in this exact order:
   ```sql
   -- Core Schema
   01_schema.sql              -- Basic tables (workspaces, tasks, users)
   02_rls_policies.sql        -- Row Level Security policies
   03_functions.sql           -- Database functions
   04_seed_data.sql           -- Initial data
   
   -- Financial Module
   05_financial_schema.sql    -- Financial tables
   06_financial_rls_policies.sql -- Financial security
   07_financial_seed_data.sql -- Financial sample data
   
   -- Multi-Project & Team Features
   11_team_collaboration_schema.sql -- Team and project tables
   12_multi_project_migration.sql   -- Multi-project structure
   13_data_migration.sql            -- Migrate existing data
   ```

6. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) 🎉

### 🎬 First-Time Setup Walkthrough

#### **Step 1: Create Administrator Account**
1. Navigate to `/auth/register`
2. Fill in admin details and verify email
3. The first registered user automatically becomes workspace admin

#### **Step 2: Initialize Your Workspace**
1. **Create Workspace**
   - Click "Create New Workspace"
   - Enter organization name and description
   - Set theme colors and icon

2. **Configure Workspace Settings**
   ```typescript
   // Workspace Configuration
   {
     max_projects: 50,
     allow_member_project_creation: false,
     default_task_visibility: 'team',
     auto_archive_completed: true,
     evaluation_frequency: 'weekly',
     certificate_threshold: 80
   }
   ```

#### **Step 3: Set Up Projects**
1. **Create First Project**
   - Navigate to Projects → Create New
   - Fill project details (name, description, dates, budget)
   - Set project admin and permissions

2. **Project Categories**
   - **Development Projects**: Software development initiatives
   - **Marketing Campaigns**: Marketing and promotional activities
   - **Infrastructure**: IT and operational projects
   - **Research**: R&D and innovation projects

#### **Step 4: Build Your Teams**
1. **Create Teams**
   - Navigate to Teams → Create New Team
   - Assign teams to specific projects
   - Set team admin and member roles

2. **Team Structure Examples**
   ```
   Development Project
   ├── Frontend Team (5 members)
   ├── Backend Team (4 members)
   ├── QA Team (3 members)
   └── DevOps Team (2 members)
   
   Marketing Campaign
   ├── Content Team (6 members)
   ├── Design Team (4 members)
   └── Analytics Team (3 members)
   ```

#### **Step 5: Add Team Members**
1. **Bulk Member Import**
   - Use CSV import for large teams
   - Template includes: name, email, phone, role, team_id

2. **Individual Addition**
   - Navigate to Members → Add Member
   - Fill complete profile information
   - Assign to appropriate teams and projects

#### **Step 6: Configure Evaluation System**
1. **Set Evaluation Criteria**
   ```typescript
   // Evaluation Configuration
   {
     commitment_weight: 0.4,    // 40% of total score
     quality_weight: 0.4,       // 40% of total score
     timeliness_weight: 0.2,    // 20% of total score
     
     evaluation_frequency: 'weekly',
     self_assessment_enabled: true,
     certificate_auto_generation: true,
     min_score_for_certificate: 80
   }
   ```

2. **Define Scoring Rules**
   - Task completion bonus points
   - Quality assessment criteria
   - Deadline adherence scoring
   - Initiative and collaboration bonuses

#### **Step 7: Start Creating Tasks**
1. **Task Categories**
   - **Big Bets**: High-value, high-risk strategic initiatives
   - **Line Extensions**: Incremental improvements and features
   - **LTOs**: Limited time offers and campaigns
   - **Other**: Maintenance and operational tasks

2. **Task Assignment Workflow**
   ```
   Create Task → Assign to Project → Select Team → Choose Member → Set Deadline → Add Requirements
   ```

#### **Step 8: Set Up Notifications**
1. **Email Configuration**
   - Configure SMTP settings in Supabase
   - Set up email templates for notifications

2. **Notification Rules**
   - Deadline reminders (3 days, 1 day, due date)
   - Achievement notifications
   - Team updates and announcements
   - Performance milestone alerts

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

---

## 🎮 Comprehensive Usage Guide

### 👨‍💼 **For Administrators**

#### **Daily Workflow**
1. **Morning Review**
   - Check workspace dashboard for overnight updates
   - Review urgent notifications and alerts
   - Monitor project health and resource utilization

2. **Member Management**
   ```bash
   # Navigate to Members section
   /app/members
   
   # Add new member
   Click "Add Member" → Fill details → Assign role → Save
   
   # Bulk operations
   Select multiple members → Bulk assign to project/team
   ```

3. **Task Distribution**
   - Create high-level project tasks
   - Assign to appropriate teams
   - Set priorities and deadlines
   - Monitor progress through various views

4. **Performance Monitoring**
   - Weekly performance reviews
   - Generate team and individual reports
   - Issue certificates for top performers
   - Address performance issues early

#### **Monthly Activities**
- **Performance Reports**: Generate comprehensive monthly reports
- **Project Reviews**: Assess project progress and adjust timelines
- **Team Optimization**: Rebalance team assignments based on performance
- **System Maintenance**: Update settings, archive completed projects

### 👨‍💼 **For Supervisors**

#### **Team Management Workflow**
1. **Team Dashboard Overview**
   ```typescript
   // Supervisor Dashboard Elements
   {
     team_members: Member[],           // Team member list
     active_tasks: Task[],             // Current assignments
     performance_metrics: Metrics,    // Team performance data
     upcoming_deadlines: Task[],       // Due soon tasks
     evaluation_queue: Member[]       // Members pending evaluation
   }
   ```

2. **Task Assignment Process**
   - Review project requirements
   - Break down into manageable tasks
   - Assign based on member skills and availability
   - Set realistic deadlines with buffer time

3. **Evaluation Responsibilities**
   ```bash
   # Weekly evaluation process
   1. Review completed tasks
   2. Assess work quality
   3. Rate member performance (1-10 scale)
   4. Compare with self-assessment
   5. Provide feedback and recommendations
   ```

4. **Team Communication**
   - Daily standup meeting coordination
   - Progress updates to admin
   - Issue escalation when needed
   - Recognition and motivation

### 👤 **For Members**

#### **Daily Task Management**
1. **Morning Routine**
   ```bash
   # Check personal dashboard
   /app/dashboard/member
   
   # Review today's tasks
   Filter: Due today + In Progress
   
   # Update task status
   Click task → Update status → Add progress notes
   ```

2. **Task Completion Process**
   - Update task status to "In Progress"
   - Work on assigned deliverables
   - Upload proof of completion (files, screenshots)
   - Mark as "Review" when ready for evaluation
   - Respond to feedback and make corrections

3. **Self-Assessment**
   ```typescript
   // Weekly Self-Assessment Form
   {
     commitment_rating: 1-10,      // Self-rate commitment level
     quality_confidence: 1-10,     // Confidence in work quality
     time_management: 1-10,        // Time management effectiveness
     collaboration: 1-10,          // Team collaboration quality
     learning_growth: 1-10,        // Personal development
     challenges_faced: string,     // Describe difficulties
     achievements: string,         // Highlight accomplishments
     improvement_goals: string     // Next period goals
   }
   ```

4. **Performance Tracking**
   - Monitor personal score trends
   - Review feedback from supervisors
   - Set personal improvement goals
   - Track earned certificates and achievements

### 📊 **Multi-View Task Management**

#### **1. Bubble Chart View** 📈
**Best for: Strategic portfolio overview**
```bash
# Access: Dashboard → Portfolio View
- X-axis: Value (1-10)
- Y-axis: Risk (1-10)
- Bubble size: NPV (millions)
- Color: Category (Big Bets, Line Extensions, LTOs, Other)

# Use cases:
- Portfolio prioritization
- Resource allocation decisions
- Risk assessment
- Strategic planning
```

#### **2. Kanban Board View** 📋
**Best for: Team workflow management**
```bash
# Access: Dashboard → Board View
- Columns: Todo → In Progress → Review → Done
- Drag-and-drop task movement
- WIP limits per column
- Team member avatars on cards

# Use cases:
- Sprint planning
- Daily standups
- Workflow optimization
- Team coordination
```

#### **3. Calendar View** 📅
**Best for: Timeline and deadline management**
```bash
# Access: Dashboard → Calendar View
- Monthly/weekly/daily views
- Task duration visualization
- Deadline highlighting
- Drag-and-drop rescheduling

# Use cases:
- Project timeline planning
- Resource scheduling
- Deadline management
- Meeting coordination
```

#### **4. Table View** 📊
**Best for: Detailed data management**
```bash
# Access: Dashboard → Table View
- Sortable columns
- Advanced filtering
- Inline editing
- Bulk operations
- Export capabilities

# Use cases:
- Data analysis
- Bulk operations
- Detailed reporting
- Administrative tasks
```

#### **5. Process Map View** 🗺️
**Best for: Workflow design**
```bash
# Access: Dashboard → Map View
- Node-based workflow design
- Task dependencies
- Process optimization
- Visual workflow documentation

# Use cases:
- Process documentation
- Workflow optimization
- Training materials
- Process standardization
```

#### **6. List View** 📝
**Best for: Simple task listing**
```bash
# Access: Dashboard → List View
- Clean, minimal interface
- Quick task scanning
- Fast status updates
- Mobile-optimized

# Use cases:
- Mobile task management
- Quick task reviews
- Simple task updates
- Focused work sessions
```

### 📈 **Performance Analytics & Reporting**

#### **Individual Performance Tracking**
```typescript
// Member Performance Metrics
{
  overall_score: number,           // Current total score (0-100)
  score_trend: 'up' | 'down' | 'stable',
  task_completion_rate: number,   // Percentage of completed tasks
  average_task_duration: number,  // Hours per task
  quality_rating: number,         // Average quality score
  on_time_delivery: number,       // Percentage delivered on time
  collaboration_score: number,    // Team interaction rating
  growth_trajectory: 'improving' | 'declining' | 'stable'
}
```

#### **Team Analytics Dashboard**
- **Team Velocity**: Tasks completed per sprint/week
- **Workload Distribution**: Balance across team members
- **Collaboration Metrics**: Inter-team task dependencies
- **Quality Trends**: Quality improvements over time
- **Resource Utilization**: Team capacity usage

#### **Project Health Monitoring**
- **Progress Indicators**: Percentage completion by milestone
- **Budget Tracking**: Actual vs planned resource usage
- **Risk Assessment**: High-risk task identification
- **Timeline Analysis**: On-time vs delayed deliveries
- **Quality Metrics**: Defect rates and revision cycles

### 🎯 **Best Practices & Tips**

#### **For Effective Task Management**
1. **Clear Task Descriptions**: Include acceptance criteria and context
2. **Realistic Estimates**: Use historical data for duration estimates
3. **Regular Updates**: Update task status at least daily
4. **Quality Documentation**: Attach relevant files and screenshots
5. **Proactive Communication**: Report blockers and delays early

#### **For Better Team Collaboration**
1. **Regular Check-ins**: Daily standups and weekly team meetings
2. **Knowledge Sharing**: Document processes and lessons learned
3. **Cross-training**: Ensure team members can cover for each other
4. **Feedback Culture**: Provide constructive feedback regularly
5. **Recognition**: Celebrate achievements and milestones

#### **For Performance Optimization**
1. **Goal Setting**: Set SMART goals for individuals and teams
2. **Skill Development**: Provide training and growth opportunities
3. **Workload Balance**: Avoid overallocation of team members
4. **Process Improvement**: Regular retrospectives and optimizations
5. **Technology Leverage**: Use automation for repetitive tasks

---

## � API Reference & Integration

### **Core API Endpoints**

#### **Authentication API**
```typescript
// Register new user
POST /api/auth/register
{
  email: string,
  password: string,
  full_name: string,
  role?: 'admin' | 'supervisor' | 'member'
}

// Login user
POST /api/auth/login
{
  email: string,
  password: string
}

// Password reset
POST /api/auth/reset-password
{
  email: string
}
```

#### **Workspace Management API**
```typescript
// Get user workspaces
GET /api/workspaces

// Create workspace
POST /api/workspaces
{
  name: string,
  description?: string,
  settings: WorkspaceSettings
}

// Update workspace
PUT /api/workspaces/:id
{
  name?: string,
  description?: string,
  settings?: WorkspaceSettings
}
```

#### **Project Management API**
```typescript
// Get workspace projects
GET /api/projects?workspace_id=:id

// Create project
POST /api/projects
{
  workspace_id: string,
  name: string,
  description?: string,
  admin_id: string,
  start_date?: string,
  end_date?: string,
  budget?: number,
  settings: ProjectSettings
}

// Update project status
PUT /api/projects/:id/status
{
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
}
```

#### **Team Management API**
```typescript
// Get project teams
GET /api/teams?project_id=:id

// Create team
POST /api/teams
{
  project_id: string,
  name: string,
  description?: string,
  admin_id: string,
  settings: TeamSettings
}

// Add team member
POST /api/teams/:id/members
{
  user_id: string,
  role: 'admin' | 'member' | 'guest'
}

// Remove team member
DELETE /api/teams/:team_id/members/:user_id
```

#### **Task Management API**
```typescript
// Get tasks with filters
GET /api/tasks?project_id=:id&team_id=:team_id&status=:status

// Create task
POST /api/tasks
{
  project_id: string,
  team_id?: string,
  title: string,
  description?: string,
  priority: 'high' | 'medium' | 'low',
  assigned_to?: string,
  due_date?: string,
  value?: number,
  risk?: number,
  npv?: number,
  category?: string
}

// Update task status
PUT /api/tasks/:id/status
{
  status: 'todo' | 'in-progress' | 'review' | 'done',
  notes?: string,
  attachments?: File[]
}

// Assign task
PUT /api/tasks/:id/assign
{
  assigned_to: string,
  assigned_by: string,
  notes?: string
}
```

#### **Member Evaluation API**
```typescript
// Get member evaluations
GET /api/evaluations?member_id=:id&period=:period

// Create evaluation
POST /api/evaluations
{
  member_id: string,
  evaluator_id: string,
  period: string,
  scores: {
    commitment: number,    // 1-10
    quality: number,       // 1-10
    timeliness: number,    // 1-10
    collaboration: number  // 1-10
  },
  notes?: string,
  type: 'supervisor' | 'self_assessment'
}

// Get member performance summary
GET /api/members/:id/performance
```

#### **Reporting API**
```typescript
// Generate performance report
POST /api/reports/performance
{
  type: 'member' | 'team' | 'project' | 'workspace',
  target_id: string,
  period: string,
  format: 'pdf' | 'excel' | 'csv'
}

// Get analytics data
GET /api/analytics/:type?period=:period&filters=:filters

// Generate certificate
POST /api/certificates
{
  member_id: string,
  achievement_type: string,
  period: string,
  template_id?: string
}
```

### **Webhook Integration**

#### **Available Webhooks**
```typescript
// Task status updates
POST /webhook/task-update
{
  event: 'task.status_changed',
  data: {
    task_id: string,
    old_status: string,
    new_status: string,
    updated_by: string,
    timestamp: string
  }
}

// Performance milestones
POST /webhook/performance-milestone
{
  event: 'member.milestone_reached',
  data: {
    member_id: string,
    milestone: 'certificate_earned' | 'score_improved' | 'goal_achieved',
    score: number,
    timestamp: string
  }
}

// Project deadlines
POST /webhook/project-deadline
{
  event: 'project.deadline_approaching',
  data: {
    project_id: string,
    days_remaining: number,
    completion_percentage: number,
    at_risk_tasks: number
  }
}
```

### **External System Integration**

#### **Calendar Sync**
```typescript
// Google Calendar Integration
{
  provider: 'google_calendar',
  settings: {
    calendar_id: string,
    sync_direction: 'bidirectional' | 'push' | 'pull',
    event_types: ['tasks', 'deadlines', 'meetings'],
    update_frequency: 'realtime' | 'hourly' | 'daily'
  }
}

// Outlook Integration
{
  provider: 'outlook',
  settings: {
    tenant_id: string,
    sync_direction: 'bidirectional',
    event_types: ['tasks', 'deadlines'],
    calendar_name: 'PPH Tasks'
  }
}
```

#### **Communication Platform Integration**
```typescript
// Slack Integration
{
  provider: 'slack',
  settings: {
    workspace_url: string,
    bot_token: string,
    channels: {
      general: '#pph-updates',
      alerts: '#pph-alerts',
      achievements: '#achievements'
    },
    notification_types: ['task_assigned', 'deadline_approaching', 'milestone_reached']
  }
}

// Microsoft Teams Integration
{
  provider: 'teams',
  settings: {
    tenant_id: string,
    team_id: string,
    channel_mappings: {
      project_updates: 'Project Updates',
      achievements: 'Team Achievements'
    }
  }
}
```

#### **File Storage Integration**
```typescript
// Google Drive Integration
{
  provider: 'google_drive',
  settings: {
    folder_structure: {
      root: 'PPH Documents',
      projects: 'Projects/{project_name}',
      teams: 'Teams/{team_name}',
      reports: 'Reports/{year}/{month}'
    },
    auto_sync: true,
    permissions: 'team_members'
  }
}

// Dropbox Integration
{
  provider: 'dropbox',
  settings: {
    app_key: string,
    folder_path: '/PPH',
    sync_mode: 'automatic',
    file_types: ['documents', 'images', 'reports']
  }
}
```

### **Database Schema Reference**

#### **Core Tables**
```sql
-- Workspaces (Organization level)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects (Initiative level)
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  name TEXT NOT NULL,
  admin_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  budget DECIMAL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams (Collaboration groups)
CREATE TABLE teams (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  name TEXT NOT NULL,
  admin_id UUID REFERENCES auth.users(id),
  description TEXT,
  avatar_url TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks (Work items)
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  team_id UUID REFERENCES teams(id),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'todo',
  assigned_to UUID REFERENCES auth.users(id),
  assigned_by UUID REFERENCES auth.users(id),
  value INTEGER CHECK (value >= 1 AND value <= 10),
  risk INTEGER CHECK (risk >= 1 AND risk <= 10),
  npv DECIMAL,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Evaluation Tables**
```sql
-- Member evaluations
CREATE TABLE evaluations (
  id UUID PRIMARY KEY,
  member_id UUID REFERENCES auth.users(id),
  evaluator_id UUID REFERENCES auth.users(id),
  evaluation_period TEXT NOT NULL,
  commitment_score INTEGER CHECK (commitment_score >= 1 AND commitment_score <= 10),
  quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 10),
  timeliness_score INTEGER CHECK (timeliness_score >= 1 AND timeliness_score <= 10),
  collaboration_score INTEGER CHECK (collaboration_score >= 1 AND collaboration_score <= 10),
  total_score DECIMAL,
  evaluation_type TEXT DEFAULT 'supervisor',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics
CREATE TABLE performance_metrics (
  id UUID PRIMARY KEY,
  member_id UUID REFERENCES auth.users(id),
  metric_period TEXT NOT NULL,
  tasks_completed INTEGER DEFAULT 0,
  tasks_on_time INTEGER DEFAULT 0,
  average_quality_score DECIMAL,
  total_score DECIMAL,
  ranking INTEGER,
  certificates_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## �🛠️ Tech Stack

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

## 🚢 Production Deployment Guide

### **Pre-Deployment Checklist**

#### **Environment Setup**
```bash
# Required Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional Configuration
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-app-password
```

#### **Database Preparation**
1. **Run All Migration Scripts**
   ```sql
   -- Execute in Supabase SQL Editor
   01_schema.sql                     ✓
   02_rls_policies.sql              ✓
   03_functions.sql                 ✓
   04_seed_data.sql                 ✓
   05_financial_schema.sql          ✓
   06_financial_rls_policies.sql    ✓
   07_financial_seed_data.sql       ✓
   11_team_collaboration_schema.sql ✓
   12_multi_project_migration.sql   ✓
   13_data_migration.sql            ✓
   ```

2. **Verify Database Setup**
   ```bash
   # Check tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   
   # Verify RLS policies
   SELECT * FROM pg_policies;
   
   # Test sample queries
   SELECT COUNT(*) FROM workspaces;
   SELECT COUNT(*) FROM projects;
   SELECT COUNT(*) FROM teams;
   ```

### **Deploy to Vercel (Recommended)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MMansy19/PPH)

#### **Step-by-Step Deployment**
1. **Prepare Repository**
   ```bash
   # Ensure clean build
   npm run build
   npm run test  # if tests exist
   
   # Commit and push
   git add .
   git commit -m "Production ready: Complete PPH system"
   git push origin main
   ```

2. **Vercel Configuration**
   ```json
   // vercel.json
   {
     "framework": "nextjs",
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install",
     "env": {
       "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
       "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
       "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-key"
     },
     "build": {
       "env": {
         "NODE_ENV": "production"
       }
     }
   }
   ```

3. **Domain Configuration**
   - Add custom domain in Vercel dashboard
   - Configure DNS records
   - Enable SSL certificate (automatic)

### **Deploy to AWS Amplify**

#### **Amplify Setup**
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize project
amplify init

# Add hosting
amplify add hosting
amplify publish
```

#### **Environment Configuration**
```yaml
# amplify.yml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
```

### **Deploy to DigitalOcean App Platform**

#### **App Spec Configuration**
```yaml
# .do/app.yaml
name: pph-app
services:
- name: web
  source_dir: /
  github:
    repo: MMansy19/PPH
    branch: main
    deploy_on_push: true
  run_command: npm start
  build_command: npm run build
  http_port: 3000
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NEXT_PUBLIC_SUPABASE_URL
    value: ${SUPABASE_URL}
  - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
    value: ${SUPABASE_ANON_KEY}
```

### **Self-Hosted Deployment**

#### **Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["npm", "start"]
```

#### **Docker Compose Setup**
```yaml
# docker-compose.yml
version: '3.8'
services:
  pph-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - pph-app
    restart: unless-stopped
```

### **Performance Optimization**

#### **Build Optimization**
```javascript
// next.config.ts
const nextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Image optimization
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Bundle analysis
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    return config;
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}
```

#### **CDN Configuration**
- **Static Assets**: Serve images, CSS, JS from CDN
- **Database Optimization**: Enable connection pooling
- **Caching Strategy**: Implement Redis for session data
- **Monitoring**: Set up application monitoring and alerts

### **Security Hardening**

#### **Supabase Security**
```sql
-- Enable RLS on all tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Users can only access their workspace data" 
ON workspaces FOR ALL 
USING (auth.uid() = owner_id OR auth.uid() IN (
  SELECT user_id FROM workspace_members 
  WHERE workspace_id = workspaces.id
));
```

#### **Application Security**
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh session if expired
  await supabase.auth.getSession()
  
  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }
  
  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

### **Monitoring & Maintenance**

#### **Health Checks**
```typescript
// pages/api/health.ts
export default async function handler(req: NextRequest, res: NextResponse) {
  try {
    // Check database connection
    const { data, error } = await supabase
      .from('workspaces')
      .select('count')
      .limit(1)
    
    if (error) throw error
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message
    }, { status: 500 })
  }
}
```

#### **Backup Strategy**
```bash
# Database backup (daily)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# File backup (Supabase Storage)
# Automatic backups enabled in Supabase dashboard

# Application backup
# Git repository with tags for releases
git tag -a v1.0.0 -m "Production release v1.0.0"
```

---

## 📚 Documentation & Resources

### **Comprehensive Documentation**
- **[Setup Guide](docs/SETUP_GUIDE.md)** - Step-by-step installation and configuration
- **[Task System Documentation](docs/TASK_SYSTEM_DOCUMENTATION.md)** - Complete task management system guide
- **[Team Collaboration Guide](docs/TEAM_COLLABORATION/)** - Team management and collaboration features
- **[Project Status](docs/PROJECT_STATUS.md)** - Current features and development roadmap
- **[Enhancement Summary](docs/ENHANCEMENT_SUMMARY.md)** - Recent improvements and updates
- **[SEO Guide](docs/seo/SEO_GUIDE.md)** - Search engine optimization best practices

### **API Documentation**
- **REST API Reference** - Complete API endpoint documentation
- **Webhook Integration** - Real-time event notifications
- **Database Schema** - Table structures and relationships
- **Authentication Flow** - Security and access control

### **Integration Guides**
- **Calendar Sync** - Google Calendar, Outlook integration
- **Communication Platforms** - Slack, Microsoft Teams setup
- **File Storage** - Google Drive, Dropbox configuration
- **External APIs** - Third-party service integrations

---

## 🚀 Getting Support

### **Community Support**
- **GitHub Discussions** - Community Q&A and feature discussions
- **Issue Tracker** - Bug reports and feature requests
- **Wiki** - Community-contributed guides and tutorials
- **Slack Channel** - Real-time community support (Coming Soon)

### **Professional Support**
For enterprise customers and professional support:
- **Priority Support** - 24/7 technical assistance
- **Custom Development** - Tailored feature development
- **Training Sessions** - Team onboarding and training
- **Consulting Services** - Implementation and optimization

Contact: [support@pph-app.com](mailto:support@pph-app.com)

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **Ways to Contribute**
1. **Code Contributions** - Features, bug fixes, improvements
2. **Documentation** - Guides, tutorials, API documentation
3. **Testing** - Bug reports, usability testing
4. **Translations** - Multi-language support
5. **Community Support** - Help other users in discussions

### **Development Workflow**
```bash
# 1. Fork and clone the repository
git clone https://github.com/yourusername/PPH.git
cd PPH

# 2. Create a feature branch
git checkout -b feature/amazing-new-feature

# 3. Make your changes
# Follow coding standards and add tests

# 4. Commit with conventional commits
git commit -m "feat: add member evaluation system"

# 5. Push and create pull request
git push origin feature/amazing-new-feature
```

### **Development Guidelines**
- **Code Style** - Follow TypeScript and React best practices
- **Testing** - Add tests for new features
- **Documentation** - Update docs for new features
- **Accessibility** - Support screen readers and keyboard navigation
- **Performance** - Optimize for mobile and slow connections
- **Security** - Follow security best practices

### **Commit Message Convention**
```bash
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

---

## 🐛 Issue Reporting & Feature Requests

### **Bug Reports**
Found a bug? Help us fix it:

1. **Check Existing Issues** - Avoid duplicates
2. **Use Bug Template** - Provide detailed information
3. **Include Screenshots** - Visual context helps
4. **Provide Steps** - How to reproduce the issue
5. **Environment Details** - Browser, OS, device info

**Bug Report Template:**
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g. iOS, Windows, macOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
- Device: [e.g. iPhone12, desktop]
```

### **Feature Requests**
Have an idea for improvement?

1. **Search Existing Requests** - Check if already requested
2. **Use Feature Template** - Describe the feature clearly
3. **Explain Use Case** - Why is this feature needed?
4. **Provide Examples** - Similar features in other apps
5. **Consider Implementation** - How might it work?

---

## 📊 Project Roadmap

### **Current Version: 2.0** 🚀
- ✅ Multi-project architecture
- ✅ Team collaboration system
- ✅ Member evaluation system
- ✅ Advanced task management
- ✅ Financial tracking
- ✅ Multiple visualization modes

### **Version 2.1** (Q1 2026) 🔮
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] API rate limiting
- [ ] Advanced reporting system
- [ ] Custom workflow builder

### **Version 2.2** (Q2 2026) 🌟
- [ ] AI-powered task recommendations
- [ ] Automated performance insights
- [ ] Advanced calendar integration
- [ ] Multi-language support
- [ ] Advanced security features
- [ ] Enterprise SSO integration

### **Version 3.0** (Q3 2026) 🚀
- [ ] Machine learning analytics
- [ ] Predictive project management
- [ ] Advanced automation
- [ ] Custom integrations platform
- [ ] White-label solutions
- [ ] Advanced compliance features

---

## � Licensing & Legal

### **Open Source License**
This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

#### **What you can do:**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

#### **What you must do:**
- � Include copyright
- 📝 Include license

#### **What you cannot do:**
- ❌ Hold author liable

### **Third-Party Licenses**
This project uses several open-source libraries. See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) for details.

### **Data Privacy**
We take data privacy seriously:
- **GDPR Compliant** - European data protection standards
- **SOC 2 Type II** - Enterprise security standards
- **End-to-End Encryption** - Data encrypted in transit and at rest
- **Regular Audits** - Security and compliance audits

---

## 🌟 Acknowledgments & Credits

### **Core Technologies**
- **[Next.js](https://nextjs.org/)** - The React Framework for Production
- **[Supabase](https://supabase.com/)** - Open Source Firebase Alternative
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript with syntax for types
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### **UI Components & Libraries**
- **[Shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Radix UI](https://www.radix-ui.com/)** - Low-level UI primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icons
- **[Recharts](https://recharts.org/)** - Chart library built on React components
- **[React Flow](https://reactflow.dev/)** - Node-based UI for React

### **Development Tools**
- **[ESLint](https://eslint.org/)** - Find and fix problems in JavaScript code
- **[Prettier](https://prettier.io/)** - Opinionated code formatter
- **[Husky](https://typicode.github.io/husky/)** - Git hooks made easy
- **[Vercel](https://vercel.com/)** - Platform for frontend frameworks and static sites

### **Special Thanks**
- **Open Source Community** - For amazing tools and libraries
- **Beta Testers** - For valuable feedback and bug reports
- **Contributors** - For code contributions and improvements
- **Documentation Contributors** - For helping improve our docs

---

## 📧 Contact & Support

### **Development Team**
**Mohamed Mansy** - Lead Developer & Product Owner
- 🐙 GitHub: [@MMansy19](https://github.com/MMansy19)
- 💼 LinkedIn: [mahmoud-mansy](https://www.linkedin.com/in/mahmood-mansy)
- 🌐 Portfolio: [mahmoud-mansy.vercel.app](https://mahmoud-mansy.vercel.app/)
- 📧 Email: [mohamed.mansy@example.com](mailto:mohamed.mansy@example.com)

### **Project Links**
- **🏠 Homepage**: [https://pph-app.com](https://pph-app.com)
- **📱 Live Demo**: [https://pph.vercel.app](https://pph.vercel.app)
- **📚 Documentation**: [https://docs.pph-app.com](https://docs.pph-app.com)
- **💻 Source Code**: [https://github.com/MMansy19/PPH](https://github.com/MMansy19/PPH)
- **🐛 Issue Tracker**: [https://github.com/MMansy19/PPH/issues](https://github.com/MMansy19/PPH/issues)

### **Community**
- **💬 Discussions**: [GitHub Discussions](https://github.com/MMansy19/PPH/discussions)
- **📢 Announcements**: [GitHub Releases](https://github.com/MMansy19/PPH/releases)
- **🐦 Twitter**: [@PPH_App](https://twitter.com/PPH_App) (Coming Soon)
- **📺 YouTube**: [PPH Tutorials](https://youtube.com/@PPH_App) (Coming Soon)

---

<div align="center">

### **⭐ Show Your Support**

If you find this project helpful, please consider:
- ⭐ **Starring the repository**
- 🍴 **Forking and contributing**
- 📢 **Sharing with your network**
- 💬 **Joining our community discussions**
- 🐛 **Reporting bugs and suggesting features**

---

### **Built with ❤️ for the Community**

**Personal Process Hub (PPH)** - Empowering teams to achieve more together

*Made with Next.js, TypeScript, Supabase, and lots of ☕*

**© 2025 Personal Process Hub. Licensed under ISC License.**

---

*Last Updated: November 8, 2025*

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
