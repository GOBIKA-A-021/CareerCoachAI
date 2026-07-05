import api from './api'

export const interviewService = {
  generateQuestions: async (data) => {
    const response = await api.post('/interview', data)
    return response.data
  },

  getUserQuestions: async () => {
    const response = await api.get('/interview')
    return response.data
  },

  getQuestions: async (id) => {
    const response = await api.get(`/interview/${id}`)
    return response.data
  }
}
