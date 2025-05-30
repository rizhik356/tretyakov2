import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainPage from './components/MainPage.tsx'
import PrivacyPage from './components/PrivacyPage.tsx'
import DownloadPage from './components/DownloadPage.tsx'

function App() {
  // const base = import.meta.env.BASE_URL

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/file" />} />
        <Route path={'/file/:id'} element={<MainPage />} />
        <Route path={'/file/download/:id'} element={<DownloadPage />} />
        <Route path={'/privacy'} element={<PrivacyPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
