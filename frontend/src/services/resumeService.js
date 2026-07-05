import api from './api'

export const resumeService = {
  uploadResume: async (file, targetRole, targetCompany) => {
    const formData = new FormData()
    formData.append('resume', file)
    if (targetRole) formData.append('targetRole', targetRole)
    if (targetCompany) formData.append('targetCompany', targetCompany)
    
    const response = await api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data || response.data
  },

  getUserResumes: async () => {
    const response = await api.get('/resume')
    return response.data.data || response.data
  },

  getResume: async (id) => {
    const response = await api.get(`/resume/${id}`)
    return response.data.data || response.data
  },

  deleteResume: async (id) => {
    const response = await api.delete(`/resume/${id}`)
    return response.data.data || response.data
  },

  setCurrentResume: async (id) => {
    const response = await api.put(`/resume/${id}/set-current`)
    return response.data.data || response.data
  }
}
