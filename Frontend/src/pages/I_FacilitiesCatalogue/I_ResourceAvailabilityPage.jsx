import React, { useState, useEffect } from 'react';
import './I_ResourceAvailabilityPage.css';
import I_ResourceAvailabilityBadge from '../../components/I_facilities/I_ResourceAvailabilityBadge';

// Simulating API fetch
const mockResourcesList = [
  { id: "res-001", name: "Main Auditorium", type: "Lecture hall" },
  { id: "res-002", name: "Advanced IT Lab", type: "Lab" },
  { id: "res-003", name: "Conference Room Alpha", type: "Meeting room" },
  { id: "res-004", name: "Chemistry Lab C", type: "Lab" },
];

const mockAvailabilityData = {
  "res-001": {
    status: "ACTIVE",
    windows: [
      { day: "Monday", slots: ["08:00 AM - 12:00 PM", "01:00 PM - 06:00 PM"] },
      { day: "Tuesday", slots: ["08:00 AM - 12:00 PM", "01:00 PM - 06:00 PM"] },
      { day: "Wednesday", slots: ["08:00 AM - 12:00 PM", "01:00 PM - 06:00 PM"] },
      { day: "Thursday", slots: ["08:00 AM - 12:00 PM", "01:00 PM - 06:00 PM"] },
      { day: "Friday", slots: ["08:00 AM - 04:00 PM"] }
    ],
    maintenanceNote: null
  },
  "res-002": {
    status: "ACTIVE",
    windows: [
      { day: "Monday", slots: ["07:00 AM - 10:00 PM"] },
      { day: "Tuesday", slots: ["07:00 AM - 10:00 PM"] },
      { day: "Wednesday", slots: ["07:00 AM - 10:00 PM"] },
      { day: "Thursday", slots: ["07:00 AM - 10:00 PM"] },
      { day: "Friday", slots: ["07:00 AM - 10:00 PM"] },
      { day: "Saturday", slots: ["09:00 AM - 05:00 PM"] }
    ],
    maintenanceNote: null
  },
  "res-003": {
    status: "ACTIVE",
    windows: [
      { day: "Monday", slots: ["09:00 AM - 05:00 PM"] },
      { day: "Tuesday", slots: ["09:00 AM - 05:00 PM"] },
      { day: "Wednesday", slots: ["09:00 AM - 05:00 PM"] },
      { day: "Thursday", slots: ["09:00 AM - 05:00 PM"] },
      { day: "Friday", slots: ["09:00 AM - 05:00 PM"] }
    ],
    maintenanceNote: null
  },
  "res-004": {
    status: "OUT_OF_SERVICE",
    windows: [],
    maintenanceNote: "Undergoing deep cleaning and ventilation repairs. Expected to reopen next Monday."
  }
};

const I_ResourceAvailabilityPage = () => {
  const [resources, setResources] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [availabilityDetails, setAvailabilityDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load dropdown resources
  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setResources(mockResourcesList);
      if (mockResourcesList.length > 0) {
        setSelectedId(mockResourcesList[0].id);
      }
      setLoading(false);
    };
    fetchDropdownData();
  }, []);

  // Fetch specific resource availability when dropdown changes
  useEffect(() => {
    if (!selectedId) return;

    const fetchAvailability = async () => {
      setAvailabilityDetails(null);
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = mockAvailabilityData[selectedId];
      if (data) {
        setAvailabilityDetails(data);
      }
    };
    
    fetchAvailability();
  }, [selectedId]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="resource-availability-page">
      <div className="rap-header">
        <h1>Availability Schedules</h1>
        <p>Check the daily operating hours, bookable windows, and maintenance status of campus facilities.</p>
      </div>

      <div className="rap-content">
        <aside className="rap-sidebar">
          <div className="rap-selector-card">
            <h3 className="rap-card-title">Select Facility</h3>
            <p className="rap-card-desc">Choose a resource to view its complete availability breakdown.</p>
            
            {loading ? (
              <div className="rap-loading-mini">Loading facilities...</div>
            ) : (
              <select 
                className="rap-select"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                <option value="" disabled>-- Select a Resource --</option>
                {resources.map(res => (
                  <option key={res.id} value={res.id}>
                    {res.name} ({res.type})
                  </option>
                ))}
              </select>
            )}
          </div>

          {availabilityDetails && (
            <div className="rap-status-card">
              <h3 className="rap-card-title">Current Status</h3>
              <div className="rap-status-display">
                <I_ResourceAvailabilityBadge 
                  availability={availabilityDetails.status === 'ACTIVE' ? 'AVAILABLE' : 'UNAVAILABLE'} 
                  status={availabilityDetails.status} 
                />
                <span className="rap-status-text">
                  {availabilityDetails.status.replace(/_/g, ' ')}
                </span>
              </div>
              
              {availabilityDetails.status === 'OUT_OF_SERVICE' && (
                <div className="rap-maintenance-alert">
                  <strong>⚠️ Maintenance Notice</strong>
                  <p>{availabilityDetails.maintenanceNote}</p>
                </div>
              )}
            </div>
          )}
        </aside>

        <main className="rap-main">
          <div className="rap-schedule-container">
            <h2 className="rap-schedule-title">Weekly Schedule</h2>
            
            {!availabilityDetails ? (
              <div className="rap-loading-large">
                <div className="rap-spinner"></div>
                <p>Loading schedule...</p>
              </div>
            ) : availabilityDetails.status === 'OUT_OF_SERVICE' ? (
              <div className="rap-unavailable-state">
                <div className="rap-unavailable-icon">🛑</div>
                <h3>No Bookings Available</h3>
                <p>This resource is currently blocked from all bookings due to maintenance or administrative lock.</p>
              </div>
            ) : (
              <div className="rap-week-grid">
                {daysOfWeek.map(day => {
                  const dayData = availabilityDetails.windows.find(w => w.day === day);
                  const isAvailable = dayData && dayData.slots && dayData.slots.length > 0;
                  
                  return (
                    <div key={day} className={`rap-day-card ${isAvailable ? 'rap-day-active' : 'rap-day-closed'}`}>
                      <div className="rap-day-header">{day}</div>
                      <div className="rap-day-body">
                        {isAvailable ? (
                          <ul className="rap-slot-list">
                            {dayData.slots.map((slot, idx) => (
                              <li key={idx} className="rap-slot-item">{slot}</li>
                            ))}
                          </ul>
                        ) : (
                          <div className="rap-closed-text">Closed / Unavailable</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default I_ResourceAvailabilityPage;
