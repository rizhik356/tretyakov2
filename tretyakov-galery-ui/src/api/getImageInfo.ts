import axios from 'axios'

const getImageInfo = async (id: string) => {
  const response = await axios.get(`http://localhost:9000/images/info/${id}`)

  return response.data
}

export default getImageInfo
