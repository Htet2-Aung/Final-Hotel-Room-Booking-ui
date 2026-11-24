import classes from "./Deposite.module.css"
import BookingSteps from "../pages/BookingSteps";
import BookingSuccess from "./BookingSuccess";
import { useState } from "react";
import BackDrop from "../pages/BackDrop";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPayment, register } from "./paymentSlice";
import { getAllBookings } from "../Booking/bookingSlice";
import { getToken } from "../../features/auth/authSlice";
import { Link, Navigate } from "react-router-dom";
import cbpayLogo from "../images/cbpay.svg";
import wavepayLogo from "../images/wave.jpeg";
import kbzpayLogo from "../images/kbz.png";
import onepayLogo from "../images/onepay.png";

const WALLET_OPTIONS = [
  { name: "CB Pay", logo: cbpayLogo },
  { name: "Wave Pay", logo: wavepayLogo },
  { name: "KBZ Pay", logo: kbzpayLogo },
  { name: "Onepay", logo: onepayLogo },
];

const Deposite = () => {
 
  const [holderName, setHoldername] = useState("");
  const [cardNo, setCardnumber] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardType, setCardtype] = useState("");
  const [registerRequestStatus, setRegisterRequestStatus] = useState("idle");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const isWallet = paymentMethod === "wallet";

  const onHoldernameChange = (e) => setHoldername(e.target.value);
  // digits only — card numbers / wallet phones are identifiers, not quantities
  const onCardNumberChange = (e) => setCardnumber(e.target.value.replace(/\D/g, ""));
  // CVC is 3–4 digits, card payments only
  const onCvcChange = (e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4));
  const onCardTypeChange = (e) => setCardtype(e.target.value);

  const onPaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setHoldername("");
    setCardnumber("");
    setCvc("");
    setCardtype("");
  };

  const token = useSelector(getToken);

  const totalPayment = useSelector(getTotalPayment);

  const total = totalPayment.total

  //for booking
  const booking = useSelector(getAllBookings)
  let finalbook;

  if(booking.length === 0){
    finalbook = booking
  }else{
    finalbook = booking[booking.length -1]
  }
 const bookingId = Number(finalbook.id)

   const invoiceNo = String('RO-000'+bookingId)

  // CVC is required for card payments only (3–4 digits); wallets don't have one
  const cvcValid = /^\d{3,4}$/.test(cvc);
  const canCreate =
    [total, holderName, cardNo, cardType, invoiceNo].every(Boolean) &&
    (isWallet || cvcValid) &&
    registerRequestStatus === "idle";

  const dispatch = useDispatch();

 

  const cardbody1 = `${classes.card}`;
  const cardbody2 = ` text-center ${classes.smallcard}`;
  const text2 = `text-center`;

  const [isBookingsuccess, setBookingsuccess] = useState(false);

  async function successHandler(e) {
    e.preventDefault();
    if (canCreate) {
      setRegisterRequestStatus("pending");

      try {
        const payment = {
          total,
          invoiceNo,
          holderName,
          cardNo,
          cvc: isWallet ? null : cvc,
          cardType,
        };
        await dispatch(
          register({ payment, bookingId, token })
        ).unwrap();

        setHoldername("");
        setCardnumber("");
        setCvc("");
        setCardtype("");

        setBookingsuccess(true);
      } catch (error) {
        console.error("Payment failed:", error);
      } finally {
        setRegisterRequestStatus("idle");
      }
    }
  }

  function closeHandler() {
    setBookingsuccess(false);
  }

  if (!totalPayment || !totalPayment.total) {
    return <Navigate to="/payment" replace />;
  }

  return (
    <section>
      <BookingSteps current={3} />
      <div className="row">
        <div className="col-md-12 col-sm-12">
          <div className={cardbody1}>
            <div className="row text-center">
            <div> 
          {/* className={classes.loader}  */}
          <div className="justify-content-center jimu-primary-loading"></div>
          </div>
              
                  <label className={classes.header1} style={{color: "var(--hotel-secondary)"}}>Proceeding with Payment</label>
                
             
            </div>
            <div>
              <div className={text2}>
                <small className="text-muted ">Amount Due</small>

                <div>
                  <h1 className={classes.text} style={{color: "var(--hotel-secondary)"}} >{Number(total || 0).toLocaleString("en-US")} <small style={{ fontSize: "0.4em" }}>MMK</small></h1>
                </div>
              </div>
            </div>
            <div className={cardbody2}>
              <form>
                <div className={classes.methodTabs}>
                  <button
                    type="button"
                    className={`${classes.methodTab} ${!isWallet ? classes.activeMethod : ""}`}
                    onClick={() => onPaymentMethodChange("card")}
                  >
                    <i className="fas fa-credit-card me-2"></i>Card
                  </button>
                  <button
                    type="button"
                    className={`${classes.methodTab} ${isWallet ? classes.activeMethod : ""}`}
                    onClick={() => onPaymentMethodChange("wallet")}
                  >
                    <i className="fas fa-wallet me-2"></i>Mobile Wallet
                  </button>
                </div>
                <div className="form-group">
                  <label className="d-flex flex-row justify-content-between ">
                    <h6>
                      <b>{isWallet ? "Account Name" : "Cardholder Name"}</b>
                    </h6>
                    <div>
                      <small className="ml-auto text-muted">(required)</small>
                    </div>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="holderName"
                    onChange={onHoldernameChange}
                    value={holderName}
                  />
                  {isWallet && (
                    <div className="mt-4">
                      <label className="d-flex flex-row justify-content-between">
                        <h6>
                          <b>Select Wallet</b>
                        </h6>
                        <div>
                          <small className="ml-auto text-muted">(required)</small>
                        </div>
                      </label>
                      <div className={classes.walletGrid}>
                        {WALLET_OPTIONS.map((wallet) => (
                          <button
                            key={wallet.name}
                            type="button"
                            className={`${classes.walletOption} ${cardType === wallet.name ? classes.selectedWallet : ""}`}
                            onClick={() => setCardtype(wallet.name)}
                          >
                            <img
                              src={wallet.logo}
                              alt={wallet.name}
                              className={classes.walletLogo}
                            />
                            <span>{wallet.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <label
                      className="d-flex flex-row justify-content-between"
                      htmlFor="cardNo"
                    >
                      <h6>
                        <b>{isWallet ? "Wallet Phone Number" : "Card Number"}</b>
                      </h6>
                      <div>
                        <small className="ml-auto text-muted">(required)</small>
                      </div>
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      className="form-control"
                      id="cardNo"
                      placeholder={isWallet ? "e.g. 09790123456" : "e.g. 4242424242424242"}
                      onChange={onCardNumberChange}
                      value={cardNo}
                      maxLength={isWallet ? 11 : 19}
                      autoComplete="cc-number"
                    />
                  </div>
                  {!isWallet && (
                  <div className="mt-3">
                    <label
                      className=" d-flex flex-row justify-content-between"
                      htmlFor="cvc"
                    >
                      <h6>
                        <b>CVC</b>{" "}
                      </h6>
                      <div>
                        <small className="ml-auto text-muted">(required)</small>
                      </div>
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      className="form-control"
                      id="cvc"
                      placeholder="e.g. 123"
                      maxLength={4}
                      value={cvc}
                      onChange={onCvcChange}
                      autoComplete="cc-csc"
                    />
                  </div>
                  )}
                  {!isWallet && (
                  <div className="mt-3">
                    <label className=" d-flex flex-row justify-content-between">
                      <h6>
                        <b>Card Type</b>{" "}
                      </h6>
                      <div>
                        <small className="ml-auto text-muted">(required)</small>
                      </div>
                    </label>
                    <select required className="form-select" value={cardType} onChange={onCardTypeChange}>
                  <option value="">Choose Your Card Type</option>
                  <option value="Master Card">Master Card</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="MPU Card">MPU Card</option>
                  <option value="Visa Card">Visa Card</option>
                </select>
                  </div>
                  )}
                  <Link to="/payment" className="btn btn-outline-secondary mt-4 mb-2 me-2">
                    <i className="fas fa-arrow-left me-1"></i>Back
                  </Link>
                  <button
                    type="submit"
                    className={`btn btn-theme text-light mt-4 mb-2 ${classes.payBtn}`}
                    onClick={successHandler}
                    disabled={!canCreate}

                  >
                    <i className="fas fa-lock me-1"></i>Deposit
                  </button>
                  {isBookingsuccess && <BookingSuccess />}
                  {isBookingsuccess && <BackDrop onDrop={closeHandler} />}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Deposite;
