import React from 'react'
import Navabar from './components/Navabar'
import AuthPage from './components/auth/auth'
import ForgotPassword from './components/auth/forgotPassword'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './components/home';
import '@mantine/core/styles.css';

const App = () => {
  return (
    <div className='app'>
        <Router>
        <Navabar />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={< HomePage/>} />
            <Route path="/forgot-password" element={< ForgotPassword/>} />
          </Routes>
        </Router>
    </div>
  )
}

export default App