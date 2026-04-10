import React from 'react';
import Shared_PageHeader from '../../components/common/Shared_PageHeader';

const P_AdminNotificationsPage = () => {
  return (
    <div className="admin-page-container">
      <Shared_PageHeader 
        title="Broadcast Management"
        subtitle="Push global alerts and bell-notifications to cross-sectioned user tiers."
      />
      <div className="content-panel">
        <p>Global Notification transmission forms and past-history table will render here.</p>
      </div>
    </div>
  );
};

export default P_AdminNotificationsPage;
