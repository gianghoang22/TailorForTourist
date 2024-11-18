import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faUser, faMobileAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import './ContactUs.scss';
import ReCAPTCHA from 'react-google-recaptcha';
import { Footer } from '../../layouts/components/footer/Footer';
import { Navigation } from '../../layouts/components/navigation/Navigation';

const ContactUs = () => {
  const formRef = useRef(null);
  const mapRef = useRef(null);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      setResponseMessage('Please complete the reCAPTCHA.');
      return;
    }

    setIsSubmitting(true);
    setResponseMessage('');

    try {
      const response = await fetch('https://localhost:7194/api/Contact/send', {
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
        setCaptchaValue(null);
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
                  <span className="tt-sub">CONTACT US</span> A Dong Silk
                </h1>
              </div>
              <div className="sec-smr">
                <p><strong>A Dong Silk</strong> is devoted to serving the needs of its current and prospective clients and will respond to any questions, comments, or concerns within 24 hours.</p>
              </div>
            </div>
            <div className="contact-col">
              <dl className="conactInfo-dl">
                <dt><FontAwesomeIcon icon={faMapMarkerAlt} /></dt>
                <dd>
                  <p className="lb">Hoi An</p>
                  <p>40 Le Loi, Hoi An, Vietnam<br />
                  62 Tran Hung Dao, Hoi An, Vietnam<br />
                  91 Tran Hung Dao, Hoi An, Vietnam</p>
                </dd>
                <dt><FontAwesomeIcon icon={faEnvelope} /></dt>
                <dd>
                  <p className="lb">Email</p>
                  <p><a href="mailto:info@adongsilk.com">info@adongsilk.com</a></p>
                  <p><a href="mailto:sales@adongsilk.com">sales@adongsilk.com</a></p>
                </dd>   
                <dt><FontAwesomeIcon icon={faUser} /></dt>
                <dd>
                  <p className="lb">Sale</p>
                  <p><a href="tel:+84905540898">(+84) 905 540 898 (Phone/Whatsapp)</a></p>
                </dd>
                <dt><FontAwesomeIcon icon={faMobileAlt} /></dt>
                <dd>
                  <p className="lb">Phone number</p>
                  <p><a href="tel:+842353910579">(+84) 235 3910 579</a></p>
                </dd>
                <dt><FontAwesomeIcon icon={faPhone} /></dt>
                <dd>
                  <p className="lb">Hotline</p>
                  <p><a href="tel:+84913480276">(+84) 913 480 276 (Phone/Whatsapp)</a></p>
                </dd>
              </dl>
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
                  <ReCAPTCHA
                    sitekey="6LfAlXgqAAAAABF4BSCze2KfCXIY3PPBcVjZWqzu"
                    onChange={(val) => setCaptchaValue(val)}
                  />
                  <p>
                    <input 
                      type="submit" 
                      value={isSubmitting ? "Sending..." : "Send"} 
                      className="btn primary-btn w170-btn" 
                      disabled={!captchaValue || isSubmitting} 
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
