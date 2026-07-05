import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import Loader from '../../components/Loader/Loader'
import { Users, FileText, TrendingUp, Activity, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const Admin = () => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('analytics')
  const [analytics, setAnalytics] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied')
      return
    }
    loadAnalytics()
    loadUsers()
  }, [])

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setAnalytics(data.data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setUsers(data.data.users)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load users:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader text="Loading admin panel..." />
  }

  if (user?.role !== 'admin') {
    return (
      <div className="page-container text-center">
        <Shield className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600">You don't have permission to access this page</p>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Manage users and view platform analytics
      </p>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-4 px-4 font-medium ${
            activeTab === 'analytics'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-4 px-4 font-medium ${
            activeTab === 'users'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Users
        </button>
      </div>

      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-3xl font-bold">{analytics.users?.total || 0}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Users</p>
                  <p className="text-3xl font-bold">{analytics.users?.active || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Resumes</p>
                  <p className="text-3xl font-bold">{analytics.resumes?.total || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Analyses</p>
                  <p className="text-3xl font-bold">{analytics.analyses?.total || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Score Averages</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-2">Average ATS Score</p>
                <p className="text-2xl font-bold">{analytics.scores?.avgATS?.toFixed(1) || 0}/100</p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Average Placement Score</p>
                <p className="text-2xl font-bold">{analytics.scores?.avgPlacement?.toFixed(1) || 0}/100</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Admin
