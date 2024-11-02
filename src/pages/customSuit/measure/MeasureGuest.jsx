import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MeasureGuest.scss';

const MeasureGuest = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const toggleLoginForm = (e) => {
    e.preventDefault();
    setShowLoginForm(!showLoginForm);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing error

    try {
      const response = await fetch('https://localhost:7194/api/Login/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token); // Store the token securely
        console.log('Login successful!');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div className="product-detail-page measures-pages">
        <div className="all">
          <div className="sec-title center-txt">
            <h3 className="tt-txt">
              <span className="tt-sub">Your Measures</span>
            </h3>
          </div>

          <div className="form-get-measures">
            <div className="woocommerce">

                {/* login form */}
              <div className="woocommerce-form-login-toggle">
                <div className="woocommerce-info">
                  Returning customer?
                  <a
                    href="#"
                    className="showlogin"
                    id="mona-mesua-form-login"
                    onClick={toggleLoginForm}
                  >
                    Click here to login
                  </a>
                </div>
              </div>

              {showLoginForm && (
                <form
                  className="woocommerce-form woocommerce-form-login login"
                  onSubmit={handleLogin}
                  style={{ display: 'block' }}
                >
                  <a
                    className="social-login-url main-btn btn facebook"
                    href="https://www.facebook.com/dialog/oauth?client_id=1088861731264410&redirect_uri=https://adongsilk.com/social-hook&scope=public_profile,email"
                    data-type="facebook"
                  >
                    <i className="fa fa-facebook"></i> &nbsp; Login with Facebook
                  </a>
                  <a
                    className="social-login-url main-btn btn google"
                    href="https://accounts.google.com/o/oauth2/v2/auth?client_id=165347575294-mfu24qrf7enb6bmsd6sqma2s4bpipfc3.apps.googleusercontent.com&response_type=code&scope=openid%20email&redirect_uri=https://adongsilk.com/social-hook/"
                    data-type="google"
                  >
                    <i className="fa fa-google-plus"></i>
                    <span className="txt">&nbsp; Login with Google</span>
                  </a>

                  <p className="form-row form-row-first">
                    <label htmlFor="username">
                      Username or email&nbsp;<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="input-text"
                      name="username"
                      id="username"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </p>

                  <p className="form-row form-row-last">
                    <label htmlFor="password">
                      Password&nbsp;<span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      className="input-text"
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </p>

                  {error && <p className="error-message">{error}</p>}

                  <p className="form-row">
                    <button type="submit" className="button" name="login">
                      Login
                    </button>
                  </p>
                </form>
              )}
            </div>

            {/* measure form */}

            <form action="" method="post" id="mona-submit-mesuares">
  <div className="frow">
    <input name="your_name" type="text" className="fcontrol" placeholder="Name" />
  </div>
  
  <div className="frow">
    <div className="inline-controls">
      <input name="your_height" type="text" className="fcontrol" placeholder="Height(Cm)" />
      <input name="your_weight" type="text" className="fcontrol" placeholder="Weight(Kg)" />
      <input name="your_age" type="text" className="fcontrol" placeholder="Age" />
    </div>
  </div>
  
  <div className="frow col2row">
    <div className="mona-row1">
      <div className="inline-controls">
        <label className="lb">Chest</label>
        <div className="ipgr"><input name="your_chest" type="text" className="fcontrol" /> cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Waist</label>
        <div className="ipgr"><input name="your_waist" type="text" className="fcontrol" /> cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Hip</label>
        <div className="ipgr"><input name="your_hip" type="text" className="fcontrol" /> cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Neck</label>
        <div className="ipgr"><input name="your_nek" type="text" className="fcontrol" /> cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Armhole</label>
        <div className="ipgr"><input name="your_armhole" type="text" className="fcontrol" /> cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Biceps</label>
        <div className="ipgr"><input name="your_biceps" type="text" className="fcontrol" /> cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Shoulder</label>
        <div className="ipgr"><input name="your_showder" type="text" className="fcontrol" /> cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Sleeve length</label>
        <div className="ipgr"><input name="your_sleeve_length" type="text" className="fcontrol" /> cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Jaket length</label>
        <div className="ipgr"><input name="your_jaket_length" type="text" className="fcontrol" /> cm</div>
      </div>
    </div>

    <div className="mona-row2">
      <div className="inline-controls">
        <label className="lb">Pants Waist</label>
        <div className="ipgr"><input name="your_pant_waist" type="text" className="fcontrol" /> cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Crotch</label>
        <div className="ipgr"><input name="your_crotch" type="text" className="fcontrol" /> cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Thigh</label>
        <div className="ipgr"><input name="your_thigh" type="text" className="fcontrol" /> cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Pants length</label>
        <div className="ipgr"><input name="your_pant_length" type="text" className="fcontrol" /> cm</div>
      </div>
    </div>
  </div>
  
  <p className="center-txt">
    <button type="submit" className="primary-btn btn">Confirm</button>
  </p>
</form>

          </div>

          {/* measure guide */}
          <div className="form-get-measures mona-content">
  <div className="sec-title center-txt">
    <h3 className="tt-txt">
      <span className="tt-sub">How to Measures</span>
    </h3>
  </div>
  <div className="clear">
    <p><span style={{ color: '#ff9900' }}><strong>SHIRT/ JACKET</strong></span></p>
    <p>
      <iframe
        src="https://www.youtube.com/embed/C2HXr2od5cY"
        width="1170"
        height="658"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </p>
    <p>
      <iframe
        src="https://www.youtube.com/embed/prLB6O5CUrU"
        width="1170"
        height="658"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </p>
    <p>
      <iframe
        width="1170"
        height="658"
        src="https://www.youtube.com/embed/eAuTIoy2lgc"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </p>
    <p>
      <iframe
        width="1170"
        height="658"
        src="https://www.youtube.com/embed/jHljN0JjlIc"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </p>
    <p>
      <iframe
        width="1170"
        height="658"
        src="https://www.youtube.com/embed/WihTP6ZRSO0"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </p>
    <p>
      <iframe
        width="1170"
        height="658"
        src="https://www.youtube.com/embed/yzobV1N1h7M"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </p>
    <p>
      <iframe
        width="1170"
        height="658"
        src="https://www.youtube.com/embed/j3Z8Rh5O13o"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </p>
    <p>
      <iframe
        width="1170"
        height="658"
        src="https://www.youtube.com/embed/uY-VHeblKJQ"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </p>
    <p>
      <iframe
        width="1170"
        height="658"
        src="https://www.youtube.com/embed/Ew8uKQ7qcvg"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </p>
    <p><span style={{ color: '#ff9900' }}><strong>PANTS</strong></span></p>
    <p>
      <iframe
        width="1170"
        height="658"
        src="https://www.youtube.com/embed/TOiIpRRxqnE"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </p>
    <p>
      <iframe
        width="1170"
        height="658"
        src="https://www.youtube.com/embed/oYF3AzkyJNM"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </p>
    <p>
      <iframe
        width="1170"
        height="658"
        src="https://www.youtube.com/embed/41uFIsmcbzk"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </p>
    <p>
      <iframe
        width="1170"
        height="658"
        src="https://www.youtube.com/embed/MoPUIzKoJgM"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </p>
  </div>
</div>

        </div>
      </div>



      <div className="next-btn">
        <Link to="/cart">
          <button className="navigation-button">Next</button>
        </Link>
      </div>
    </>
  );
};

export default MeasureGuest;
