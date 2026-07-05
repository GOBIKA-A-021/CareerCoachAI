import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import { Lock, Bell, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await authService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      toast.success('Password updated successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error('Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-gray-600 mb-8">
        Manage your account settings
      </p>

      <div className="space-y-6">
        {/* Password Settings */}
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold">Change Password</h2>
          </div>
          <div className="space-y-4">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password (min 8 characters)"
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
            />
            <Button onClick={handlePasswordUpdate} loading={loading}>
              Update Password
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analysis Complete</p>
                <p className="text-sm text-gray-600">Notify when analysis is complete</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <Button variant="secondary" size="sm">
                Enable
              </Button>
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Account Status</p>
                <p className="text-sm text-gray-600">
                  {user?.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Settings
