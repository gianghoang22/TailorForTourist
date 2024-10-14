import 'bootstrap/dist/css/bootstrap.min.css';
import '../footer/Footer.scss';


export const Footer = () => {
  return (
    <>
        {/* Address link */}
    <div className="sec sec-ftlinks">
    <div className="decor-sec">
        <img src="https://adongsilk.com/template/images/review-decor.png" alt="" />
    </div>
    <div className="all">
        <div className="ft-infos-row">
            <article className='info-item'>
                <div id="nav_menu-2" className="widget_nav_menu">
                    <h3 className='ft-tt'>POLICIES</h3>
                    <div className="menu-ft1-container">
                        <ul id='menu-ft1' className='menu'>
                            <li id='menu-item' className='menu-item menu-item-type-post_type menu-item-object-page menu-item'>
                                <a href="#">Term of use</a>
                            </li>
                            <li id='menu-item-58' className='menu-item menu-item-type-post_type menu-item-object-page menu-item'>
                                <a href="#">Privacy policy</a>
                            </li>
                            <li id='menu-item' className='menu-item menu-item-type-post_type menu-item-object-page menu-item'>
                                <a href="#">Shipping policy</a>
                            </li>
                            <li id='menu-item' className='menu-item menu-item-type-post_type menu-item-object-page menu-item'>
                                <a href="#">Payment policy</a>
                            </li>
                            <li id='menu-item' className='menu-item menu-item-type-post_type menu-item-object-page menu-item'>
                                <a href="#">Warranty policy</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </article>
            <article className='info-item'>
                <div id="nav_menu-3" className="widget_nav_menu">
                    <h3 className='ft-tt'>QUESTIONS</h3>
                    <div className="menu-ft2-container">
                        <ul id='menu-ft2' className='menu'>
                            <li id='menu-item' className='menu-item menu-item-type-post_type menu-item-object-page menu-item'>
                                <a href="#">FAQS</a>
                            </li>
                            <li id='menu-item' className='menu-item menu-item-type-post_type menu-item-object-page menu-item'>
                                <a href="#">RESELLER</a>
                            </li>
                            <li id='menu-item' className='menu-item menu-item-type-post_type menu-item-object-page menu-item'>
                                <a href="#">How to order</a>
                            </li>
                            <li id='menu-item' className='menu-item menu-item-type-post_type menu-item-object-page menu-item'>
                                <a href="#">How to measure</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </article>
            <article className='info-item'>
                <div id="nav_menu-4" className="widget_nav_menu">
                    <h3 className='ft-tt'>EXPERIENCES</h3>
                    <div className="menu-ft3-container">
                        <ul id='menu-ft3' className='menu'>
                            <li id='menu-item' className='menu-item menu-item-type-post_type menu-item-object-page menu-item'>
                                <a href="#">blog</a>
                            </li>
                            <li id='menu-item' className='menu-item menu-item-type-post_type menu-item-object-page menu-item'>
                                <a href="#">tip for custom tailor</a>
                            </li>
                            <li id='menu-item' className='menu-item menu-item-type-post_type menu-item-object-page menu-item'>
                                <a href="#">Customer Review</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </article>
            <article className='info-item'>
                <div id="text-2" className="widget_text">
                    <h3 className="ft-tt">RECEIVE OUR NEWSLETTER</h3>
                        <div className="textwidget">
                            <form action="/#wpcf7-f60-p5-o1" method="post" className="wpcf7-form" noValidate>
                                <div className="nlt-ip">
                                    <span className="wpcf7-form-control-wrap email-452">
            <input 
                type="email" 
                name="email-452" 
                size="40" 
                className="wpcf7-form-control wpcf7-text wpcf7-email wpcf7-validates-as-required wpcf7-validates-as-email fcontrol" 
                aria-required="true" 
                aria-invalid="false" 
                placeholder="Your email" 
            />
        </span>
        {/* <label className="btn">
            <i className="fa fa-paper-plane-o"></i>
            <input 
                type="submit" 
                value="send" 
                className="wpcf7-form-control wpcf7-submit mona-hiden" 
            />
            <span className="ajax-loader"></span>
        </label> */}
    </div>
</form>
</div>
                </div>
                <div id="mona_social-2" className="social_info">
                    <h3 className='ft-tt'>FOLLOW US</h3>
                    <div className="mona-social-info-widget-wrapper">
                        <ul className='sns-ul'>
                            {/* cho nay gan logo */}
                            <li>
                                {/* <a target="_blank" href='#'>
                                <FontAwesomeIcon icon={faTripadvisor} />
                                </a> */}
                            </li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                </div>
            </article>
        </div>
    </div>


    <div className='footer'>
        <div className="ft-inner">
            <div className="all">
                <div id="mona_contact-2" className="Mona_contact">
                    <h3 className='lbl'>
                        <div className="ft-right-cont">
                            <h4></h4>
                            <div className="ft-right-it">
                                <p className='lb'>
                                    <i className='fa fa-map-marker'></i>
                                    ADDRESS:
                                </p>
                                <p>62 Tran Hung Dao St., - 40 Le Loi St., Hoi An City, Quang Nam Province, Vietnam</p>
                            </div>
                            <div className="ft-right-it">
                                <p className='lb'>
                                    <i className='fa fa-email'></i>
                                    EMAIL:
                                </p>
                                <p>infor@fpt.edu.vn</p>
                            </div>
                            <div className="ft-right-it">
                                <p className='lb'>
                                    <i className='fa fa-phone'></i>
                                    PHONE:
                                </p>
                                <p>
                                    <a href="tel:(+84)0123456789">(+84) 123 456 789</a>
                                </p>
                            </div>
                        </div>
                    </h3>
                </div>
            </div>
        </div>
        {/* <div className="sys ceter-txt">
            <div className="all">
                <div className="coppyright">
                    <p>�� All rights reserved.</p>
                </div>
            </div>
        </div> */}
    </div>

</div>

</>
  )
}
