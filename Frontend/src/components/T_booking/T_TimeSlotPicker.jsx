import React, { useState, useEffect } from 'react';
import './T_TimeSlotPicker.css';

/**
 * A smart time range selection interface. Integrates start/end logic and visually maps 
 * conflict zones block-outs if unavailableSlots data is provided.
 *
 * @param {string} date - Selected date (YYYY-MM-DD)
 * @param {string} startTime - Current start time (HH:mm)
 * @param {string} endTime - Current end time (HH:mm)
 * @param {Function} onChange - (type, value) => void where type is 'startTime' or 'endTime'
 * @param {Array} unavailableSlots - Array of { start: 'HH:mm', end: 'HH:mm' } blocks
 */
const T_TimeSlotPicker = ({
  date,
  startTime,
  endTime,
  onChange,
  unavailableSlots = []
}) => {

  const [error, setError] = useState(null);

  // Automatically validate time boundaries when time props natively change
  useEffect(() => {
    validateTimeRange(startTime, endTime);
  }, [startTime, endTime]);

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  };

  const validateTimeRange = (start, end) => {
    setError(null);
    if (!start || !end) return;

    const startMins = timeToMinutes(start);
    const endMins = timeToMinutes(end);

    if (endMins <= startMins) {
      setError("End time must definitively be after the start time.");
      return;
    }

    // Check if the physically selected block overlaps with known unavailable server blocks
    for (const slot of unavailableSlots) {
      const uStart = timeToMinutes(slot.start);
      const uEnd = timeToMinutes(slot.end);

      // Overlap engine condition: Proposed Start is before Unavailable End AND Proposed End is after Unavailable Start
      if (startMins < uEnd && endMins > uStart) {
        setError(`This timeframe overlaps directly with a blocked slot (${slot.start} - ${slot.end}).`);
        return;
      }
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 8; h <= 20; h++) { // Maps visual bars from 8 AM to 8 PM globally
      for (let m = 0; m < 60; m += 30) {
        const hourStr = h.toString().padStart(2, '0');
        const minStr = m.toString().padStart(2, '0');
        slots.push(`${hourStr}:${minStr}`);
      }
    }
    return slots;
  };

  const allSlots = generateTimeSlots();

  const isSlotBlocked = (timeStr) => {
    if (!unavailableSlots || unavailableSlots.length === 0) return false;
    
    const slotMins = timeToMinutes(timeStr);
    
    return unavailableSlots.some(slot => {
      const sStart = timeToMinutes(slot.start);
      const sEnd = timeToMinutes(slot.end);
      return slotMins >= sStart && slotMins < sEnd;
    });
  };

  const handleStartChange = (e) => {
    onChange('startTime', e.target.value);
  };

  const handleEndChange = (e) => {
    onChange('endTime', e.target.value);
  };

  return (
    <div className="t-time-picker-container">
      
      {/* Extensible visual timeline for booking context mapping */}
      {date && unavailableSlots.length > 0 && (
        <div className="t-tp-visualizer">
          <label className="t-tp-viz-label">Resource Availability Snapshot for {date}:</label>
          <div className="t-tp-bar">
            {allSlots.map((slotTime, idx) => {
              const blocked = isSlotBlocked(slotTime);
              return (
                <div 
                  key={idx} 
                  className={`t-tp-segment ${blocked ? 't-tp-blocked' : 't-tp-open'}`}
                  title={`${slotTime} - ${blocked ? 'Blocked' : 'Available'}`}
                />
              );
            })}
          </div>
          <div className="t-tp-legend">
            <span className="t-tp-legend-item"><span className="t-tp-box t-tp-open"></span> Available</span>
            <span className="t-tp-legend-item"><span className="t-tp-box t-tp-blocked"></span> Blocked</span>
          </div>
        </div>
      )}

      {/* Actual Input Selectors mapping string values */}
      <div className="t-tp-controls">
        <div className="t-tp-input-group">
          <label htmlFor="tp_startTime">Start Time</label>
          <input 
            type="time" 
            id="tp_startTime" 
            value={startTime || ''} 
            onChange={handleStartChange}
            className={`t-tp-input ${error ? 't-tp-input-error' : ''}`}
            disabled={!date}
          />
        </div>
        
        <div className="t-tp-divider">➡️</div>
        
        <div className="t-tp-input-group">
          <label htmlFor="tp_endTime">End Time</label>
          <input 
            type="time" 
            id="tp_endTime" 
            value={endTime || ''} 
            onChange={handleEndChange}
            className={`t-tp-input ${error ? 't-tp-input-error' : ''}`}
            disabled={!date || !startTime}
          />
        </div>
      </div>

      {error ? (
        <div className="t-tp-error-card">
          <span>⚠️</span> {error}
        </div>
      ) : (
        startTime && endTime && (
          <div className="t-tp-success-card">
            <span>✅</span> Timeframe formally valid and available for booking
          </div>
        )
      )}

      {!date && (
        <div className="t-tp-hint">Please explicitly select a Date first to configure valid time slots.</div>
      )}
    </div>
  );
};

export default T_TimeSlotPicker;
