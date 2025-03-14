import React from 'react'
import Navabar from './components/Navabar'
import AuthPage from './components/auth/auth'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './components/home';
const App = () => {
  return (
    <div>
        <Navabar />
        <Router>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={< HomePage/>} />
          </Routes>
        </Router>
    </div>
  )
}

export default App