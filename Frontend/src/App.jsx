import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import P_login from './pages/P_login/P_login'
import P_register from './pages/P_register/P_register'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<P_login />} />
          <Route path='/register' element={<P_register />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
