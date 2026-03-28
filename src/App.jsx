import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Thread from './pages/Thread'
import OAuthCallback from './pages/OAuthCallback'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/thread/:uri" element={<Thread />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Routes>
    </BrowserRouter>
  )
}
