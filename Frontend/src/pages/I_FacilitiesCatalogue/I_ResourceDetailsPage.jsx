import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './I_ResourceDetailsPage.css';
import I_ResourceDetailsPanel from '../../components/I_facilities/I_ResourceDetailsPanel';
import I_resourceService from '../../services/I_resourceService';

// Simulated data to emulate backend fetch
const mockResourcesDatabase = {
  "res-001": {
    id: "res-001", name: "Main Auditorium", type: "Lecture hall", capacity: 500,
    location: "Block A, Level 1", status: "ACTIVE", 
    description: "The Main Auditorium is fully equipped with dual 4K projectors, surround sound, and centralized AC. Suitable for large guest lectures and townhalls.",
    suitablePurposes: ["Lectures", "Townhalls", "Seminars"],
    availabilityWindows: [
      { day: "Monday", startTime: "08:00 AM", endTime: "06:00 PM" },
      { day: "Wednesday", startTime: "08:00 AM", endTime: "06:00 PM" },
      { day: "Friday", startTime: "08:00 AM", endTime: "04:00 PM" }
    ],
    imageUrl: "/campus-placeholder.png",
    imageGallery: ["/campus-placeholder.png", "/campus-placeholder.png"]
  },
  "res-002": {
    id: "res-002", name: "Advanced IT Lab", type: "Lab", capacity: 40,
    location: "Block B, Level 3", status: "ACTIVE", 
    description: "High-spec workstations with dual monitors. Pre-installed with IDEs, Adobe CC, and specialized simulation software.",
    suitablePurposes: ["Computer Science practicals", "Hackathons"],
    availabilityWindows: [
      { day: "Daily", startTime: "07:00 AM", endTime: "10:00 PM" }
    ],
    imageUrl: "/campus-placeholder.png"
  }
};

const I_ResourceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true);
      try {
        const data = await I_resourceService.getResourceById(id);
        if (!data) {
          throw new Error('This specific resource could not be found.');
        }
        setResource(data);
      } catch (err) {
        setError(err.message || 'This specific resource could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const handleBook = (res) => {
    navigate(`/booking/new?resourceId=${res.id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="rd-page-loading">
        <div className="rd-spinner"></div>
        <p>Loading facility information...</p>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="rd-page-error">
        <h2>Oops!</h2>
        <p>{error || "We couldn't find the resource you're looking for. It may have been removed."}</p>
        <button onClick={() => navigate('/facilities/all')} className="rd-btn-primary">
          Browse All Resources
        </button>
      </div>
    );
  }

  return (
    <div className="resource-details-page">
      {/* We use the specialized Details Panel we built */}
      <I_ResourceDetailsPanel 
        resource={resource}
        onBook={handleBook}
        onBack={handleBack}
      />

      {/* Additional Page Sections requested by Assignment / Scope */}
      <div className="rd-extra-info-grid">
        <section className="rd-info-card">
          <h3>Booking Policies</h3>
          <ul className="rd-policy-list">
            <li>Bookings must be made at least 24 hours in advance.</li>
            <li>Maximum booking duration is 4 hours per session.</li>
            <li>Approval required from Admin for weekend access.</li>
          </ul>
        </section>

        <section className="rd-info-card">
          <h3>Current Integrity Status</h3>
          <div className="rd-status-wrap">
            <span className={`rd-status-pill ${resource.status === 'ACTIVE' ? 'rd-pill-active' : 'rd-pill-inactive'}`}>
              {resource.status.replace(/_/g, ' ')}
            </span>
            <p>
              {resource.status === 'ACTIVE' 
                ? 'This facility is operating normally with no reported maintenance tickets.' 
                : 'This facility has an active maintenance ticket and is currently unavailable for booking. Technicians have been notified.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default I_ResourceDetailsPage;
