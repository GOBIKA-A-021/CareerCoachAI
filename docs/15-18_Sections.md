# AI Career Coach - Sections 15-18

---

<a name="section-15"></a>
# SECTION 15: FRONTEND DESIGN

## 15.1 Home Page

**Purpose**: Landing page with project overview and call-to-action

**Components**:
- Hero section with tagline
- Feature highlights
- How it works section
- Testimonials
- CTA buttons (Register, Login)

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Navbar (Logo, Home, Features, About, Login/Register)   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HERO SECTION                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  AI-Powered Career Coach                        │   │
│  │  Analyze your resume, identify skill gaps,       │   │
│  │  and get personalized career roadmaps           │   │
│  │                                                  │   │
│  │  [Get Started Free] [Learn More]                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  FEATURES                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ ATS      │  │ Skill    │  │ Career   │             │
│  │ Analysis │  │ Gap      │  │ Roadmap  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  HOW IT WORKS                                           │
│  1. Upload Resume → 2. AI Analysis → 3. Get Report     │
│                                                         │
│  FOOTER                                                 │
└─────────────────────────────────────────────────────────┘
```

**State Management**:
```javascript
const [scrolled, setScrolled] = useState(false);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
```

**API Calls**: None (static page)

---

## 15.2 Register Page

**Purpose**: User registration with form validation

**Components**:
- Registration form
- Form validation
- Password strength indicator
- Terms and conditions checkbox
- Link to login page

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Navbar                                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  CREATE ACCOUNT                                  │   │
│  │                                                  │   │
│  │  First Name: [________________]                 │   │
│  │  Last Name:  [________________]                 │   │
│  │  Email:       [________________]                 │   │
│  │  Password:    [________________] 🔒             │   │
│  │               Strength: ████████ Strong         │   │
│  │  Confirm:     [________________] 🔒             │   │
│  │                                                  │   │
│  │  [x] I agree to Terms and Conditions            │   │
│  │                                                  │   │
│  │  [Create Account]                                │   │
│  │                                                  │   │
│  │  Already have an account? [Login]               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**State Management**:
```javascript
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
});
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
const [passwordStrength, setPasswordStrength] = useState(0);
```

**API Calls**:
```javascript
const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await authService.register(formData);
    localStorage.setItem('token', response.token);
    navigate('/dashboard');
  } catch (error) {
    setErrors(error.response.data);
  } finally {
    setLoading(false);
  }
};
```

---

## 15.3 Login Page

**Purpose**: User authentication

**Components**:
- Login form
- Email/password inputs
- Remember me checkbox
- Forgot password link
- Social login options (optional)
- Link to register page

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Navbar                                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  WELCOME BACK                                    │   │
│  │                                                  │   │
│  │  Email:    [________________]                   │   │
│  │  Password: [________________] 🔒               │   │
│  │                                                  │   │
│  │  [x] Remember me  [Forgot Password?]            │   │
│  │                                                  │   │
│  │  [Login]                                        │   │
│  │                                                  │   │
│  │  Don't have an account? [Register]              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**State Management**:
```javascript
const [formData, setFormData] = useState({
  email: '',
  password: ''
});
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

**API Calls**:
```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await authService.login(formData);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    navigate('/dashboard');
  } catch (error) {
    setError('Invalid credentials');
  } finally {
    setLoading(false);
  }
};
```

---

## 15.4 Dashboard

**Purpose**: Main user dashboard with overview and quick actions

**Components**:
- User profile summary
- Quick stats (ATS score, placement score)
- Recent analyses
- Quick action buttons
- Progress charts
- Notifications

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Sidebar │  Header                                       │
│  - Home   │  Welcome, [User] [Profile] [Logout]         │
│  - Upload │─────────────────────────────────────────────│
│  - Analysis│                                             │
│  - Roadmap│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  - Interview│  ATS      │  Placement│  Skills   │  │
│  - Reports │  Score: 75│  Score: 68│  Gap: 12  │  │
│  - Profile │  └──────────┘  └──────────┘  └──────────┘  │
│  - Settings│                                             │
│           │  QUICK ACTIONS                               │
│           │  [Upload Resume] [Analyze] [Get Roadmap]    │
│           │                                             │
│           │  RECENT ANALYSES                             │
│           │  ┌─────────────────────────────────────┐   │
│           │  │ Resume Analysis - 2 days ago        │   │
│           │  │ ATS: 75 | Placement: 68 [View]       │   │
│           │  └─────────────────────────────────────┘   │
│           │                                             │
│           │  PROGRESS CHART                              │
│           │  [Line chart showing score improvement]      │
│           │                                             │
└───────────┴─────────────────────────────────────────────┘
```

**State Management**:
```javascript
const [user, setUser] = useState(null);
const [stats, setStats] = useState(null);
const [recentAnalyses, setRecentAnalyses] = useState([]);
const [loading, setLoading] = useState(true);
```

**API Calls**:
```javascript
useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const [statsRes, analysesRes] = await Promise.all([
        api.get('/api/dashboard/stats'),
        api.get('/api/dashboard/analyses')
      ]);
      setStats(statsRes.data);
      setRecentAnalyses(analysesRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };
  fetchDashboardData();
}, []);
```

---

## 15.5 Upload Resume

**Purpose**: Upload PDF resume for analysis

**Components**:
- File upload area (drag & drop)
- File preview
- Upload progress bar
- File validation
- Upload button
- Upload history

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: Upload Resume                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │        📁                                       │   │
│  │     Drag & drop your resume here                 │   │
│  │     or click to browse                           │   │
│  │                                                  │   │
│  │     Supported: PDF only, Max 5MB                │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  UPLOAD HISTORY                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  resume_v1.pdf - 2 days ago [Download] [Delete] │   │
│  │  resume_v2.pdf - 1 day ago  [Download] [Delete] │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Upload Resume]                                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**State Management**:
```javascript
const [file, setFile] = useState(null);
const [uploadProgress, setUploadProgress] = useState(0);
const [uploading, setUploading] = useState(false);
const [uploadHistory, setUploadHistory] = useState([]);
const [dragActive, setDragActive] = useState(false);
```

**API Calls**:
```javascript
const handleUpload = async () => {
  if (!file) return;
  
  setUploading(true);
  const formData = new FormData();
  formData.append('resume', file);

  try {
    const response = await resumeService.upload(formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      }
    });
    
    setUploadHistory([response.data, ...uploadHistory]);
    setFile(null);
    setUploadProgress(0);
  } catch (error) {
    console.error('Upload failed');
  } finally {
    setUploading(false);
  }
};
```

---

## 15.6 Resume Analysis

**Purpose**: Display ATS analysis results

**Components**:
- Overall ATS score (circular progress)
- Score breakdown (bar charts)
- Strengths list
- Weaknesses list
- Improvement suggestions
- Comparison with previous analysis

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: Resume Analysis                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  OVERALL ATS SCORE                               │   │
│  │                                                  │   │
│  │         ████████████ 75/100                      │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  SCORE BREAKDOWN                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Keyword Match:     ██████████ 80/100           │   │
│  │  Format Score:      ████████   70/100           │   │
│  │  Sections:          ██████████ 85/100           │   │
│  │  Action Verbs:      ██████     60/100           │   │
│  │  Achievements:      █████      50/100           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  STRENGTHS                                              │
│  ✓ Good keyword match                                   │
│  ✓ Well-organized sections                              │
│  ✓ Clear contact information                           │
│                                                         │
│  WEAKNESSES                                              │
│  ✗ Low action verb usage                                │
│  ✗ Few quantifiable achievements                        │
│  ✗ Missing some key sections                            │
│                                                         │
│  [Generate Report] [Re-analyze]                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**State Management**:
```javascript
const [analysis, setAnalysis] = useState(null);
const [loading, setLoading] = useState(false);
const [comparing, setComparing] = useState(false);
```

**API Calls**:
```javascript
const fetchAnalysis = async (resumeId) => {
  setLoading(true);
  try {
    const response = await api.get(`/api/resume/${resumeId}/analysis`);
    setAnalysis(response.data);
  } catch (error) {
    console.error('Failed to fetch analysis');
  } finally {
    setLoading(false);
  }
};
```

---

## 15.7 ATS Report

**Purpose**: Detailed ATS analysis report

**Components**:
- Detailed ATS metrics
- Section-by-section analysis
- Keyword match details
- Format analysis
- Action verb suggestions
- Achievement suggestions

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: ATS Report                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  KEYWORD MATCH ANALYSIS                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Matched: React, Node.js, JavaScript, MongoDB   │   │
│  │  Missing: TypeScript, Docker, GraphQL           │   │
│  │  Score: 80/100                                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  FORMAT ANALYSIS                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ✓ Bullet points used correctly                 │   │
│  │  ✓ Proper spacing and margins                  │   │
│  │  ✗ Inconsistent font sizes                      │   │
│  │  Score: 70/100                                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  SECTION ANALYSIS                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Contact Info:    ✓ Complete                   │   │
│  │  Summary:         ✓ Present                     │   │
│  │  Skills:          ✓ Comprehensive               │   │
│  │  Experience:      ✓ Detailed                    │   │
│  │  Education:       ✓ Present                     │   │
│  │  Projects:        ✓ Included                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Download PDF] [Share]                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 15.8 Skill Gap

**Purpose**: Display skill gap analysis

**Components**:
- Present skills list
- Missing skills list
- Priority indicators
- Learning time estimates
- Resource links
- Progress tracking

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: Skill Gap Analysis                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PRESENT SKILLS                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  React (Advanced)     ████████████████ 100%    │   │
│  │  Node.js (Intermediate) ██████████ 80%          │   │
│  │  JavaScript (Advanced) ████████████████ 100%   │   │
│  │  MongoDB (Intermediate) ██████████ 75%         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  MISSING SKILLS (Priority Order)                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🔴 TypeScript (High)                            │   │
│  │     Est. time: 2-3 weeks                        │   │
│  │     [Start Learning] [Resources]                │   │
│  │                                                  │   │
│  │  🟡 Docker (Medium)                              │   │
│  │     Est. time: 1-2 weeks                        │   │
│  │     [Start Learning] [Resources]                │   │
│  │                                                  │   │
│  │  🟢 GraphQL (Low)                                │   │
│  │     Est. time: 1 week                           │   │
│  │     [Start Learning] [Resources]                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Generate Roadmap] [Mark as Learned]                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 15.9 Career Roadmap

**Purpose**: Display personalized career roadmap

**Components**:
- Phase breakdown
- Timeline visualization
- Learning objectives
- Project suggestions
- Certification recommendations
- Milestone tracking
- Progress indicators

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: Career Roadmap                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TOTAL DURATION: 6 months                                │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  PHASE 1: Foundation Building (Month 1-2)        │   │
│  │  ─────────────────────────────────────────────  │   │
│  │  ✓ TypeScript Basics                             │   │
│  │  ✓ Advanced JavaScript Patterns                 │   │
│  │  ⏳ Docker Fundamentals                          │   │
│  │  ⬜ Container Orchestration                      │   │
│  │                                                  │   │
│  │  Projects:                                       │   │
│  │  • TypeScript Migration Project                 │   │
│  │  • Dockerized Application                       │   │
│  │                                                  │   │
│  │  Certifications:                                │   │
│  │  • Docker Certified Associate                   │   │
│  │                                                  │   │
│  │  Milestones:                                     │   │
│  │  ✓ Complete TypeScript course                   │   │
│  │  ⏳ Build Docker project                        │   │
│  │  ⬜ Pass certification exam                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  PHASE 2: Advanced Development (Month 3-4)      │   │
│  │  ─────────────────────────────────────────────  │   │
│  │  ⬜ GraphQL APIs                                 │   │
│  │  ⬜ Microservices Architecture                  │   │
│  │  ⬜ CI/CD Pipelines                              │   │
│  │                                                  │   │
│  │  [View Details]                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Download Roadmap] [Update Progress]                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 15.10 Interview Questions

**Purpose**: Display interview preparation questions

**Components**:
- Question categories tabs
- Technical questions
- Behavioral questions
- Coding questions
- Company-specific questions
- Difficulty filters
- Answer hints
- Practice mode

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: Interview Preparation                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Technical] [Behavioral] [Coding] [Company-Specific]   │
│                                                         │
│  TECHNICAL QUESTIONS                                     │
│  Filter: [All] [Easy] [Medium] [Hard]                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Q1: Explain the virtual DOM in React           │   │
│  │  Difficulty: Medium                              │   │
│  │  Topics: React, Performance                      │   │
│  │                                                  │   │
│  │  [Show Answer] [Mark as Learned] [Practice]     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Q2: What are React Hooks?                      │   │
│  │  Difficulty: Medium                              │   │
│  │  Topics: React, Hooks                            │   │
│  │                                                  │   │
│  │  [Show Answer] [Mark as Learned] [Practice]     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Load More]                                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 15.11 Placement Score

**Purpose**: Display placement readiness score

**Components**:
- Overall placement score
- Component breakdown
- Score interpretation
- Probability indicator
- Improvement suggestions
- Historical trend

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: Placement Score                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  PLACEMENT SCORE                                 │   │
│  │                                                  │   │
│  │         ████████████ 68/100                      │   │
│  │                                                  │   │
│  │  Placement Probability: High (60-80%)           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  SCORE BREAKDOWN                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Technical (40%):    ██████████ 75/100           │   │
│  │  Projects (25%):     ████████   65/100           │   │
│  │  Resume (25%):       ██████████ 70/100           │   │
│  │  Communication (10%): ██████████ 80/100           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  INTERPRETATION                                         │
│  Your placement readiness is GOOD. Focus on improving   │
│  project quality and technical skills to reach the     │
│  HIGH category.                                         │
│                                                         │
│  IMPROVEMENT SUGGESTIONS                                │
│  • Build 2 more complex projects                       │
│  • Learn TypeScript and Docker                         │
│  • Add quantifiable achievements to resume             │
│                                                         │
│  [View Detailed Report] [Track Progress]                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 15.12 Download Report

**Purpose**: Download comprehensive PDF report

**Components**:
- Report preview
- Download options (PDF, Word)
- Email report option
- Report history
- Share options

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: Download Report                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  REPORT PREVIEW                                  │   │
│  │                                                  │   │
│  │  [PDF Document Preview]                          │   │
│  │                                                  │   │
│  │  Pages: 8 | Size: 2.5 MB | Generated: Today      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  DOWNLOAD OPTIONS                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [📄 Download PDF] [📝 Download Word]            │   │
│  │  [📧 Email Report] [🔗 Share Link]               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  REPORT HISTORY                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Report_001.pdf - Jan 15 [Download]              │   │
│  │  Report_002.pdf - Feb 20 [Download]              │   │
│  │  Report_003.pdf - Mar 10 [Download]              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 15.13 Profile

**Purpose**: User profile management

**Components**:
- Profile information form
- Profile picture upload
- Target role selection
- Target companies
- Skills management
- Education information
- Experience information
- Account settings

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: My Profile                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  PROFILE PICTURE                                 │   │
│  │  [Avatar] [Change Photo]                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  PERSONAL INFORMATION                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  First Name: [John]                              │   │
│  │  Last Name:  [Doe]                               │   │
│  │  Email:      [john@example.com]                 │   │
│  │  Phone:      [+1 234 567 8900]                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  CAREER GOALS                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Target Role: [Full Stack Developer ▼]          │   │
│  │  Experience:  [2 years ▼]                        │   │
│  │  Target Companies: [Google] [Amazon] [Add]       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  SKILLS                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  React, Node.js, JavaScript, MongoDB [Add Skill] │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Save Changes]                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 15.14 Settings

**Purpose**: Account and application settings

**Components**:
- Account settings
- Notification preferences
- Privacy settings
- Theme selection
- Language selection
- Connected accounts
- Delete account

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: Settings                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ACCOUNT SETTINGS                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Change Password                                  │   │
│  │  Current: [________]                              │   │
│  │  New:      [________]                              │   │
│  │  Confirm:  [________]                              │   │
│  │  [Update Password]                                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  NOTIFICATIONS                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [x] Email notifications                          │   │
│  │  [x] Analysis completion alerts                  │   │
│  │  [ ] Weekly progress reports                     │   │
│  │  [ ] Marketing emails                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  APPEARANCE                                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Theme: [Light ▼]                                │   │
│  │  Language: [English ▼]                           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  PRIVACY                                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [ ] Profile visibility: Public                  │   │
│  │  [x] Data collection for analytics              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  DANGER ZONE                                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [Delete Account] [Export Data]                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 15.15 Admin Dashboard

**Purpose**: Admin panel for system management

**Components**:
- User management
- Analytics dashboard
- System health
- Report monitoring
- Career role management
- System configuration

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: Admin Dashboard                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Users    │  │ Analyses│  │ Reports  │             │
│  │ 1,234    │  │ 5,678    │  │ 890      │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  USER GROWTH CHART                                      │
│  [Line chart showing user growth over time]              │
│                                                         │
│  RECENT ACTIVITY                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  John Doe uploaded resume - 2 min ago            │   │
│  │  Jane Smith completed analysis - 5 min ago       │   │
│  │  Admin updated role requirements - 1 hour ago    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  SYSTEM HEALTH                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Database │  │ ChromaDB │  │ Gemini   │             │
│  │  ✓ OK    │  │  ✓ OK    │  │  ✓ OK    │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  [View Users] [View Reports] [System Settings]          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Design Summary

**UI Design Principles**:
- Modern, clean interface with Tailwind CSS
- Responsive design for all devices
- Consistent color scheme (primary: blue, secondary: green)
- Card-based layout for information grouping
- Clear visual hierarchy
- Intuitive navigation
- Loading states for async operations
- Error handling with user-friendly messages

**Common Components**:
- Navbar (responsive with mobile menu)
- Sidebar (for dashboard pages)
- Cards (for content grouping)
- Buttons (primary, secondary, danger)
- Inputs (with validation)
- Modals (for confirmations)
- Progress bars (for uploads/processing)
- Charts (for analytics)
- Tables (for data display)
- Loaders (for loading states)

**State Management**:
- React Context for global state (user, theme)
- Local state for component-specific data
- Custom hooks for reusable logic
- React Query for API caching

**Error Handling**:
- Try-catch blocks for API calls
- Error boundaries for component errors
- User-friendly error messages
- Retry mechanisms for failed requests

---

<a name="section-16"></a>
# SECTION 16: FOLDER STRUCTURE

## 16.1 Frontend Folder Structure (React.js)

```
frontend/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── robots.txt
│   └── manifest.json
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── hero-bg.jpg
│   │   │   └── default-avatar.png
│   │   ├── icons/
│   │   │   ├── dashboard.svg
│   │   │   ├── upload.svg
│   │   │   └── analysis.svg
│   │   └── fonts/
│   │       ├── Inter-Regular.woff2
│   │       └── Inter-Bold.woff2
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Navbar.module.css
│   │   │   │   └── index.js
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Sidebar.module.css
│   │   │   │   └── index.js
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── index.js
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── index.js
│   │   │   ├── Input/
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Input.module.css
│   │   │   │   └── index.js
│   │   │   ├── Card/
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Card.module.css
│   │   │   │   └── index.js
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Modal.module.css
│   │   │   │   └── index.js
│   │   │   ├── Loader/
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Loader.module.css
│   │   │   │   └── index.js
│   │   │   └── ProgressBar/
│   │   │       ├── ProgressBar.jsx
│   │   │       ├── ProgressBar.module.css
│   │   │       └── index.js
│   │   │
│   │   ├── charts/
│   │   │   ├── LineChart/
│   │   │   │   ├── LineChart.jsx
│   │   │   │   └── index.js
│   │   │   ├── BarChart/
│   │   │   │   ├── BarChart.jsx
│   │   │   │   └── index.js
│   │   │   ├── PieChart/
│   │   │   │   ├── PieChart.jsx
│   │   │   │   └── index.js
│   │   │   └── index.js
│   │   │
│   │   └── dashboard/
│   │       ├── StatCard/
│   │       │   ├── StatCard.jsx
│   │       │   ├── StatCard.module.css
│   │       │   └── index.js
│   │       ├── RecentActivity/
│   │       │   ├── RecentActivity.jsx
│   │       │   └── index.js
│   │       └── index.js
│   │
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   ├── Home.module.css
│   │   │   └── index.js
│   │   ├── Login/
│   │   │   ├── Login.jsx
│   │   │   ├── Login.module.css
│   │   │   └── index.js
│   │   ├── Register/
│   │   │   ├── Register.jsx
│   │   │   ├── Register.module.css
│   │   │   └── index.js
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Dashboard.module.css
│   │   │   └── index.js
│   │   ├── UploadResume/
│   │   │   ├── UploadResume.jsx
│   │   │   ├── UploadResume.module.css
│   │   │   └── index.js
│   │   ├── ResumeAnalysis/
│   │   │   ├── ResumeAnalysis.jsx
│   │   │   ├── ResumeAnalysis.module.css
│   │   │   └── index.js
│   │   ├── ATSReport/
│   │   │   ├── ATSReport.jsx
│   │   │   ├── ATSReport.module.css
│   │   │   └── index.js
│   │   ├── SkillGap/
│   │   │   ├── SkillGap.jsx
│   │   │   ├── SkillGap.module.css
│   │   │   └── index.js
│   │   ├── CareerRoadmap/
│   │   │   ├── CareerRoadmap.jsx
│   │   │   ├── CareerRoadmap.module.css
│   │   │   └── index.js
│   │   ├── InterviewQuestions/
│   │   │   ├── InterviewQuestions.jsx
│   │   │   ├── InterviewQuestions.module.css
│   │   │   └── index.js
│   │   ├── PlacementScore/
│   │   │   ├── PlacementScore.jsx
│   │   │   ├── PlacementScore.module.css
│   │   │   └── index.js
│   │   ├── Reports/
│   │   │   ├── Reports.jsx
│   │   │   ├── Reports.module.css
│   │   │   └── index.js
│   │   ├── Profile/
│   │   │   ├── Profile.jsx
│   │   │   ├── Profile.module.css
│   │   │   └── index.js
│   │   ├── Settings/
│   │   │   ├── Settings.jsx
│   │   │   ├── Settings.module.css
│   │   │   └── index.js
│   │   └── Admin/
│   │       ├── Admin.jsx
│   │       ├── Admin.module.css
│   │       └── index.js
│   │
│   ├── layouts/
│   │   ├── MainLayout/
│   │   │   ├── MainLayout.jsx
│   │   │   └── index.js
│   │   ├── DashboardLayout/
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── index.js
│   │   └── index.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useLocalStorage.js
│   │   ├── useDebounce.js
│   │   ├── useFileUpload.js
│   │   └── index.js
│   │
│   ├── context/
│   │   ├── AuthContext/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── AuthProvider.jsx
│   │   │   └── index.js
│   │   ├── ThemeContext/
│   │   │   ├── ThemeContext.jsx
│   │   │   ├── ThemeProvider.jsx
│   │   │   └── index.js
│   │   └── index.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── resumeService.js
│   │   ├── analysisService.js
│   │   ├── reportService.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── publicRoutes.jsx
│   │   ├── protectedRoutes.jsx
│   │   ├── adminRoutes.jsx
│   │   └── index.jsx
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── helpers.js
│   │   └── index.js
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── tailwind.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── vite-env.d.ts
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json (if using TypeScript)
└── README.md
```

### Folder Explanations

**public/**: Static assets served directly
- `index.html`: HTML entry point
- `favicon.ico`: Website icon
- `robots.txt`: SEO instructions

**src/assets/**: Static resources
- `images/`: Logos, backgrounds, avatars
- `icons/`: SVG icons
- `fonts/`: Custom fonts

**src/components/**: Reusable React components
- `common/`: Shared components (Navbar, Button, Input)
- `charts/`: Chart components (Line, Bar, Pie)
- `dashboard/`: Dashboard-specific components

**src/pages/**: Page-level components
- Each page has its own folder with JSX, CSS, and index.js

**src/layouts/**: Layout wrappers
- `MainLayout/`: Public pages layout
- `DashboardLayout/`: Dashboard pages with sidebar

**src/hooks/**: Custom React hooks
- `useAuth.js`: Authentication logic
- `useApi.js`: API call handling
- `useFileUpload.js`: File upload logic

**src/context/**: React Context providers
- `AuthContext/`: Global auth state
- `ThemeContext/`: Theme management

**src/services/**: API service functions
- `api.js`: Axios instance configuration
- `authService.js`: Auth API calls
- `resumeService.js`: Resume API calls

**src/routes/**: Route definitions
- `publicRoutes.jsx`: Unprotected routes
- `protectedRoutes.jsx`: Auth-required routes
- `adminRoutes.jsx`: Admin-only routes

**src/utils/**: Utility functions
- `constants.js`: App constants
- `validators.js`: Form validators
- `formatters.js`: Data formatters

**src/styles/**: Global styles
- `globals.css`: Global CSS
- `variables.css`: CSS variables
- `tailwind.css`: Tailwind imports

---

## 16.2 Backend Folder Structure (Node.js + Express)

```
backend/
│
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── gemini.js
│   │   ├── chromadb.js
│   │   ├── jwt.js
│   │   ├── cloudinary.js (optional for file storage)
│   │   └── index.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   ├── atsController.js
│   │   ├── roadmapController.js
│   │   ├── interviewController.js
│   │   ├── reportController.js
│   │   ├── adminController.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── analysisRoutes.js
│   │   ├── roadmapRoutes.js
│   │   ├── interviewRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── adminRoutes.js
│   │   └── index.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── validationMiddleware.js
│   │   ├── rateLimitMiddleware.js
│   │   └── index.js
│   │
│   ├── services/
│   │   ├── resumeParser.js
│   │   ├── embeddingService.js
│   │   ├── geminiService.js
│   │   ├── atsService.js
│   │   ├── roadmapService.js
│   │   ├── interviewService.js
│   │   ├── reportService.js
│   │   ├── placementService.js
│   │   ├── emailService.js (optional)
│   │   └── index.js
│   │
│   ├── ai-agent/
│   │   ├── agent.js
│   │   ├── planner.js
│   │   ├── executor.js
│   │   ├── toolSelector.js
│   │   ├── promptBuilder.js
│   │   ├── ragRetriever.js
│   │   ├── geminiTool.js
│   │   ├── resumeTool.js
│   │   ├── memory.js
│   │   ├── reportGenerator.js
│   │   └── index.js
│   │
│   ├── vector/
│   │   ├── chromaClient.js
│   │   ├── embeddings.js
│   │   ├── ingestDocuments.js
│   │   ├── queryDocuments.js
│   │   └── index.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Resume.js
│   │   ├── Analysis.js
│   │   ├── Report.js
│   │   ├── CareerRole.js
│   │   ├── Roadmap.js
│   │   ├── InterviewQuestion.js
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── passwordUtils.js
│   │   ├── tokenUtils.js
│   │   ├── fileUtils.js
│   │   ├── validationUtils.js
│   │   ├── errorHandlers.js
│   │   └── index.js
│   │
│   ├── uploads/
│   │   └── resumes/
│   │
│   ├── reports/
│   │   └── generated/
│   │
│   ├── career-data/
│   │   ├── roadmaps/
│   │   ├── interview_questions/
│   │   ├── ats_guides/
│   │   ├── certifications/
│   │   ├── projects/
│   │   └── company_profiles/
│   │
│   └── server.js
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── Dockerfile
```

### Folder Explanations

**src/config/**: Configuration files
- `database.js`: MongoDB connection setup
- `gemini.js`: Gemini API configuration
- `chromadb.js`: ChromaDB client setup
- `jwt.js`: JWT token configuration
- `cloudinary.js`: Cloudinary for file storage (optional)

**src/controllers/**: Request handlers
- `authController.js`: Login, register, logout
- `resumeController.js`: Resume upload, parsing
- `atsController.js`: ATS analysis
- `roadmapController.js`: Roadmap generation
- `interviewController.js`: Interview questions
- `reportController.js`: Report generation
- `adminController.js`: Admin operations

**src/routes/**: Route definitions
- Express route definitions for each controller
- Middleware application
- Route grouping

**src/middleware/**: Custom middleware
- `authMiddleware.js`: JWT verification
- `adminMiddleware.js`: Admin role check
- `uploadMiddleware.js`: Multer configuration
- `errorMiddleware.js`: Global error handler
- `validationMiddleware.js`: Input validation
- `rateLimitMiddleware.js`: API rate limiting

**src/services/**: Business logic
- `resumeParser.js`: PDF parsing logic
- `embeddingService.js`: Text embedding
- `geminiService.js`: Gemini API calls
- `atsService.js`: ATS scoring
- `roadmapService.js`: Roadmap generation
- `interviewService.js`: Question generation
- `reportService.js`: PDF generation
- `placementService.js`: Placement scoring

**src/ai-agent/**: LangChain.js agent
- `agent.js`: Main agent coordinator
- `planner.js`: Task planning
- `executor.js`: Task execution
- `toolSelector.js`: Tool selection logic
- `promptBuilder.js`: Prompt engineering
- `ragRetriever.js`: RAG context retrieval
- `geminiTool.js`: Gemini API tool
- `resumeTool.js`: Resume processing tool
- `memory.js`: Agent memory management
- `reportGenerator.js`: Report generation

**src/vector/**: Vector database operations
- `chromaClient.js`: ChromaDB client
- `embeddings.js`: Embedding generation
- `ingestDocuments.js`: Document ingestion
- `queryDocuments.js`: Document querying

**src/models/**: Mongoose models
- MongoDB schema definitions
- Model methods
- Virtual fields

**src/utils/**: Utility functions
- `passwordUtils.js`: Password hashing
- `tokenUtils.js`: Token operations
- `fileUtils.js`: File operations
- `validationUtils.js`: Data validation
- `errorHandlers.js`: Error handling

**src/uploads/**: Uploaded files
- `resumes/`: Uploaded PDF resumes

**src/reports/**: Generated reports
- `generated/`: Generated PDF reports

**src/career-data/**: RAG knowledge base
- Markdown documents for ChromaDB ingestion
- Roadmaps, interview questions, ATS guides, etc.

**server.js**: Application entry point
- Express app initialization
- Middleware setup
- Route registration
- Server startup

---

<a name="section-17"></a>
# SECTION 17: AI AGENT STRUCTURE

## 17.1 LangChain.js AI Agent Architecture

```
ai-agent/
│
├── agent.js              # Main agent coordinator
├── planner.js            # Task planning and decomposition
├── executor.js           # Task execution engine
├── toolSelector.js       # Dynamic tool selection
├── promptBuilder.js      # Prompt engineering
├── ragRetriever.js       # RAG context retrieval
├── geminiTool.js         # Gemini API integration
├── resumeTool.js         # Resume processing tool
├── memory.js             # Agent memory management
├── reportGenerator.js    # Report generation
└── index.js
```

## 17.2 File Communication Flow

```
┌──────────────┐
│  agent.js    │ ← Main entry point
└──────┬───────┘
       │
       ├──────────────────────────────────────┐
       │                                      │
       ▼                                      ▼
┌──────────────┐                      ┌──────────────┐
│  planner.js  │                      │  memory.js   │
│  - Plan tasks│                      │  - Load state│
└──────┬───────┘                      └──────┬───────┘
       │                                      │
       ▼                                      │
┌──────────────┐                              │
│toolSelector.js│                              │
│  - Select tool│                              │
└──────┬───────┘                              │
       │                                      │
       ▼                                      │
┌──────────────┐                              │
│ executor.js  │──────────────────────────────┤
│  - Execute   │                              │
└──────┬───────┘                              │
       │                                      │
       ├──────────┬──────────┬───────────────┤
       │          │          │               │
       ▼          ▼          ▼               │
┌──────────┐ ┌──────────┐ ┌──────────┐      │
│geminiTool│ │resumeTool│ │ragRetriev│      │
└──────┬───┘ └──────┬───┘ └──────┬───┘      │
       │             │             │         │
       └─────────────┴─────────────┘         │
                     │                       │
                     ▼                       │
            ┌──────────────┐                 │
            │promptBuilder │                 │
            └──────┬───────┘                 │
                   │                         │
                   ▼                         │
            ┌──────────────┐                 │
            │reportGenerator│                 │
            └──────┬───────┘                 │
                   │                         │
                   └─────────────────────────┘
```

## 17.3 File Descriptions

### agent.js
**Purpose**: Main agent coordinator
**Responsibilities**:
- Initialize agent with user context
- Coordinate between planner, executor, and tools
- Manage agent lifecycle
- Handle agent state transitions
- Return final results

**Key Functions**:
```javascript
class CareerAgent {
  constructor(userId, config)
  async initialize()
  async process(request)
  async shutdown()
}
```

### planner.js
**Purpose**: Task planning and decomposition
**Responsibilities**:
- Analyze user request
- Break down into subtasks
- Create task dependencies
- Prioritize tasks
- Generate execution plan

**Key Functions**:
```javascript
class Planner {
  plan(request, context)
  prioritize(tasks)
  validatePlan(plan)
}
```

### executor.js
**Purpose**: Task execution engine
**Responsibilities**:
- Execute tasks in order
- Handle tool calls
- Manage task dependencies
- Handle errors and retries
- Track execution progress

**Key Functions**:
```javascript
class Executor {
  async execute(task, context)
  async executeWithRetry(task, maxRetries)
  handleDependency(task, results)
}
```

### toolSelector.js
**Purpose**: Dynamic tool selection
**Responsibilities**:
- Map tasks to tools
- Select appropriate tool for task
- Handle tool availability
- Manage tool registry

**Key Functions**:
```javascript
class ToolSelector {
  selectTool(task)
  registerTool(name, tool)
  getTool(name)
}
```

### promptBuilder.js
**Purpose**: Prompt engineering
**Responsibilities**:
- Build system prompts
- Incorporate RAG context
- Apply few-shot examples
- Enforce JSON structure
- Validate prompts

**Key Functions**:
```javascript
class PromptBuilder {
  buildSystemPrompt(task, context)
  buildUserPrompt(task, data)
  addFewShotExamples(prompt, examples)
  validatePrompt(prompt)
}
```

### ragRetriever.js
**Purpose**: RAG context retrieval
**Responsibilities**:
- Query ChromaDB
- Retrieve relevant documents
- Rank results by similarity
- Format context for prompts

**Key Functions**:
```javascript
class RAGRetriever {
  async retrieve(query, topK)
  async generateEmbedding(text)
  formatContext(results)
}
```

### geminiTool.js
**Purpose**: Gemini API integration
**Responsibilities**:
- Call Gemini API
- Handle API responses
- Parse JSON responses
- Handle rate limiting
- Retry failed requests

**Key Functions**:
```javascript
class GeminiTool {
  async execute(task, context)
  async callAPI(prompt)
  parseResponse(response)
  handleRateLimit()
}
```

### resumeTool.js
**Purpose**: Resume processing tool
**Responsibilities**:
- Parse PDF resumes
- Extract structured data
- Validate resume format
- Extract skills, experience, education

**Key Functions**:
```javascript
class ResumeTool {
  async execute(task, context)
  parsePDF(filePath)
  extractSkills(text)
  extractExperience(text)
  extractEducation(text)
}
```

### memory.js
**Purpose**: Agent memory management
**Responsibilities**:
- Store conversation history
- Cache intermediate results
- Maintain agent context
- Persist to MongoDB
- Retrieve past context

**Key Functions**:
```javascript
class Memory {
  constructor(userId)
  loadUserContext()
  store(key, value)
  retrieve(key)
  persist()
  clear()
}
```

### reportGenerator.js
**Purpose**: Report generation
**Responsibilities**:
- Structure final response
- Format data for MongoDB
- Trigger PDF generation
- Compile analysis results
- Generate recommendations

**Key Functions**:
```javascript
class ReportGenerator {
  async generate(results)
  structureData(results)
  generatePDF(analysis)
  saveToDatabase(report)
}
```

---

<a name="section-18"></a>
# SECTION 18: REST APIs

## 18.1 Complete REST API List

### Authentication APIs

| Endpoint | Method | Request Body | Response | Error Handling |
|----------|--------|--------------|-----------|----------------|
| `/api/auth/register` | POST | `{email, password, firstName, lastName, role}` | `{token, user}` | 400: Invalid input, 409: Email exists |
| `/api/auth/login` | POST | `{email, password}` | `{token, user}` | 401: Invalid credentials, 403: Account inactive |
| `/api/auth/logout` | POST | `{}` | `{message}` | 401: Invalid token |
| `/api/auth/refresh` | POST | `{refreshToken}` | `{token}` | 401: Invalid refresh token |
| `/api/auth/forgot-password` | POST | `{email}` | `{message}` | 404: Email not found |
| `/api/auth/reset-password` | POST | `{token, newPassword}` | `{message}` | 400: Invalid token |
| `/api/auth/verify-email` | POST | `{token}` | `{message}` | 400: Invalid token |

### Resume APIs

| Endpoint | Method | Request Body | Response | Error Handling |
|----------|--------|--------------|-----------|----------------|
| `/api/resume/upload` | POST | `FormData: resume file` | `{resumeId, fileName, parsedContent}` | 400: Invalid file, 413: File too large |
| `/api/resume/:id` | GET | `{}` | `{resume}` | 404: Resume not found |
| `/api/resume/:id` | PUT | `{updates}` | `{resume}` | 404: Resume not found |
| `/api/resume/:id` | DELETE | `{}` | `{message}` | 404: Resume not found |
| `/api/resume/user/:userId` | GET | `{}` | `{resumes[]}` | 404: User not found |
| `/api/resume/:id/set-current` | PUT | `{}` | `{resume}` | 404: Resume not found |

### Analysis APIs

| Endpoint | Method | Request Body | Response | Error Handling |
|----------|--------|--------------|-----------|----------------|
| `/api/analysis/ats` | POST | `{resumeId, targetRole}` | `{analysisId, atsScore}` | 400: Invalid input, 404: Resume not found |
| `/api/analysis/skill-gap` | POST | `{resumeId, targetRole}` | `{analysisId, skillGap}` | 400: Invalid input |
| `/api/analysis/roadmap` | POST | `{userId, targetRole, timeline}` | `{roadmapId, roadmap}` | 400: Invalid input |
| `/api/analysis/placement-score` | POST | `{analysisId}` | `{placementScore}` | 404: Analysis not found |
| `/api/analysis/:id` | GET | `{}` | `{analysis}` | 404: Analysis not found |
| `/api/analysis/user/:userId` | GET | `{}` | `{analyses[]}` | 404: User not found |
| `/api/analysis/comprehensive` | POST | `{resumeId, targetRole}` | `{analysisId, results}` | 400: Invalid input |

### Interview APIs

| Endpoint | Method | Request Body | Response | Error Handling |
|----------|--------|--------------|-----------|----------------|
| `/api/interview/generate` | POST | `{targetRole, company, difficulty}` | `{questions}` | 400: Invalid input |
| `/api/interview/:id` | GET | `{}` | `{questions}` | 404: Not found |
| `/api/interview/save` | POST | `{questions, userId}` | `{questionId}` | 400: Invalid input |
| `/api/interview/user/:userId` | GET | `{}` | `{questions[]}` | 404: User not found |

### Report APIs

| Endpoint | Method | Request Body | Response | Error Handling |
|----------|--------|--------------|-----------|----------------|
| `/api/report/generate` | POST | `{analysisId, reportType}` | `{reportId, fileUrl}` | 400: Invalid input, 404: Analysis not found |
| `/api/report/:id` | GET | `{}` | `{report}` | 404: Report not found |
| `/api/report/:id/download` | GET | `{}` | `File stream` | 404: Report not found |
| `/api/report/user/:userId` | GET | `{}` | `{reports[]}` | 404: User not found |

### Admin APIs

| Endpoint | Method | Request Body | Response | Error Handling |
|----------|--------|--------------|-----------|----------------|
| `/api/admin/users` | GET | `{page, limit, search}` | `{users, total, pages}` | 403: Not admin |
| `/api/admin/users/:id` | GET | `{}` | `{user, resumes, analyses}` | 403: Not admin, 404: User not found |
| `/api/admin/users/:id` | PUT | `{updates}` | `{user}` | 403: Not admin, 404: User not found |
| `/api/admin/users/:id` | DELETE | `{}` | `{message}` | 403: Not admin, 404: User not found |
| `/api/admin/users/:id/toggle` | PUT | `{}` | `{isActive}` | 403: Not admin |
| `/api/admin/roles` | GET | `{}` | `{roles[]}` | 403: Not admin |
| `/api/admin/roles` | POST | `{roleData}` | `{role}` | 403: Not admin, 400: Invalid input |
| `/api/admin/roles/:id` | PUT | `{updates}` | `{role}` | 403: Not admin, 404: Role not found |
| `/api/admin/roles/:id` | DELETE | `{}` | `{message}` | 403: Not admin |
| `/api/admin/analytics` | GET | `{startDate, endDate}` | `{analytics}` | 403: Not admin |
| `/api/admin/reports` | GET | `{page, limit, userId}` | `{reports[]}` | 403: Not admin |
| `/api/admin/health` | GET | `{}` | `{systemHealth}` | 403: Not admin |

### Dashboard APIs

| Endpoint | Method | Request Body | Response | Error Handling |
|----------|--------|--------------|-----------|----------------|
| `/api/dashboard/stats` | GET | `{}` | `{stats}` | 401: Not authenticated |
| `/api/dashboard/analyses` | GET | `{}` | `{analyses[]}` | 401: Not authenticated |
| `/api/dashboard/recent-activity` | GET | `{}` | `{activities[]}` | 401: Not authenticated |

### User APIs

| Endpoint | Method | Request Body | Response | Error Handling |
|----------|--------|--------------|-----------|----------------|
| `/api/user/profile` | GET | `{}` | `{user}` | 401: Not authenticated |
| `/api/user/profile` | PUT | `{updates}` | `{user}` | 401: Not authenticated, 400: Invalid input |
| `/api/user/password` | PUT | `{currentPassword, newPassword}` | `{message}` | 401: Not authenticated, 400: Invalid password |
| `/api/user/settings` | GET | `{}` | `{settings}` | 401: Not authenticated |
| `/api/user/settings` | PUT | `{settings}` | `{settings}` | 401: Not authenticated |

## 18.2 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "itemsPerPage": 10
    }
  }
}
```

## 18.3 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 413 | Payload Too Large | File too large |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service down |
