import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/P_AuthContext';
import { useNotifications } from '../../contexts/P_NotificationContext';
import Shared_PageHeader from '../../components/common/Shared_PageHeader';
import { getMyTickets, getAllTickets, getTechnicianTickets } from '../../services/C_ticketService';
import P_roleService from '../../services/P_roleService';
import T_bookingService from '../../services/T_bookingService';
import I_resourceService from '../../services/I_resourceService';

// Sub-Dashboard Components
import AdminDashboard from './dashboards/AdminDashboard';
import LecturerDashboard from './dashboards/LecturerDashboard';
import StudentDashboard from './dashboards/StudentDashboard';
import StaffDashboard from './dashboards/StaffDashboard';

import './Shared_DashboardPage.css';

/**
 * Main Central Dashboard Controller
 * Evaluates the User's RBAC role and cleanly mounts the highly specialized Sandbox 
 * Sub-Dashboard while maintaining a shared Page Header.
 */
const Shared_DashboardPage = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [ticketCount, setTicketCount] = useState('...');
  const [myBookingCount, setMyBookingCount] = useState('...');
  const [techQueueCount, setTechQueueCount] = useState('...');
  
  const [globalMetrics, setGlobalMetrics] = useState({
    users: '...',
    pendingBookings: '...',
    facilities: '...',
    globalTickets: '...'
  });

  // We explicitly normalize the role so we can match it perfectly to the Sidebar mappings
  const userRole = (user?.role || 'student').toLowerCase().replace(' ', '_');
  const firstName = user?.name ? user.name.split(' ')[0] : 'Member';

  useEffect(() => {
    const fetchDynamicStats = async () => {
      try {
        const myActiveTickets = await getMyTickets();
        setTicketCount(myActiveTickets.length);

        const myActiveBookings = await T_bookingService.getMyBookings();
        setMyBookingCount(myActiveBookings.length);

        if (userRole === 'staff' || userRole === 'staff_member') {
          const myQueue = await getTechnicianTickets();
          setTechQueueCount(myQueue.length);
        }

        if (userRole === 'admin') {
          const [usersRes, bookingsRes, facilitiesRes, ticketsRes] = await Promise.all([
            P_roleService.getAllUsers(),
            T_bookingService.getPendingBookings(),
            I_resourceService.getAllResources(),
            getAllTickets()
          ]);

          setGlobalMetrics({
            users: usersRes?.length || 0,
            pendingBookings: bookingsRes?.length || 0,
            facilities: facilitiesRes?.length || 0,
            globalTickets: ticketsRes?.length || 0
          });
        }
      } catch (err) {
        console.error("Dashboard stats sync failed:", err);
      }
    };
    fetchDynamicStats();
  }, [userRole]);

  // Mock data representing module summaries combined with dynamic metrics
  const summaries = {
    bookings: userRole === 'admin' ? globalMetrics.pendingBookings : myBookingCount,
    tickets: userRole === 'admin' ? globalMetrics.globalTickets : ticketCount,
    facilities: globalMetrics.facilities,
    adminApprovals: globalMetrics.pendingBookings,
    techQueue: techQueueCount,
    users: globalMetrics.users
  };

  // Switch router pattern
  const renderRoleDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard user={user} unreadCount={unreadCount} summaries={summaries} />;
      case 'lecturer':
        return <LecturerDashboard user={user} unreadCount={unreadCount} summaries={summaries} />;
      case 'staff_member':
      case 'staff':
        return <StaffDashboard user={user} unreadCount={unreadCount} summaries={summaries} />;
      case 'student':
      default:
        return <StudentDashboard user={user} unreadCount={unreadCount} summaries={summaries} />;
    }
  };

  return (
    <div className="shared-dashboard-page">
      <Shared_PageHeader 
        title={`Welcome back, ${firstName}!`}
        subtitle="Here's what's happening around the campus today."
      />

      {/* Render the sandboxed role dashboard below the shared header */}
      <div className="dashboard-content-wrapper">
        {renderRoleDashboard()}
      </div>

    </div>
  );
};

export default Shared_DashboardPage;
