import '../home/HomePageBody4.scss';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTripadvisor } from '@fortawesome/free-brands-svg-icons';

export const HomePageBody4 = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 4;

  // Calculate pagination values
  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);
  const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        // Fetch feedback data
        const feedbackResponse = await fetch('https://vesttour.xyz/api/Feedback/all');
        const feedbackData = await feedbackResponse.json();

        // Fetch user data for each feedback
        const feedbacksWithUser = await Promise.all(
          feedbackData.map(async (feedback) => {
            const userResponse = await fetch(`https://vesttour.xyz/api/User/${feedback.userId}`);
            const userData = await userResponse.json();
            return {
              ...feedback,
              userName: userData.name
            };
          })
        );

        setFeedbacks(feedbacksWithUser);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFeedbackData();
  }, []);

  return (
    <>
    {/* link-info */}
    {/* <section className='kpart sec k-sec'>
        <div className="decor-sec">
            <img src="https://adongsilk.com/template/images/review-decor.png" alt="" />
        </div>
        <div className="all">
            <div className="kpart-warp">
                <div className="kpart-main">
                    <div className='kpart-slide kpart-slide-js slick-initialized slick-slider' id='kpart-slide-js'>
                        <div className="slick-list draggable">
                            <div className="slick-track-banner">
                                <div className="slider-item slick-slide slick-current slick-active" data-slick-index="0" aria-hidden="false" style={{ width: '100%' }} tabIndex="0">
                                    <div className="kpart-item">
                                        <a href="https://www.trustpilot.com/review/adongsilk.com" target="_blank" rel="noopener noreferrer" tabIndex="0">
                                        <img src="https://adongsilk.com/wp-content/uploads/2024/03/ADS_Trustpilot.png" alt="" />
                                        </a>
                                    </div>
                                </div>
                                <div className="slider-item slick-slide slick-current slick-active" data-slick-index="0" aria-hidden="false" style={{ width: '100%' }} tabIndex="0">
                                    <div className="kpart-item">
                                        <a href="https://www.trustpilot.com/review/adongsilk.com" target="_blank" rel="noopener noreferrer" tabIndex="0">
                                        <img src="https://adongsilk.com/wp-content/uploads/2024/03/Tripadvisor.png" alt="" />
                                        </a>
                                    </div>
                                </div>
                                <div className="slider-item slick-slide slick-current slick-active" data-slick-index="0" aria-hidden="false" style={{ width: '100%' }} tabIndex="0">
                                    <div className="kpart-item">
                                        <a href="https://www.trustpilot.com/review/adongsilk.com" target="_blank" rel="noopener noreferrer" tabIndex="0">
                                        <img src="https://adongsilk.com/wp-content/uploads/2024/03/ADS_Google.png" alt="" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section> */}

    {/* feedback */}
    <section className='fback sec'>
        <div className="decor-sec">
            <img src="https://adongsilk.com/template/images/review-decor.png" alt="" />
        </div>
        <div className="fback-content">
            <div className="all">
                <div className="fback-wrap">
                    <div className="kpart-top">
                        <div className="sec-title k-title">
                            <h2 className='tt-txt'>
                                <span className='tt-sub'>
                                    CUSTOMERS
                                </span>
                                FEEDBACk
                            </h2>
                        </div>
                    </div>
                    {/* feedback here */}
                    <div className="fback-main">
                        <div className="feedback-grid">
                            {currentFeedbacks.map((feedback) => (
                                <div key={feedback.feedbackId} className="feedback-item">
                                    <div className="user-info">
                                        <h3>{feedback.userName}</h3>
                                        <div className="stars">
                                            {[...Array(5)].map((_, index) => (
                                                <FaStar
                                                    key={index}
                                                    className={index < feedback.rating ? 'star-filled' : 'star-empty'}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="comment">{feedback.comment}</p>
                                    <p className="date">{new Date(feedback.dateSubmitted).toLocaleDateString()}</p>
                                    {feedback.response && (
                                        <div className="response">
                                            <p><strong>Response:</strong> {feedback.response}</p>
                                            <p className="date">{new Date(feedback.dateResponse).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                <button 
                                    className="page-btn"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <FaChevronLeft />
                                </button>

                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button 
                                    className="page-btn"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
    
  )
}
