import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import Loader from '../../components/Loader/Loader'
import { User, Mail, MapPin, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    targetRole: '',
    targetCompanies: '',
    skills: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        targetRole: user.targetRole || '',
        targetCompanies: user.targetCompanies?.join(', ') || '',
        skills: user.skills?.join(', ') || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const updateData = {
        ...formData,
        targetCompanies: formData.targetCompanies.split(',').map(c => c.trim()).filter(c => c),
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      }

      const response = await authService.updateProfile(updateData)
      updateUser(response.data.user)
      setEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-2">Profile</h1>
      <p className="text-gray-600 mb-8">
        Manage your profile information
      </p>

      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <Button onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {editing ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Target Role"
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              placeholder="e.g., Full Stack Developer"
            />

            <Input
              label="Target Companies (comma-separated)"
              name="targetCompanies"
              value={formData.targetCompanies}
              onChange={handleChange}
              placeholder="e.g., Google, Amazon, Microsoft"
            />

            <Input
              label="Skills (comma-separated)"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Node.js"
            />

            <Button onClick={handleSave} loading={loading}>
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Email</span>
                </div>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Target Role</span>
                </div>
                <p className="font-medium">{user?.targetRole || 'Not set'}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Target Companies</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user?.targetCompanies?.length > 0 ? (
                  user.targetCompanies.map((company, index) => (
                    <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                      {company}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600">Not set</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-600">Skills</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user?.skills?.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600">No skills added</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default Profile
