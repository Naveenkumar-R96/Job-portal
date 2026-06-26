import API from './api';

export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  verifyEmail: (data) => API.post('/auth/verify-email', data),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  resetPassword: (data) => API.post('/auth/reset-password', data),
};

export const userService = {
  getProfile: () => API.get('/user/profile'),
  updateProfile: (formData) =>
    API.put('/user/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getResume: (userId) => `${API.defaults.baseURL}/user/resume/${userId}`,
};

export const jobService = {
  getAllJobs: (params) => API.get('/job', { params }),
  getJobById: (id) => API.get(`/job/${id}`),
};

export const applicationService = {
  applyJob: (jobId) => API.post(`/application/apply/${jobId}`),
  getUserApplications: () => API.get('/application/user'),
};

export const savedService = {
  getSavedItems: () => API.get('/saved'),
  toggleSaveJob: (jobId) => API.post(`/saved/job/${jobId}`),
  toggleSaveQuestion: (questionId, type) =>
    API.post(`/saved/question/${questionId}?type=${type}`),
};

export const interviewService = {
  getCompanies: () => API.get('/interview/companies'),
  getQuestionsByCompany: (companyId) => API.get(`/interview/company/${companyId}`),
  getRoles: () => API.get('/interview/roles'),
  getQuestionsByRole: (roleId) => API.get(`/interview/role/${roleId}`),
};

export const companyService = {
  getCompanies: () => API.get('/company'),
};

export const inquiryService = {
  submitInquiry: (data) => API.post('/inquiry', data),
};
