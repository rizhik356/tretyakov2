import type { AxiosError } from 'axios'
import errorNotification from './errorNotification.ts'

const parseError = async (err: AxiosError) => {
  if (err?.response?.data instanceof Blob) {
    const text = await err.response.data.text()
    if (err.response.data.type === 'application/json') {
      const error = JSON.parse(text)
      errorNotification(error.message)
      return
    }
  }
  errorNotification('Ошибка загрузки данных')
}

export default parseError
