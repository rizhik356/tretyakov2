import { useEffect } from 'react'
import getImage from '../api/getImage.ts'
import { useLocation } from 'react-router-dom'
import parseError from '../helpers/parseError.ts'
import { ToastContainer } from 'react-toastify'

const DownloadPage = () => {
  const location = useLocation()
  useEffect(() => {
    const id = location.pathname.split('/').pop()
    if (id) {
      getImage(id, true).catch((err) => parseError(err))
    }
  })
  return (
    <div className={'download_container'}>
      <h1>Спасибо за посещение стенда</h1>
      <ToastContainer />
    </div>
  )
}

export default DownloadPage
