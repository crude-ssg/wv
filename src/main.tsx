import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { GenVideoPage } from '@/pages/gen-video'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename='/video-gen'>
      <Routes>
        <Route path='/' element={<GenVideoPage />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
