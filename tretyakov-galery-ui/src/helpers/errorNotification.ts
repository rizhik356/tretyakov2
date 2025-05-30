import { toast } from 'react-toastify'

const errorNotification = (message: string) => {
  toast.error(message)
}

export default errorNotification
