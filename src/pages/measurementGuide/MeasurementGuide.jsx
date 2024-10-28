import React from 'react';
import './MeasurementGuide.scss';

const jacketVideos = [
  { title: "How To Measure Your Chest For A Custom Suit", id: "C2HXr2od5cY" },
  { title: "How To Measure Your Waist For A Custom Suit", id: "prLB6O5CUrU" },
  { title: "How To Measure Your Hip For A Custom Suit", id: "eAuTIoy2lgc" },
  { title: "How To Measure Your Neck For A Custom Suit", id: "jHljN0JjlIc" },
  { title: "How To Measure Your Armhole For A Custom Suit", id: "WihTP6ZRSO0" },
  { title: "How To Measure Your Bicep For A Custom Suit", id: "yzobV1N1h7M" },
  { title: "How To Measure Your Shoulder For A Custom Suit", id: "j3Z8Rh5O13o" },
  { title: "How To Measure Your Sleeve Length For A Custom Suit", id: "uY-VHeblKJQ" },
  { title: "How To Measure Your Body Jacket Length", id: "Ew8uKQ7qcvg" },
];

const pantVideos = [
  { title: "How To Measure Your Stomach For A Custom Suit", id: "TOiIpRRxqnE" },
  { title: "How To Measure Crotch For A Custom Suit", id: "oYF3AzkyJNM" },
  { title: "How To Measure Your Thigh For A Custom Suit", id: "41uFIsmcbzk" },
  { title: "How To Measure Pant's Length For A Custom Suit", id: "MoPUIzKoJgM" },
];

const MeasurementGuide = () => {
  return (
    <div className="page-with-side-bar">
      <div className="all">
        <div className="left-side">
          <div className="sec-title">
            <h1 className="tt-txt">
              <span className="tt-sub">How to measure</span>
              A Dong Silk
            </h1>
          </div>
        </div>

        <div className="right-main">
          <p><span className="section-title" style={{color: '#FF9900'}}><strong>JACKET/ SHIRT</strong></span></p>
          
          {jacketVideos.map((video, index) => (
            <div key={index} className="video-container">
              <iframe
                title={video.title}
                width="1170"
                height="658"
                src={`https://www.youtube.com/embed/${video.id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))}

        <p><span className="section-title" style={{color: '#FF9900'}}><strong>PANTS</strong></span></p>
          {pantVideos.map((video, index) => (
            <div key={index} className="video-container">
              <iframe
                title={video.title}
                width="1170"
                height="658"
                src={`https://www.youtube.com/embed/${video.id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default MeasurementGuide;
