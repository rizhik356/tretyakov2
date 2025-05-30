import Input from './Input.tsx'
import FileDescription from './FileDescription.tsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import getImage from '../api/getImage.ts'
import dayjs from 'dayjs'
import { ToastContainer } from 'react-toastify'
import parseError from '../helpers/parseError.ts'
import Loader from './Loader.tsx'

type ImgInfo = {
  createdAt: string
  expiresAt: string
  name: string
  url: string
}

const MainPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [id, setId] = useState<string | undefined>(undefined)
  const [href, setHref] = useState<string>('')
  const [downloadHref, setDownloadHref] = useState<string>('')
  const [imgInfo, setImgInfo] = useState<ImgInfo>({} as ImgInfo)
  const [loading, setLoading] = useState(true)

  const backgroundStyles = useMemo(() => {
    if (imgInfo.url) {
      return {
        backgroundImage: `url(${imgInfo.url})`,
      }
    }
    return {}
  }, [imgInfo])

  useEffect(() => {
    const id = location.pathname.split('/').pop()
    if (id) {
      const fullUrl = window.location.href

      console.log(window.location)

      getImage(id)
        .then((data) => {
          const { expiresAt, createdAt, ...rest } = data as ImgInfo
          const newImgInfo = {
            expiresAt: dayjs(expiresAt).format('DD.MM.YYYY'),
            createdAt: dayjs(createdAt).format('DD.MM.YYYY'),
            ...rest,
          }

          setImgInfo(newImgInfo)
          setHref(fullUrl)
          const downloadUrl = fullUrl.replace(id, '')
          setDownloadHref(`${downloadUrl}download/${id}`)
          setId(id)
        })
        .catch((err) => parseError(err))
        .finally(() => setLoading(false))
    }
  }, [])

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1>Ваш портрет</h1>
          <div className={'container'}>
            <div className={'img'} style={backgroundStyles}></div>
            <div className={'description_container'}>
              <div className={'descriptions'}>
                <FileDescription name={'Загружен:'} value={imgInfo.createdAt} />
                <FileDescription
                  name={'Действителен до:'}
                  value={imgInfo.expiresAt}
                />
              </div>
              <Input name={'Поделиться ссылкой:'} url={href} />
              <Input name={'Прямая ссылка на скачивание:'} url={downloadHref} />
              <button
                className={'btn'}
                onClick={() => navigate(`/file/download/${id}`)}
              >
                Скачать
              </button>
              <span
                className={'rules'}
                onClick={() => navigate('/privacy', { state: id })}
              >
                Перед использованием стенда, ознакомьтесь с правилами
              </span>
            </div>
          </div>
        </>
      )}
      <ToastContainer />
    </>
  )
}

export default MainPage
