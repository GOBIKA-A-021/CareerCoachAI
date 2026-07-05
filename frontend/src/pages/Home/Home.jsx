import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Target, TrendingUp, Zap } from 'lucide-react'
import Button from '../../components/Button/Button'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="w-8 h-8" />
              <span className="text-xl font-semibold">AI-Powered Career Intelligence</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Career with AI
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Upload your resume and get instant ATS analysis, skill gap assessment, 
              career roadmaps, and interview preparation powered by advanced AI.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link to="/register">
                <Button size="lg" className="bg-primary-600 text-white hover:bg-primary-700">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ATS Analysis</h3>
              <p className="text-gray-600">
                Get detailed ATS score analysis with keyword matching, 
                format compliance, and actionable improvement suggestions.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Skill Gap Analysis</h3>
              <p className="text-gray-600">
                Identify missing skills, get learning resources, and 
                receive personalized skill development roadmaps.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interview Prep</h3>
              <p className="text-gray-600">
                Practice with AI-generated interview questions tailored to 
                your target role and company.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="page-container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
                  <p className="text-gray-600">
                    Simply upload your PDF resume. Our AI will parse and analyze it automatically.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                  <p className="text-gray-600">
                    Our AI performs comprehensive ATS analysis, skill gap assessment, 
                    and placement score calculation.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Get Insights & Improve</h3>
                  <p className="text-gray-600">
                    Receive detailed reports, career roadmaps, and interview questions 
                    to help you land your dream job.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="page-container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Career?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of professionals who have improved their resumes with AI.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="page-container text-center">
          <p>&copy; 2024 CareerCoach AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
