import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faUser, faMobileAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import './ContactUs.scss';
import { Footer } from '../../layouts/components/footer/Footer';
import { Navigation } from '../../layouts/components/navigation/Navigation';

const StoreInfo = ({ store }) => (
  <div className="store-info-card">
    <h3 className="store-name">{store.name}</h3>
    <div className="store-details">
      <div className="info-item">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="info-icon" />
        <div className="info-content">
          <span className="info-label">Address</span>
          <p>{store.address}</p>
        </div>
      </div>
      <div className="info-item">
        <FontAwesomeIcon icon={faMobileAlt} className="info-icon" />
        <div className="info-content">
          <span className="info-label">Contact Number</span>
          <p>{store.contactNumber}</p>
        </div>
      </div>
    </div>
  </div>
);

const ContactUs = () => {
  const formRef = useRef(null);
  const mapRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('https://vesttour.xyz/api/Store');
        if (response.ok) {
          const data = await response.json();
          const activeStores = data.filter(store => store.status === "Active");
          setStores(activeStores);
        } else {
          console.error('Failed to fetch stores');
        }
      } catch (error) {
        console.error('An error occurred while fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setResponseMessage('');

    try {
      const response = await fetch('https://vesttour.xyz/api/Contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setResponseMessage('Your message has been sent successfully.');
        formRef.current.reset();
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setResponseMessage('Failed to send the message. Please try again later.');
      }
    } catch (error) {
      setResponseMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="page-no-side-bar">
        <div className="all">
          <div className="ggmap">
            <div ref={mapRef} className="map-container"></div>
          </div>
          <div className="contact-row">
            <div className="contact-col">
              <div className="sec-title">
                <h1 className="tt-txt">
                  <span className="tt-sub">CONTACT US</span> MATCHA VEST
                </h1>
              </div>
              <div className="sec-smr">
                <p><strong>Matcha Vest</strong> is devoted to serving the needs of its current and prospective clients and will respond to any questions, comments, or concerns within 24 hours.</p>
              </div>
            </div>
            <div className="contact-col stores-container">
              <h2 className="stores-title">Our Locations</h2>
              <div className="stores-grid">
                {stores.map(store => (
                  <StoreInfo key={store.storeId} store={store} />
                ))}
              </div>
            </div>
            <div className="contact-col">
              <form ref={formRef} onSubmit={handleSubmit} className="wpcf7-form">
                <div className="contact-form">
                  <div className="frow">
                    <input 
                      type="text" 
                      name="name" 
                      size="40" 
                      className="fcontrol gray-control" 
                      placeholder="Enter your name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="frow">
                    <input 
                      type="email" 
                      name="email" 
                      size="40" 
                      className="fcontrol gray-control" 
                      placeholder="Email address" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="frow">
                    <input 
                      type="text" 
                      name="subject" 
                      size="40" 
                      className="fcontrol gray-control" 
                      placeholder="Message subject" 
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="frow">
                    <textarea 
                      name="message" 
                      cols="40" 
                      rows="10" 
                      className="fcontrol gray-control" 
                      placeholder="Enter your message" 
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <p>
                    <input 
                      type="submit" 
                      value={isSubmitting ? "Sending..." : "Send"} 
                      className="btn primary-btn w170-btn" 
                      disabled={isSubmitting} 
                    />
                  </p>
                  {responseMessage && <p className="response-message">{responseMessage}</p>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
