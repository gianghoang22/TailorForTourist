import React from 'react';
import './OrderReceive.scss';
import { Navigation } from '../../../layouts/components/navigation/Navigation';
import { Footer } from '../../../layouts/components/footer/Footer';

const OrderReceive = () => {
  
  // Function to handle the date
  const formatDate = () => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <>
    <Navigation/>
      <div id='order-received' className="page-with-side-bar">
        <div className="all">
          <div className="left-side">
            <div className="sec-title">
              <h1 className="tt-txt">
                <span className="tt-sub">Checkout</span>
                A Dong Silk
              </h1>
            </div>
          </div>

          <div className="right-main">
            <div className="woocommerce">
              <div className="woocommerce-order">
                <p className="woocommerce-notice woocommerce-notice--success woocommerce-thankyou-order-received">
                  Thank you. Your order has been received.
                </p>

                <ul className="woocommerce-order-overview woocommerce-thankyou-order-details order_details">
                  <li className="woocommerce-order-overview__order order">
                    Order number: <strong>32925</strong>
                  </li>

                  <li className="woocommerce-order-overview__date date">
                    Date: <strong>{formatDate()}</strong>
                  </li>

                  <li className="woocommerce-order-overview__total total">
                    Total:{" "}
                    <strong>
                      <span className="woocommerce-Price-amount amount">
                        270.00&nbsp;
                        <span className="woocommerce-Price-currencySymbol">
                          USD
                        </span>
                      </span>
                    </strong>
                  </li>

                  <li className="woocommerce-order-overview__payment-method method">
                    Payment method: <strong>Paypal</strong>
                  </li>
                </ul>

                <p>Paypal</p>

                <section className="woocommerce-order-details">
                  <h2 className="woocommerce-order-details__title">Order details</h2>

                  <table className="woocommerce-table woocommerce-table--order-details shop_table order_details">
                    <thead>
                      <tr>
                        <th className="woocommerce-table__product-name product-name">
                          Product
                        </th>
                        <th className="woocommerce-table__product-table product-total">
                          Total
                        </th>
                        <th className="woocommerce-table__product-info"></th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="woocommerce-table__line-item order_item">
                        <td className="woocommerce-table__product-name product-name">
                          <a href="https://adongsilk.com/product/1176-suit-12/">
                            1176 - suit
                          </a>{" "}
                          <strong className="product-quantity">× 1</strong>
                        </td>

                        <td className="woocommerce-table__product-total product-total">
                          <span className="woocommerce-Price-amount amount">
                            270.00&nbsp;
                            <span className="woocommerce-Price-currencySymbol">
                              USD
                            </span>
                          </span>
                        </td>

                        <td className="product-info">
                          <a
                            href="javascript:;"
                            data-id="32924"
                            className="btn mona-view-product-info"
                          >
                            View Info
                          </a>
                        </td>
                      </tr>
                    </tbody>

                    <tfoot>
                      <tr>
                        <th scope="row">Subtotal:</th>
                        <td colSpan="2">
                          <span className="woocommerce-Price-amount amount">
                            270.00&nbsp;
                            <span className="woocommerce-Price-currencySymbol">
                              USD
                            </span>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Payment method:</th>
                        <td colSpan="2">Paypal</td>
                      </tr>
                      <tr>
                        <th scope="row">Total:</th>
                        <td colSpan="2">
                          <span className="woocommerce-Price-amount amount">
                            270.00&nbsp;
                            <span className="woocommerce-Price-currencySymbol">
                              USD
                            </span>
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default OrderReceive;
