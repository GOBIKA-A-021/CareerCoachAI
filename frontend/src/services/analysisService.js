import api from './api'

export const analysisService = {
  performATSAnalysis: async (data) => {
    const response = await api.post('/analysis/ats', data)
    return response.data.data || response.data
  },

  performSkillGapAnalysis: async (data) => {
    const response = await api.post('/analysis/skill-gap', data)
    return response.data.data || response.data
  },

  calculatePlacementScore: async (data) => {
    const response = await api.post('/analysis/placement-score', data)
    return response.data.data || response.data
  },

  performComprehensiveAnalysis: async (data) => {
    const response = await api.post('/analysis/comprehensive', data)
    return response.data.data || response.data
  },

  getAnalysis: async (id) => {
    const response = await api.get(`/analysis/${id}`)
    return response.data.data || response.data
  },

  getUserAnalyses: async () => {
    const response = await api.get('/analysis')
    return response.data.data || response.data
  }
}
