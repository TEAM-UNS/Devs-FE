import axios from 'axios'

/** 없거나 남의 대화라 서버가 404를 줬는지 */
export function isNotFound(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404
}
