import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import P_LoginPage from './pages/P_login/P_LoginPage'
import P_OAuthCallbackPage from './pages/P_login/P_OAuthCallbackPage'
import P_UnauthorizedPage from './pages/P_login/P_UnauthorizedPage'
import P_ProfileSetupPage from './pages/P_register/P_ProfileSetupPage'
import P_NotificationsPage from './pages/P_notifications/P_NotificationsPage'
import P_AdminRoleManagementPage from './pages/P_admin/P_AdminRoleManagementPage'
import P_AdminUsersPage from './pages/P_admin/P_AdminUsersPage'
import P_AdminNotificationsPage from './pages/P_admin/P_AdminNotificationsPage'
import P_AdminRouteGuard from './components/P_auth_notify/P_AdminRouteGuard'
import P_UserRouteGuard from './components/P_auth_notify/P_UserRouteGuard'
import Shared_Navbar from './components/common/Shared_Navbar'
import Shared_Sidebar from './components/common/Shared_Sidebar'
import Shared_Footer from './components/common/Shared_Footer'
import './AppLayout.css'

// Shared Pages
import Shared_HomePage from './pages/sharedPages/Shared_HomePage'
import Shared_DashboardPage from './pages/sharedPages/Shared_DashboardPage'
import Shared_ProfilePage from './pages/sharedPages/Shared_ProfilePage'
import Shared_SettingsPage from './pages/sharedPages/Shared_SettingsPage'
import Shared_HelpPage from './pages/sharedPages/Shared_HelpPage'
import Shared_NotFoundPage from './pages/sharedPages/Shared_NotFoundPage'

// Module A Imports
import I_AllResourcesPage from './pages/I_FacilitiesCatalogue/I_AllResourcesPage'
import I_ResourceDetailsPage from './pages/I_FacilitiesCatalogue/I_ResourceDetailsPage'
import I_AddResourcePage from './pages/I_FacilitiesCatalogue/I_AddResourcePage'
import I_EditResourcePage from './pages/I_FacilitiesCatalogue/I_EditResourcePage'
import I_AdminResourcesPage from './pages/I_FacilitiesCatalogue/I_AdminResourcesPage'
import I_ResourceAvailabilityPage from './pages/I_FacilitiesCatalogue/I_ResourceAvailabilityPage'

// Module B - Bookings
import T_CreateBookingPage from './pages/T_Booking/T_CreateBookingPage'
import T_MyBookingsPage from './pages/T_Booking/T_MyBookingsPage'
import T_BookingDetailsPage from './pages/T_Booking/T_BookingDetailsPage'
import T_AdminBookingsPage from './pages/T_Booking/T_AdminBookingsPage'
import T_ApproveBookingsPage from './pages/T_Booking/T_ApproveBookingsPage'
import T_BookingCalendarPage from './pages/T_Booking/T_BookingCalendarPage'
import T_CreateEquipmentBookingPage from './pages/T_Booking/T_CreateEquipmentBookingPage'

// Module C - Ticketing
import C_TicketHomePage from './pages/C_Ticketing/C_TicketHomePage'
import C_CreateTicketPage from './pages/C_Ticketing/C_CreateTicketPage'
import C_MyTicketsPage from './pages/C_Ticketing/C_MyTicketsPage'
import C_TicketDetailsPage from './pages/C_Ticketing/C_TicketDetailsPage'
import C_AdminTicketsPage from './pages/C_Ticketing/C_AdminTicketsPage'
import C_TechnicianTicketsPage from './pages/C_Ticketing/C_TechnicianTicketsPage'
import C_TicketAnalyticsPage from './pages/C_Ticketing/C_TicketAnalyticsPage'
const App = () => {
  return (
    <div className="app-layout-wrapper">
      <Router>
        <Shared_Navbar />
        <div className="app-main-container">
          <Shared_Sidebar />
          <main className="app-content-area" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path='/' element={<Shared_HomePage />} />
                <Route
                  path='/dashboard'
                  element={
                    <P_UserRouteGuard>
                      <Shared_DashboardPage />
                    </P_UserRouteGuard>
                  }
                />
                <Route
                  path='/profile'
                  element={
                    <P_UserRouteGuard>
                      <Shared_ProfilePage />
                    </P_UserRouteGuard>
                  }
                />
                <Route
                  path='/settings'
                  element={
                    <P_UserRouteGuard>
                      <Shared_SettingsPage />
                    </P_UserRouteGuard>
                  }
                />
                <Route
                  path='/help'
                  element={
                    <Shared_HelpPage />
                  }
                />

                <Route path='/login' element={<P_LoginPage />} />
                <Route path='/auth/callback' element={<P_OAuthCallbackPage />} />
                <Route path='/unauthorized' element={<P_UnauthorizedPage />} />
                <Route path='/profile/setup' element={<P_ProfileSetupPage />} />
                <Route path='/notifications' element={<P_NotificationsPage />} />
                <Route
                  path='/admin/roles'
                  element={
                    <P_AdminRouteGuard>
                      <P_AdminRoleManagementPage />
                    </P_AdminRouteGuard>
                  }
                />
                <Route
                  path='/admin/users'
                  element={
                    <P_AdminRouteGuard>
                      <P_AdminUsersPage />
                    </P_AdminRouteGuard>
                  }
                />
                <Route
                  path='/admin/notifications'
                  element={
                    <P_AdminRouteGuard>
                      <P_AdminNotificationsPage />
                    </P_AdminRouteGuard>
                  }
                />

                {/* Module A - Facilities Routes */}
                <Route path='/admin/facilities' element={<I_AdminResourcesPage />} />
                <Route path='/facilities/admin/new' element={<I_AddResourcePage />} />
                <Route path='/facilities/admin/edit/:id' element={<I_EditResourcePage />} />
                <Route path='/facilities/all' element={<I_AllResourcesPage />} />
                <Route path='/facilities/availability' element={<I_ResourceAvailabilityPage />} />
                <Route path='/facilities/:id' element={<I_ResourceDetailsPage />} />

                {/* Module B - Bookings Routes */}
                <Route 
                  path='/admin/bookings' 
                  element={
                    <P_AdminRouteGuard>
                      <T_AdminBookingsPage />
                    </P_AdminRouteGuard>
                  } 
                />
                <Route path='/bookings/calendar' element={<T_BookingCalendarPage />} />
                <Route path='/bookings/new' element={<T_CreateBookingPage />} />
                <Route path='/bookings/equipment' element={<T_CreateEquipmentBookingPage />} />
                <Route path='/bookings/my' element={<T_MyBookingsPage />} />
                <Route path='/bookings/admin/approve' element={<T_ApproveBookingsPage />} />
                <Route path='/bookings/:id' element={<T_BookingDetailsPage />} />

                {/* Module C - Ticketing Routes */}
                <Route path='/tickets' element={<C_TicketHomePage />} />
                <Route path='/tickets/new' element={<C_CreateTicketPage />} />
                <Route path='/tickets/my' element={<C_MyTicketsPage />} />
                <Route path='/tickets/queue' element={<C_TechnicianTicketsPage />} />
                <Route path='/tickets/analytics' element={<C_TicketAnalyticsPage />} />
                <Route path='/admin/tickets' element={<C_AdminTicketsPage />} />
                <Route path='/tickets/:id' element={<C_TicketDetailsPage />} />

                {/* Catch-All 404 Route */}
                <Route path='*' element={<Shared_NotFoundPage />} />
              </Routes>
            </div>
            <Shared_Footer />
          </main>
        </div>
      </Router>
    </div>
  )
}

export default App
