import api from './api'

export const roadmapService = {
  generateRoadmap: async (data) => {
    const response = await api.post('/roadmap', data)
    return response.data
  },

  getUserRoadmaps: async () => {
    const response = await api.get('/roadmap')
    return response.data
  },

  getRoadmap: async (id) => {
    const response = await api.get(`/roadmap/${id}`)
    return response.data
  },

  updateRoadmapProgress: async (id, data) => {
    const response = await api.put(`/roadmap/${id}/progress`, data)
    return response.data
  }
}
