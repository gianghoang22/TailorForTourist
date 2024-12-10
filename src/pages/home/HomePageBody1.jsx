import { Link } from "react-router-dom";
import "../home/HomePageBody1.scss";

export const HomePageBody1 = () => {
  return (
    <section className="sec sec-step">
      <div className="all">
        <div className="sec-title">
          <h3 className="tt-txt">
            <span className="tt-sub">03</span>
            Simple steps
          </h3>
        </div>
        <ul className="step-ul" style={{ letterSpacing: "60px" }}>
          <li>
            <article className="step-box">
              <div className="img">
                <img
                  width="70"
                  height="70"
                  src="https://adongsilk.com/wp-content/uploads/2018/05/step-1.png"
                  className="attachment-thumbnail size-thumbnail"
                  alt=""
                />
              </div>
              <div className="info">
                <h4 className="title">SELECT YOUR FABRICS</h4>
                <p className="smr">
                  Pick the fabric that you want from our fabric collection.
                </p>
              </div>
            </article>
          </li>
          <li>
            <article className="step-box">
              <div className="img">
                <img
                  width="70"
                  height="70"
                  src="https://adongsilk.com/wp-content/uploads/2018/05/step-2.png"
                  className="attachment-thumbnail size-thumbnail"
                  alt=""
                />
              </div>
              <div className="info">
                <h4 className="title">DESIGN YOUR STYLE</h4>
                <p className="smr">
                  Choose the style you like from the full selection of men
                  collection, women collection, wedding tailored clothes or
                  accessories.
                </p>
              </div>
            </article>
          </li>
          <li>
            <article className="step-box">
              <div className="img">
                <img
                  width="54"
                  height="70"
                  src="https://adongsilk.com/wp-content/uploads/2018/05/step-3.png"
                  className="attachment-thumbnail size-thumbnail"
                  alt=""
                />
              </div>
              <div className="info">
                <h4 className="title">MEASURE YOURSELF</h4>
                <p className="smr">
                  Fill the information about your height, weight.
                </p>
              </div>
            </article>
          </li>
        </ul>
        <Link to="/custom-suits" className="btn w170-btn primary-btn">
          Get start
        </Link>
      </div>
    </section>
  );
};
