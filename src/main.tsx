import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { GenVideoPage } from '@/pages/gen-video'
import RequireAuth from './components/require-auth'

console.log(import.meta.env.BASE_URL)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename='/video-gen'>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path='/' element={<GenVideoPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
