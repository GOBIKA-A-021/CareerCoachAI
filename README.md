# AI Career Coach and Resume Intelligence Agent

A complete industry-level AI-powered career coaching platform that provides resume analysis, skill gap assessment, career roadmaps, and interview preparation using advanced AI technologies.

## 🚀 Features

- **ATS Analysis**: Comprehensive resume scoring with keyword matching, format compliance, and actionable recommendations
- **Skill Gap Analysis**: Identify missing skills with personalized learning resources and timelines
- **Career Roadmaps**: AI-generated learning paths tailored to your target role
- **Interview Preparation**: Role-specific interview questions with answers
- **Placement Score**: Calculate job placement readiness with weighted scoring
- **PDF Reports**: Generate detailed analysis reports in PDF format
- **Admin Dashboard**: User management and platform analytics

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **AI/ML**: Google Gemini API, LangChain.js
- **Vector DB**: ChromaDB (for RAG)
- **Authentication**: JWT
- **File Processing**: pdf-parse, PDFKit

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Components**: Lucide React icons
- **File Upload**: react-dropzone
- **Notifications**: react-hot-toast

### Deployment
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Cloud**: AWS EC2 (recommended)

## 📁 Project Structure

```
CareergoalAI-GS/
├── backend/
│   ├── src/
│   │   ├── ai-agent/          # LangChain.js AI Agent structure
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic services
│   │   ├── utils/             # Utility functions
│   │   ├── uploads/           # Resume upload directory
│   │   ├── reports/           # Generated reports directory
│   │   └── server.js          # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── store/             # State management
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── docs/                      # Project documentation
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API Key
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CareergoalAI-GS
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
   
   Update `.env` with your credentials:
   ```env
   MONGODB_URI=mongodb://localhost:27017/careercoach
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_jwt_secret
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:5000`
   - MongoDB: `localhost:27017`
   - ChromaDB: `localhost:8000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Resume
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume` - Get user resumes
- `GET /api/resume/:id` - Get resume by ID
- `DELETE /api/resume/:id` - Delete resume
- `PUT /api/resume/:id/set-current` - Set current resume

### Analysis
- `POST /api/analysis/ats` - Perform ATS analysis
- `POST /api/analysis/skill-gap` - Perform skill gap analysis
- `POST /api/analysis/placement-score` - Calculate placement score
- `POST /api/analysis/comprehensive` - Comprehensive analysis
- `GET /api/analysis/:id` - Get analysis by ID
- `GET /api/analysis` - Get user analyses

### Roadmap
- `POST /api/roadmap` - Generate career roadmap
- `GET /api/roadmap` - Get user roadmaps
- `GET /api/roadmap/:id` - Get roadmap by ID
- `PUT /api/roadmap/:id/progress` - Update roadmap progress

### Interview
- `POST /api/interview` - Generate interview questions
- `GET /api/interview` - Get user questions
- `GET /api/interview/:id` - Get questions by ID

### Reports
- `POST /api/report` - Generate report
- `GET /api/report` - Get user reports
- `GET /api/report/:id/download` - Download report

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/analytics` - Get platform analytics (admin only)

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Input validation
- SQL injection prevention (MongoDB injection prevention)
- XSS protection
- Helmet.js security headers

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (to be implemented)
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/careercoach
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
CHROMADB_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
REPORT_DIR=./reports
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

