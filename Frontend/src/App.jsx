import React from 'react'
import P_login from './pages/P_login/P_login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<P_login />} />
      </Routes>
    </Router>
  )
}

export default App
