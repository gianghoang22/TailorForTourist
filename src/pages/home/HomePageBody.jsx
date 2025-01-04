import { useState, useEffect } from "react";

import "../../assets/scss/SlideShow.scss";
import "../home/HomePageBody.scss";
import banner1 from "../../assets/img/elements/banner-1.jpg";
import banner2 from "../../assets/img/elements/banner-2.jpg";
import banner3 from "../../assets/img/elements/banner-3.jpg";
import banner4 from "../../assets/img/elements/banner-4.jpg";
export function HomePageBody() {
  const [slideIndex, setSlideIndex] = useState(0);
  const slides = [
    { src: banner1 },
    { src: banner2 },
    { src: banner3 },
    { src: banner4 },
  ];

  // Function to handle next/prev buttons
  const plusSlides = (n) => {
    setSlideIndex(
      (prevIndex) => (prevIndex + n + slides.length) % slides.length
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000); // Auto-slide every 3 seconds
    return () => clearTimeout(timer); // Clean up the timer
  }, [slideIndex, slides.length]);

  return (
    <div className="slider-area position-relative">
      <div className="slider-active">
        <div className="slideshow-container section-padding40">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="mySlides"
              style={{ display: index === slideIndex ? "block" : "none" }}
            >
              {/* <div className="numbertext">{index + 1} / {slides.length}</div> */}
              <img
                src={slide.src}
                alt={`Slide ${index + 1}`}
                style={{ width: "100%" }}
              />
              <div className="text">{slide.caption}</div>
            </div>
          ))}

          {/* Next and previous buttons */}
          {/* <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
      <a className="next" onClick={() => plusSlides(1)}>&#10095;</a> */}
        </div>

        {/* Clients Area */}
        <div id="sec-thumb" className="sec-thumb sec-featbn">
          <section className="bn-feat-item">
            <a className="img">
              <img
                width="640"
                height="400"
                src="https://adongsilk.com/wp-content/uploads/2024/03/wedding-suits-in-hoi-an.jpg"
                className="attachment-info_thumb size-info_thumb"
                alt=""
                srcSet="https://adongsilk.com/wp-content/uploads/2024/03/wedding-suits-in-hoi-an.jpg 640w, 
          https://adongsilk.com/wp-content/uploads/2024/03/wedding-suits-in-hoi-an-300x188.jpg 300w, 
          https://adongsilk.com/wp-content/uploads/2024/03/wedding-suits-in-hoi-an-488x305.jpg 488w, 
          https://adongsilk.com/wp-content/uploads/2024/03/wedding-suits-in-hoi-an-216x135.jpg 216w, 
          https://adongsilk.com/wp-content/uploads/2024/03/wedding-suits-in-hoi-an-600x375.jpg 600w"
                sizes="(max-width: 640px) 100vw, 640px"
              />
            </a>
            <div className="info left-txt">
              <p className="sub-name">
                <a >BE OUTSTANDING AT THE WEDDING</a>
              </p>
              <h4 className="feat-name">
                <a >Wedding suits I wedding dress</a>
              </h4>
            </div>
          </section>
          <section className="bn-feat-item">
            <a className="img">
              <img
                width="640"
                height="400"
                src="https://adongsilk.com/wp-content/uploads/2018/05/bnsmall-bg-2.jpg"
                className="attachment-info_thumb size-info_thumb"
                alt=""
                srcSet="https://adongsilk.com/wp-content/uploads/2018/05/bnsmall-bg-2.jpg 640w, 
          https://adongsilk.com/wp-content/uploads/2018/05/bnsmall-bg-2-300x188.jpg 300w,
          https://adongsilk.com/wp-content/uploads/2018/05/bnsmall-bg-2-488x305.jpg 488w, 
          https://adongsilk.com/wp-content/uploads/2018/05/bnsmall-bg-2-216x135.jpg 216w, 
          https://adongsilk.com/wp-content/uploads/2018/05/bnsmall-bg-2-600x375.jpg 600w"
                sizes="(max-width: 640px) 100vw, 640px"
              />
            </a>
            <div className="info center-txt">
              <p className="sub-name">
                <a>
                  DESIGN YOUR NEW FAVORITE SUITS
                </a>
              </p>
              <h4 className="feat-name">
                <a>CUSTOM SUITS</a>
              </h4>
            </div>
          </section>
          <section className="bn-feat-item">
            <a className="img">
              <img
                width="640"
                height="400"
                src="https://adongsilk.com/wp-content/uploads/2024/03/tailored-shirts-in-hoi-an.png"
                className="attachment-info_thumb size-info_thumb"
                alt=""
                srcSet="https://adongsilk.com/wp-content/uploads/2024/03/tailored-shirts-in-hoi-an.png 640w, 
    https://adongsilk.com/wp-content/uploads/2024/03/tailored-shirts-in-hoi-an-300x188.png 300w, 
    https://adongsilk.com/wp-content/uploads/2024/03/tailored-shirts-in-hoi-an-488x305.png 488w, 
    https://adongsilk.com/wp-content/uploads/2024/03/tailored-shirts-in-hoi-an-216x135.png 216w, 
    https://adongsilk.com/wp-content/uploads/2024/03/tailored-shirts-in-hoi-an-600x375.png 600w"
                sizes="(max-width: 640px) 100vw, 640px"
              />
            </a>
            <div className="info right-txt">
              <p className="sub-name">
                <a>
                  MADE TO MEASURE AND DESIGNED BY YOU
                </a>
              </p>
              <h4 className="feat-name">
                <a>
                  CUSTOM SHIRTS
                </a>
              </h4>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
