import api from './api'

export const reportService = {
  generateReport: async (data) => {
    const response = await api.post('/report', data)
    return response.data.data || response.data
  },

  getUserReports: async (params) => {
    const response = await api.get('/report', { params })
    return response.data.data || response.data
  },

  downloadReport: async (id) => {
    const response = await api.get(`/report/${id}/download`, {
      responseType: 'blob'
    })
    return response.data
  }
}
