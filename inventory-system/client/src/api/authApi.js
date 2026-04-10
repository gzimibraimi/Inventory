import httpClient from './httpClient'

export const loginUser = async ({ username, password }) => {
  const response = await httpClient.post('/api/auth/login', { username, password })
  return response.data
}

export const registerUser = async ({ username, password, fullName }) => {
  const response = await httpClient.post('/api/auth/register', {
    username,
    password,
    fullName
  })
  return response.data
}
