import React, { useState } from 'react';
import Shared_PageHeader from '../../components/common/Shared_PageHeader';
import './Shared_HelpPage.css';

/**
 * Shared Help & Support Page
 * Provides instructional guidance on the major modules (Booking, Ticketing, Facilities)
 * and an FAQ section to aid usability and onboarding.
 */
const Shared_HelpPage = () => {
  // Simple state to manage active FAQ accordions
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  const faqs = [
    {
      q: 'How do I know if my booking is approved?',
      a: 'If you are a student, your booking will show as "Pending" until an Administrator approves it. You will receive an instant Bell Notification once status changes.'
    },
    {
      q: 'Can I cancel a ticket once I have submitted it?',
      a: 'Yes, as long as a Technician hasn\'t marked it as "In Progress". Go to your My Tickets page, click the ticket, and select "Withdraw Request".'
    },
    {
      q: 'Why can\'t I see the Admin Panel?',
      a: 'The Admin tools are strictly protected by Role-Based Access Control (RBAC). Only users designated as Administrators by the IT Department have access.'
    }
  ];

  return (
    <div className="shared-help-page">
      <Shared_PageHeader 
        title="Help & Support Center" 
        subtitle="Learn how to navigate the Smart Campus Operations Hub below."
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Help Center' }
        ]}
      />

      <div className="help-content-container">

        {/* ── Core Modules Guides ── */}
        <section className="guides-section">
          
          <div className="guide-card">
            <div className="guide-icon">📅</div>
            <div className="guide-text">
              <h3>Facilities Booking Guide</h3>
              <p>
                To secure a room or equipment, first browse the <strong>Facilities Catalogue</strong>. 
                Once you find a resource with the correct capacity, click <strong>Book Space</strong>. 
                Choose an available time-slot on the unified calendar. Staff bookings are auto-approved, 
                while student bookings enter an Administrative queue.
              </p>
            </div>
          </div>

          <div className="guide-card">
            <div className="guide-icon">🛠️</div>
            <div className="guide-text">
              <h3>Maintenance Ticketing</h3>
              <p>
                If you encounter a broken AC, a faulty projector, or standard wear-and-tear, 
                navigate to <strong>Report an Issue</strong>. Upload an optional photo, describe the 
                problem, and categorize the urgency. A Technician will pick up the ticket from their 
                queue and update the status as they resolve it.
              </p>
            </div>
          </div>

          <div className="guide-card">
            <div className="guide-icon">🔔</div>
            <div className="guide-text">
              <h3>Notification Workflows</h3>
              <p>
                Keep an eye on the <strong>Bell Icon</strong> in the top-right Navbar.
                The system automatically pushes alerts out whenever: 
                (1) A booking changes state, 
                (2) A ticket is assigned or resolved, or
                (3) The IT Department pushes a global campus broadcast.
              </p>
            </div>
          </div>

        </section>

        {/* ── FAQ & Support Block ── */}
        <div className="support-sidebar">
          
          <section className="faq-section">
            <h3 className="sidebar-heading">Frequently Asked Questions</h3>
            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className={`faq-item ${activeFaq === idx ? 'active' : ''}`}
                  onClick={() => toggleFaq(idx)}
                >
                  <div className="faq-question">
                    <strong>{faq.q}</strong>
                    <span className="faq-chevron">{activeFaq === idx ? '▲' : '▼'}</span>
                  </div>
                  {activeFaq === idx && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="contact-box">
            <h3 className="sidebar-heading">Still Need Assistance?</h3>
            <p>Our IT Service Desk operates Monday to Friday from 8:00 AM to 6:00 PM.</p>
            <div className="contact-methods">
              <div className="contact-row">
                <span>📞</span> <strong>+94 11 234 5678</strong>
              </div>
              <div className="contact-row">
                <span>✉️</span> <strong>helpdesk@smartcampus.edu</strong>
              </div>
              <div className="contact-row">
                <span>🏢</span> <strong>Block C, Room 204</strong>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

export default Shared_HelpPage;
