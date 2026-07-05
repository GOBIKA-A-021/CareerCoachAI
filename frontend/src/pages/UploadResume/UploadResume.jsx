import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, CheckCircle, Target, Briefcase, Info } from 'lucide-react'
import { resumeService } from '../../services/resumeService'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import toast from 'react-hot-toast'

const UploadResume = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [targetRole, setTargetRole] = useState('Java Developer')
  const [targetCompany, setTargetCompany] = useState('Google')

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  const handleRemoveFile = () => {
    setFile(null)
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Start simulating progress bar
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 150)

      const response = await resumeService.uploadResume(file, targetRole, targetCompany)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      toast.success('Resume parsing & AI Coach initialized!')
      
      setTimeout(() => {
        navigate('/resume-analysis', { state: { resumeId: response.resumeId || response.data?.resumeId } })
      }, 600)
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Upload & Analysis failed')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="page-container max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Upload Resume</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Upload your resume in PDF or DOCX format to trigger our AI Resume intelligence parser
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Form Settings */}
        <div className="md:col-span-1 space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center">
              <Target className="w-4 h-4 text-blue-500 mr-2" />
              Target Goal
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Career Goal</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Java Developer">Java Developer</option>
                  <option value="Python Developer">Python Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="AI Engineer">AI Engineer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Data Scientist">Data Scientist</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Target Company</label>
                <select
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Google">Google</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Infosys">Infosys</option>
                  <option value="TCS">TCS</option>
                  <option value="Microsoft">Microsoft</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-50/50 dark:bg-slate-800 border-blue-100 dark:border-slate-700">
            <div className="flex items-start space-x-2 text-xs text-blue-800 dark:text-blue-300">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Need DOCX Parser?</p>
                <p className="mt-1 leading-normal">Our backend parser automatically converts PDF & DOCX texts to feed the vector search contexts.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Dropzone area */}
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col justify-between">
            {!file ? (
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors flex-1 flex flex-col items-center justify-center
                  ${isDragActive ? 'border-blue-500 bg-blue-50/50 dark:bg-slate-700/50' : 'border-slate-300 hover:border-blue-400 dark:border-slate-600'}
                `}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-base font-bold mb-1 text-slate-850 dark:text-white">
                  {isDragActive ? 'Drop your resume file' : 'Drag & drop your resume file'}
                </p>
                <p className="text-xs text-slate-400">or click to browse files</p>
                <p className="text-[10px] text-slate-400 mt-6">
                  Supported formats: PDF, DOCX (Max 5MB)
                </p>
              </div>
            ) : (
              <div className="space-y-6 flex-1 flex flex-col justify-between p-2">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800 dark:text-white truncate max-w-[200px] sm:max-w-sm">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {uploading && (
                  <div className="animate-in fade-in">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Uploading & Analyzing...</span>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  loading={uploading}
                  disabled={uploading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-md mt-6"
                >
                  {uploading ? 'Processing AI Models...' : 'Start AI Career Analysis'}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default UploadResume
