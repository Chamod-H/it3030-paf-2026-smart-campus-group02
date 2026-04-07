import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import P_login from './pages/P_login/P_login'
import P_register from './pages/P_register/P_register'
import I_FacilitiesCatalogue from './pages/I_FacilitiesCatalogue/i_FacilitiesCatalogue'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<P_login />} />
          <Route path='/register' element={<P_register />} />
          <Route path='/facilities' element={<I_FacilitiesCatalogue />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
