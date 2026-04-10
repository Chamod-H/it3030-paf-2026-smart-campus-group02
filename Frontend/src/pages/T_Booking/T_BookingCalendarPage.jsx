import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './T_BookingCalendarPage.css';

/**
 * Visual Calendar Dashboard for Booking Overlaps and Schedule Planning.
 * Defaults to a "Day View" time-grid for mapping facility resources globally.
 */
const T_BookingCalendarPage = () => {
  const navigate = useNavigate();

  // Anchoring the mock system functionally to the active demo date
  const [currentDate, setCurrentDate] = useState('2026-05-15');

  // Hardcoded timeframe purely for rendering the structural grid boundary: 08:00 to 20:00 (12 hours)
  const START_HOUR = 8;
  const END_HOUR = 20;
  const TOTAL_HOURS = END_HOUR - START_HOUR;

  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
  };

  // Mock mapped catalog of resources for horizontal rows
  const resources = [
    { id: '1', name: 'Auditorium A' },
    { id: '2', name: 'Advanced IT Lab' },
    { id: '3', name: 'Meeting Room Alpha' },
    { id: '4', name: 'Main Sports Hall' }
  ];

  // Mock dynamic backend mapping payload logically mapped against "Auditorium A" etc.
  const mockBookings = [
    {
      id: 'BK-1001',
      resourceId: '1',
      startTime: '09:00',
      endTime: '11:00',
      status: 'APPROVED',
      title: 'Guest Lecture'
    },
    {
      id: 'BK-1008',
      resourceId: '1',
      startTime: '13:30',
      endTime: '16:00',
      status: 'PENDING',
      title: 'Orientation Prep'
    },
    {
      id: 'BK-1002',
      resourceId: '2',
      startTime: '14:00',
      endTime: '17:00',
      status: 'APPROVED',
      title: 'Networking Workshop'
    },
    {
      id: 'BK-1003',
      resourceId: '3',
      startTime: '10:00',
      endTime: '11:30',
      status: 'APPROVED',
      title: 'Project Sync'
    },
    {
      id: 'BK-1009',
      resourceId: '4',
      startTime: '16:00',
      endTime: '19:00',
      status: 'APPROVED',
      title: 'Sports Trials'
    }
  ];

  // Logic to securely convert HH:MM into a rigorous CSS percentage offset for absolute positioning
  const calculatePosition = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const totalMinutesFromStart = ((hours - START_HOUR) * 60) + minutes;
    const totalGridMinutes = TOTAL_HOURS * 60;
    
    // Clamp to boundaries safely preventing div overflow tracking
    const clampedMins = Math.max(0, Math.min(totalMinutesFromStart, totalGridMinutes));
    return (clampedMins / totalGridMinutes) * 100;
  };

  // Generate hour text label markers for the precise top axis
  const hourMarkers = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    const isPM = h >= 12;
    const displayHour = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    const suffix = isPM ? 'PM' : 'AM';
    hourMarkers.push(`${displayHour} ${suffix}`);
  }

  return (
    <div className="t-calendar-page">
      <div className="t-cal-header">
        <div className="t-cal-title-block">
          <h1>📅 Resource Master Schedule</h1>
          <p>Visually track active, pending, and cleared utilization periods simultaneously.</p>
        </div>
        
        <div className="t-cal-controls">
          <label htmlFor="calDate">Target Timeline Filter:</label>
          <input 
            type="date" 
            id="calDate" 
            value={currentDate} 
            onChange={handleDateChange} 
            className="t-cal-date-picker"
          />
        </div>
      </div>

      <div className="t-cal-legend">
        <div className="t-cal-legend-item">
          <span className="t-cal-color-box t-cal-approved"></span> Approved Block
        </div>
        <div className="t-cal-legend-item">
          <span className="t-cal-color-box t-cal-pending"></span> Pending Verification
        </div>
      </div>

      <div className="t-cal-board">
        {/* Top Explicit Tracking Time Axis */}
        <div className="t-cal-axis">
          <div className="t-cal-axis-spacer"></div>
          <div className="t-cal-axis-ticks">
            {hourMarkers.map((label, idx) => (
              <div key={idx} className="t-cal-tick">
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Horizontal Resource Matrix Grid Rows */}
        <div className="t-cal-grid-area">
          {resources.map(res => {
            // Securely route bindings explicitly onto this rendered lane row
            const rowBookings = mockBookings.filter(b => b.resourceId === res.id);

            return (
              <div key={res.id} className="t-cal-row">
                <div className="t-cal-row-header">
                  {res.name}
                </div>
                
                <div className="t-cal-timeline">
                  {/* Generates absolute internal grid lines directly overlapping native CSS layers cleanly */}
                  {hourMarkers.map((_, i) => {
                    if (i === hourMarkers.length - 1) return null; // Drop last line right boundary
                    return <div key={i} className="t-cal-grid-line" style={{ left: `${(i / TOTAL_HOURS) * 100}%` }}></div>;
                  })}

                  {/* Render physical booking blocks dynamically via absolute % calculations securely parsing collision limits */}
                  {rowBookings.map(bk => {
                    const leftPercent = calculatePosition(bk.startTime);
                    const rightPercent = calculatePosition(bk.endTime);
                    const widthPercent = rightPercent - leftPercent;

                    const blockClass = bk.status === 'PENDING' ? 't-cal-block-pending' : 't-cal-block-approved';

                    return (
                      <div 
                        key={bk.id}
                        className={`t-cal-block ${blockClass}`}
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`
                        }}
                        onClick={() => navigate(`/bookings/${bk.id}`)}
                        title={`Ref: ${bk.id}\n${bk.title}\n${bk.startTime} - ${bk.endTime}`}
                      >
                        <span className="t-cal-block-title">{bk.title}</span>
                        <span className="t-cal-block-time">{bk.startTime} - {bk.endTime}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default T_BookingCalendarPage;
