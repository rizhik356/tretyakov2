import axios from 'axios'

const getImage = async (fileId: string, download: boolean = false) => {
  const deleteQuery = download ? `?delete=${download}` : ''
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/images/${fileId}${deleteQuery}`,
    {
      responseType: 'blob',
    },
  )
  // Создаем URL для скачивания
  const url = window.URL.createObjectURL(new Blob([response.data]))

  const contentDisposition = response.headers['content-disposition']
  const name =
    contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || 'image.png'

  if (!download) {
    const createdAt = response.headers['x-created-at']
    const expiresAt = response.headers['x-expires-at']

    return { createdAt, expiresAt, name, url }
  }

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', name)
  document.body.appendChild(link)
  link.click()

  link.remove()
  window.URL.revokeObjectURL(url)
}

export default getImage
