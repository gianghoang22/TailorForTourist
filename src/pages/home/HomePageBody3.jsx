import "../home/HomePageBody3.scss";
import { motion } from "framer-motion";

export const HomePageBody3 = () => {
  return (
    <motion.section
      className="kgall sec k-sec"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="all">
        <div className="kgall-wrap">
          <motion.div
            className="kgall-top"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="sec-title k-title">
              <h2 className="tt-txt">
                <span className="tt-sub">COLLECTION</span>
                GALLERY
              </h2>
            </div>
            {/* <div className="kgall-btn">
              <a
                href="https://adongsilk.com/gallery/"
                className="btn primary-btn"
              >
                View detail{" "}
              </a>
            </div> */}
          </motion.div>
          <div className="kgall-main">
            <div className="kgall-list">
              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/tailored-wedding-suits-01/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="1080"
                      height="1620"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an.jpg"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt="Tailored-wedding-suits-in-hoi-an"
                      srcSet="https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an.jpg 1080w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-200x300.jpg 200w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-683x1024.jpg 683w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-768x1152.jpg 768w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-1024x1536.jpg 1024w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-527x790.jpg 527w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-375x562.jpg 375w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-214x321.jpg 214w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-300x450.jpg 300w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-600x900.jpg 600w"
                      sizes="(max-width: 1080px) 100vw, 1080px"
                    />
                  </span>
                  <span className="kgall-desc">Tailored Wedding Suits</span>
                </a>
              </motion.div>

              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/tailored_wedding_suits/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="1310"
                      height="861"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/Tailored_wedding_in_hoi_an-5.jpg"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt=""
                      srcSet="https://adongsilk.com/wp-content/uploads/2024/03/Tailored_wedding_in_hoi_an-5.jpg 1310w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored_wedding_in_hoi_an-5-300x197.jpg 300w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored_wedding_in_hoi_an-5-1024x673.jpg 1024w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored_wedding_in_hoi_an-5-768x505.jpg 768w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored_wedding_in_hoi_an-5-1202x790.jpg 1202w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored_wedding_in_hoi_an-5-488x321.jpg 488w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored_wedding_in_hoi_an-5-216x142.jpg 216w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored_wedding_in_hoi_an-5-600x394.jpg 600w"
                      sizes="(max-width: 1310px) 100vw, 1310px"
                    />
                  </span>
                  <span className="kgall-desc">
                    Wedding Dress &amp; Wedding Suits
                  </span>
                </a>
              </motion.div>

              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/tailored-wedding-suits/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="683"
                      height="1024"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/ADS_Wedding-Dress-4.jpg"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt=""
                      srcSet="https://adongsilk.com/wp-content/uploads/2024/03/ADS_Wedding-Dress-4.jpg 683w, https://adongsilk.com/wp-content/uploads/2024/03/ADS_Wedding-Dress-4-200x300.jpg 200w, https://adongsilk.com/wp-content/uploads/2024/03/ADS_Wedding-Dress-4-527x790.jpg 527w, https://adongsilk.com/wp-content/uploads/2024/03/ADS_Wedding-Dress-4-375x562.jpg 375w, https://adongsilk.com/wp-content/uploads/2024/03/ADS_Wedding-Dress-4-214x321.jpg 214w, https://adongsilk.com/wp-content/uploads/2024/03/ADS_Wedding-Dress-4-300x450.jpg 300w, https://adongsilk.com/wp-content/uploads/2024/03/ADS_Wedding-Dress-4-600x900.jpg 600w"
                      sizes="(max-width: 683px) 100vw, 683px"
                    />
                  </span>
                  <span className="kgall-desc">Tailored Wedding Suits</span>
                </a>
              </motion.div>

              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/online_tailored_wedding_suits_01/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="2560"
                      height="1706"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-3-scaled.jpg"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt=""
                      srcSet="https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-3-scaled.jpg 2560w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-3-300x200.jpg 300w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-3-1024x683.jpg 1024w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-3-768x512.jpg 768w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-3-1536x1024.jpg 1536w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-3-2048x1365.jpg 2048w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-3-1185x790.jpg 1185w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-3-488x325.jpg 488w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-3-216x144.jpg 216w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-3-600x400.jpg 600w"
                      sizes="(max-width: 2560px) 100vw, 2560px"
                    />
                  </span>
                  <span className="kgall-desc">
                    Online Tailored Wedding Suits
                  </span>
                </a>
              </motion.div>

              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/tailored-wedding-suits_05/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="1440"
                      height="1800"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-Suits-in-Hoi-An-1-2.jpg"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt="Tailored-wedding-suits-in-hoi-an"
                      srcSet="https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-Suits-in-Hoi-An-1-2.jpg 1440w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-Suits-in-Hoi-An-1-2-240x300.jpg 240w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-Suits-in-Hoi-An-1-2-819x1024.jpg 819w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-Suits-in-Hoi-An-1-2-768x960.jpg 768w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-Suits-in-Hoi-An-1-2-1229x1536.jpg 1229w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-Suits-in-Hoi-An-1-2-632x790.jpg 632w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-Suits-in-Hoi-An-1-2-450x562.jpg 450w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-Suits-in-Hoi-An-1-2-216x270.jpg 216w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-Suits-in-Hoi-An-1-2-300x375.jpg 300w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-Suits-in-Hoi-An-1-2-600x750.jpg 600w"
                      sizes="(max-width: 1440px) 100vw, 1440px"
                    />
                  </span>
                  <span className="kgall-desc">Tailored Wedding Suits</span>
                </a>
              </motion.div>

              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/linen-wedding-suits-in-hoi-an/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="1280"
                      height="852"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-1-4.jpg"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt=""
                      srcSet="https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-1-4.jpg 1280w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-1-4-300x200.jpg 300w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-1-4-1024x682.jpg 1024w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-1-4-768x511.jpg 768w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-1-4-1187x790.jpg 1187w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-1-4-488x325.jpg 488w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-1-4-216x144.jpg 216w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-1-4-600x399.jpg 600w"
                      sizes="(max-width: 1280px) 100vw, 1280px"
                    />
                  </span>
                  <span className="kgall-desc">Linen Wedding Suits</span>
                </a>
              </motion.div>

              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/wedding-suit/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="861"
                      height="1289"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/Hoi-An-Tailored-Wedding-Suits-3.jpg"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt=""
                      srcSet="https://adongsilk.com/wp-content/uploads/2024/03/Hoi-An-Tailored-Wedding-Suits-3.jpg 861w, https://adongsilk.com/wp-content/uploads/2024/03/Hoi-An-Tailored-Wedding-Suits-3-200x300.jpg 200w, https://adongsilk.com/wp-content/uploads/2024/03/Hoi-An-Tailored-Wedding-Suits-3-684x1024.jpg 684w, https://adongsilk.com/wp-content/uploads/2024/03/Hoi-An-Tailored-Wedding-Suits-3-768x1150.jpg 768w, https://adongsilk.com/wp-content/uploads/2024/03/Hoi-An-Tailored-Wedding-Suits-3-528x790.jpg 528w, https://adongsilk.com/wp-content/uploads/2024/03/Hoi-An-Tailored-Wedding-Suits-3-375x562.jpg 375w, https://adongsilk.com/wp-content/uploads/2024/03/Hoi-An-Tailored-Wedding-Suits-3-214x321.jpg 214w, https://adongsilk.com/wp-content/uploads/2024/03/Hoi-An-Tailored-Wedding-Suits-3-300x449.jpg 300w, https://adongsilk.com/wp-content/uploads/2024/03/Hoi-An-Tailored-Wedding-Suits-3-600x898.jpg 600w"
                      sizes="(max-width: 861px) 100vw, 861px"
                    />
                  </span>
                  <span className="kgall-desc">Wedding Suit</span>
                </a>
              </motion.div>

              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/tailored-wedding-suits-in-hoi-an-2/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="640"
                      height="800"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/tailored-suits-in-hoi-an-1.jpg"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt=""
                      srcSet="https://adongsilk.com/wp-content/uploads/2024/03/tailored-suits-in-hoi-an-1.jpg 640w, https://adongsilk.com/wp-content/uploads/2024/03/tailored-suits-in-hoi-an-1-240x300.jpg 240w, https://adongsilk.com/wp-content/uploads/2024/03/tailored-suits-in-hoi-an-1-632x790.jpg 632w, https://adongsilk.com/wp-content/uploads/2024/03/tailored-suits-in-hoi-an-1-450x562.jpg 450w, https://adongsilk.com/wp-content/uploads/2024/03/tailored-suits-in-hoi-an-1-216x270.jpg 216w, https://adongsilk.com/wp-content/uploads/2024/03/tailored-suits-in-hoi-an-1-300x375.jpg 300w, https://adongsilk.com/wp-content/uploads/2024/03/tailored-suits-in-hoi-an-1-600x750.jpg 600w"
                      sizes="(max-width: 640px) 100vw, 640px"
                    />
                  </span>
                  <span className="kgall-desc">
                    Tailored Wedding Suits in Hoi An
                  </span>
                </a>
              </motion.div>

              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/tailored-wedding-suit-dress-in-hoi-an/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="1080"
                      height="1080"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/wedding-suit-in-hoi-an-2.jpg"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt=""
                      srcSet="https://adongsilk.com/wp-content/uploads/2024/03/wedding-suit-in-hoi-an-2.jpg 1080w, https://adongsilk.com/wp-content/uploads/2024/03/wedding-suit-in-hoi-an-2-300x300.jpg 300w, https://adongsilk.com/wp-content/uploads/2024/03/wedding-suit-in-hoi-an-2-1024x1024.jpg 1024w, https://adongsilk.com/wp-content/uploads/2024/03/wedding-suit-in-hoi-an-2-150x150.jpg 150w, https://adongsilk.com/wp-content/uploads/2024/03/wedding-suit-in-hoi-an-2-768x768.jpg 768w, https://adongsilk.com/wp-content/uploads/2024/03/wedding-suit-in-hoi-an-2-790x790.jpg 790w, https://adongsilk.com/wp-content/uploads/2024/03/wedding-suit-in-hoi-an-2-488x488.jpg 488w, https://adongsilk.com/wp-content/uploads/2024/03/wedding-suit-in-hoi-an-2-216x216.jpg 216w, https://adongsilk.com/wp-content/uploads/2024/03/wedding-suit-in-hoi-an-2-600x600.jpg 600w, https://adongsilk.com/wp-content/uploads/2024/03/wedding-suit-in-hoi-an-2-100x100.jpg 100w"
                      sizes="(max-width: 1080px) 100vw, 1080px"
                    />
                  </span>
                  <span className="kgall-desc">
                    Tailored Wedding Suit &amp; Dress
                  </span>
                </a>
              </motion.div>

              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/wedding-dress-ms06/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="235"
                      height="245"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/Rectangle-120.png"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt=""
                      srcSet="https://adongsilk.com/wp-content/uploads/2024/03/Rectangle-120.png 235w, https://adongsilk.com/wp-content/uploads/2024/03/Rectangle-120-216x225.png 216w"
                      sizes="(max-width: 235px) 100vw, 235px"
                    />
                  </span>
                  <span className="kgall-desc">Wedding dress mS06</span>
                </a>
              </motion.div>

              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/online-wedding-suits-02/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="2560"
                      height="1706"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-4-1-scaled.jpg"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt=""
                      srcSet="https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-4-1-scaled.jpg 2560w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-4-1-300x200.jpg 300w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-4-1-1024x683.jpg 1024w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-4-1-768x512.jpg 768w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-4-1-1536x1024.jpg 1536w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-4-1-2048x1365.jpg 2048w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-4-1-1185x790.jpg 1185w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-4-1-488x325.jpg 488w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-4-1-216x144.jpg 216w, https://adongsilk.com/wp-content/uploads/2024/03/Online-Tailored-Wedding-Suits-4-1-600x400.jpg 600w"
                      sizes="(max-width: 2560px) 100vw, 2560px"
                    />
                  </span>
                  <span className="kgall-desc">Online Wedding Suits</span>
                </a>
              </motion.div>

              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/wedding-dress-ms04/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="230"
                      height="243"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/Rectangle-180.png"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt=""
                      srcSet="https://adongsilk.com/wp-content/uploads/2024/03/Rectangle-180.png 230w, https://adongsilk.com/wp-content/uploads/2024/03/Rectangle-180-216x228.png 216w"
                      sizes="(max-width: 230px) 100vw, 230px"
                    />
                  </span>
                  <span className="kgall-desc">Wedding dress mS04</span>
                </a>
              </motion.div>

              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/wedding-dress-ms02/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="193"
                      height="243"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/Rectangle-183.png"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt=""
                    />
                  </span>
                  <span className="kgall-desc">Wedding dress mS02</span>
                </a>
              </motion.div>

              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/tailored-wedding-suits-in-hoi-an/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="2560"
                      height="1708"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/0698KirstieandMichael-scaled.jpg"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt="tailored-wedding-suits-in-hoi-an"
                      srcSet="https://adongsilk.com/wp-content/uploads/2024/03/0698KirstieandMichael-scaled.jpg 2560w, https://adongsilk.com/wp-content/uploads/2024/03/0698KirstieandMichael-300x200.jpg 300w, https://adongsilk.com/wp-content/uploads/2024/03/0698KirstieandMichael-1024x683.jpg 1024w, https://adongsilk.com/wp-content/uploads/2024/03/0698KirstieandMichael-768x512.jpg 768w, https://adongsilk.com/wp-content/uploads/2024/03/0698KirstieandMichael-1536x1025.jpg 1536w, https://adongsilk.com/wp-content/uploads/2024/03/0698KirstieandMichael-2048x1366.jpg 2048w, https://adongsilk.com/wp-content/uploads/2024/03/0698KirstieandMichael-1184x790.jpg 1184w, https://adongsilk.com/wp-content/uploads/2024/03/0698KirstieandMichael-488x325.jpg 488w, https://adongsilk.com/wp-content/uploads/2024/03/0698KirstieandMichael-216x144.jpg 216w, https://adongsilk.com/wp-content/uploads/2024/03/0698KirstieandMichael-600x400.jpg 600w"
                      sizes="(max-width: 2560px) 100vw, 2560px"
                    />
                  </span>
                  <span className="kgall-desc">Tailored Wedding Suits</span>
                </a>
              </motion.div>

              <motion.div
                className="kgall-item"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <a
                  // href="https://adongsilk.com/gallery-detail/tailored-wedding-suits-08/"
                  // className="kgall-box"
                >
                  <span className="kgall-img">
                    <img
                      width="1440"
                      height="1800"
                      src="https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-15.jpg"
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      alt=""
                      srcSet="https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-15.jpg 1440w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-15-240x300.jpg 240w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-15-819x1024.jpg 819w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-15-768x960.jpg 768w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-15-1229x1536.jpg 1229w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-15-632x790.jpg 632w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-15-450x562.jpg 450w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-15-216x270.jpg 216w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-15-300x375.jpg 300w, https://adongsilk.com/wp-content/uploads/2024/03/Tailored-wedding-suits-in-hoi-an-15-600x750.jpg 600w"
                      sizes="(max-width: 1440px) 100vw, 1440px"
                    />
                  </span>
                  <span className="kgall-desc">Tailored Wedding Suits</span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
