import axios from 'axios'

const {
  REACT_APP_API_HOST,
  REACT_APP_API_ROUTE,
} = process.env

const client = axios.create({
  baseURL: `${REACT_APP_API_HOST}/${REACT_APP_API_ROUTE}`,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.response.use(response => {
  const {data} = response

  return data
}, error => Promise.reject(error))

export default client
