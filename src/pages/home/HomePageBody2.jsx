import "../home/HomePageBody2.scss";
import { motion } from "framer-motion";

export const HomePageBody2 = () => {
  return (
    <div>
      {/* About tailor */}
      <motion.div
        className="sec sec-about"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="all">
          <motion.div
            className="about-left"
            initial={{ x: -100 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="sec-title">
              <h3 className="tt-txt">
                <span className="tt-sub">About</span>
                Tailor
              </h3>
            </div>
            <div className="article-cont about-article">
              <p>
                &ldquo;<strong>Personal Tailoring</strong>&rdquo; is a service
                that tailors cut, design and sew clothes according to detailed
                customer&apos; specifications. The advantage of{" "}
                <strong>personal tailoring</strong> is that the customer
                participates in choosing the fabric; design and color, to ensure
                the clothes will fit their bodies and even their personality.{" "}
                <strong>Personal tailoring</strong> is usually done by in-house
                tailors. In general, <strong>personal tailoring</strong>{" "}
                describes a high degree of &ldquo;customization&rdquo; and
                involvement of customers.
              </p>
              <p>
                Established in 1998, <strong>TAILOR</strong> is a leader in
                bespoke personal tailoring in Vietnam. It has earned a global
                reputation for delivering modern, stylish, high quality garments
                that fit all body types, perfectly.
              </p>
              <p>
                Passing down a 50-year tradition of high couture in big city
                from the North from the South of Vietnam, famous for its silk
                weaving sine 400 years, <strong> Tailor</strong> is now the
                &ldquo;nation of needlework&rdquo; - reflecting the tranquility
                and tradition of hospitability of beautiful Vietnam.
              </p>
              <p></p>
              <p>&nbsp;</p>
              <p>&nbsp;</p>
            </div>
          </motion.div>
          <motion.div
            className="about-right"
            initial={{ x: 100 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img
              style={{ width: "498px", height: "698px" }}
              src="https://adongsilk.com/wp-content/uploads/2018/05/about-img.png"
              alt=""
            />
          </motion.div>
        </div>
      </motion.div>
      {/* Wedding Collection Section */}
      <motion.section
        className="kban sec k-sec"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="decor-sec">
          <img
            src="https://adongsilk.com/template/images/review-decor.png"
            alt="Decoration"
          />
        </div>
        <div className="all">
          <div className="kban-wrap">
            <div className="kban-flex">
              <div className="kban-left">
                <div className="sec-title k-title">
                  <h2 className="tt-txt">
                    <span className="tt-sub">WEDDING</span> COLLECTION
                  </h2>
                </div>
                <div className="kban-txt">
                  <p>
                    Elevate your wardrobe with the timeless allure and
                    distinguished charm of the Classic Elegance Collection.
                  </p>
                </div>
                <div className="kban-btn mt-20">
                </div>
              </div>

              <div className="kban-right">
                <div className="kban-box">
                  <div className="kban-de">
                    <img
                      src="https://adongsilk.com/wp-content/uploads/2024/04/kban-de.png"
                      alt="Wedding Collection"
                      srcSet="
                        https://adongsilk.com/wp-content/uploads/2024/04/kban-de.png 699w, 
                        https://adongsilk.com/wp-content/uploads/2024/04/kban-de-300x200.png 300w, 
                        https://adongsilk.com/wp-content/uploads/2024/04/kban-de-488x326.png 488w, 
                        https://adongsilk.com/wp-content/uploads/2024/04/kban-de-216x144.png 216w, 
                        https://adongsilk.com/wp-content/uploads/2024/04/kban-de-600x401.png 600w"
                      sizes="(max-width: 699px) 100vw, 699px"
                    />
                  </div>
                  <div className="kban-bg">
                    <img
                      src="https://adongsilk.com/template/images/kimg/kban-bg.png"
                      alt="Background"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
