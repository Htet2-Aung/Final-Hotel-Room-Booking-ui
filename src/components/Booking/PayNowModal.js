import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./PayNowModal.module.css";
import { register } from "../Payment/paymentSlice";
import { getToken } from "../../features/auth/authSlice";
import { computeBookingTotals } from "./bookingTotals";
import kbzpayLogo from "../images/kbz.png";
import wavepayLogo from "../images/wave.jpeg";
import visaLogo from "../images/visa.png";
import mastercardLogo from "../images/mastercard.png";

const BOOKING_WITH_ROOM_URL =
  "http://localhost:8181/api/bookingRoom/bookingWithRoom/";

const WALLET_OPTIONS = [
  { name: "KBZ Pay", label: "KPay", logo: kbzpayLogo },
  { name: "Wave Pay", label: "Wave Pay", logo: wavepayLogo },
];

// card payment options (same card types as the checkout deposit form)
const CARD_OPTIONS = [
  { name: "Visa Card", logo: visaLogo },
  { name: "Master Card", logo: mastercardLogo },
  { name: "Credit Card", icon: "fas fa-credit-card" },
  { name: "MPU Card", icon: "fas fa-id-card" },
];

// Manual KPay/Wave flow (Method B): the customer scans the merchant QR with
// their wallet app, transfers the total, then submits the transaction ID
// (last 6 digits) or a slip photo as proof. Replace the numbers below with
// the hotel's real wallet accounts and drop the QR images into public/img/
// (kpay-qr.png and wavepay-qr.png).
const MERCHANT_WALLETS = {
  "KBZ Pay": { phone: "09790000000", qr: "/img/kpay-qr.png" },
  "Wave Pay": { phone: "09960000000", qr: "/img/wavepay-qr.png" },
};
const MAX_SLIP_BYTES = 2 * 1024 * 1024; // 2 MB

const money = (value) => `${Number(value || 0).toLocaleString("en-US")} MMK`;

/**
 * "Pay Now" dialog for an unpaid booking on the Your Bookings page.
 * Lets the customer settle the booking with a mobile wallet (KPay / Wave Pay)
 * or a card (Visa / Master / Credit / MPU).
 *
 * Props:
 *  - booking (required) the unpaid booking entity
 *  - onClose (required) called on Cancel / backdrop click
 *  - onPaid  (required) called after the payment succeeded (parent should refresh)
 */
const PayNowModal = ({ booking, onClose, onPaid }) => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);

  const [rooms, setRooms] = useState([]);
  const [fetchState, setFetchState] = useState("loading"); // loading | succeeded | failed
  const [paymentMethod, setPaymentMethod] = useState("wallet"); // wallet | card
  const [wallet, setWallet] = useState("KBZ Pay");
  const [cardType, setCardType] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [cvc, setCvc] = useState("");
  const [holderName, setHolderName] = useState(booking?.guestName ?? "");
  const [transactionId, setTransactionId] = useState("");
  const [txnTouched, setTxnTouched] = useState(false);
  const [slip, setSlip] = useState(null); // { name, dataUrl }
  const [slipError, setSlipError] = useState("");
  const [qrFailed, setQrFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadRooms = async () => {
      try {
        const response = await fetch(`${BOOKING_WITH_ROOM_URL}${booking.id}`);
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        const data = await response.json();
        if (!cancelled) {
          setRooms(data?.rooms ?? []);
          setFetchState("succeeded");
        }
      } catch (err) {
        if (!cancelled) {
          setFetchState("failed");
        }
      }
    };
    loadRooms();
    return () => {
      cancelled = true;
    };
  }, [booking.id]);

  const totals = useMemo(
    () => computeBookingTotals(booking, rooms),
    [booking, rooms]
  );

  const invoiceNo = `RO-000${booking.id}`;
  const isCard = paymentMethod === "card";
  const txnValid = /^\d{6}$/.test(transactionId);
  const hasProof = txnValid || Boolean(slip);
  const cardNoValid = /^\d{12,19}$/.test(cardNo);
  const cvcValid = /^\d{3,4}$/.test(cvc);
  const payable =
    fetchState === "succeeded" && rooms.length > 0 && totals.total > 0;
  const canPay =
    payable &&
    holderName.trim() !== "" &&
    !submitting &&
    !paid &&
    (isCard ? cardType !== "" && cardNoValid && cvcValid : hasProof);

  const merchant = MERCHANT_WALLETS[wallet] ?? {};

  const slipHandler = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      return;
    }
    if (file.size > MAX_SLIP_BYTES) {
      setSlipError(
        "Slip image is too large (max 2 MB). Please upload a smaller screenshot."
      );
      return;
    }
    setSlipError("");
    const reader = new FileReader();
    reader.onload = () => setSlip({ name: file.name, dataUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const payHandler = async (e) => {
    e.preventDefault();
    if (!canPay) {
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await dispatch(
        register({
          payment: {
            total: totals.total,
            invoiceNo,
            holderName: holderName.trim(),
            cardType: isCard ? cardType : wallet,
            cardNo: isCard ? cardNo : null,
            cvc: isCard ? cvc : null,
            transactionId: !isCard && txnValid ? transactionId : null,
            slipImage: !isCard && slip ? slip.dataUrl : null,
          },
          bookingId: booking.id,
          token,
        })
      ).unwrap();
      setPaid(true);
    } catch (err) {
      setError("Payment failed. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const backdropHandler = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <div className={classes.overlay} onClick={backdropHandler}>
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        {paid ? (
          <>
            <div className={classes.successIcon}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h5 className={classes.title}>Payment Successful</h5>
            <p className={classes.subtitle}>
              {money(totals.total)} paid with {isCard ? cardType : wallet}.
              <br />
              Invoice No: <b>{invoiceNo}</b>
              {!isCard && txnValid && (
                <>
                  <br />
                  Transaction Ref: <b>&bull;&bull;&bull;{transactionId}</b>
                </>
              )}
            </p>
            <div className={classes.actions} style={{ justifyContent: "center" }}>
              <button type="button" className={classes.btn} onClick={onPaid}>
                Done
              </button>
            </div>
          </>
        ) : (
          <>
            <h5 className={classes.title}>Pay for Your Booking</h5>
            <p className={classes.subtitle}>
              Invoice No: <b>{invoiceNo}</b> &middot; {booking?.guestName}
            </p>

            {fetchState === "loading" && (
              <div className={classes.center}>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Loading room details...
              </div>
            )}

            {fetchState === "failed" && (
              <div className={classes.error}>
                Could not load the booking details. Please try again later.
              </div>
            )}

            {fetchState === "succeeded" && !payable && (
              <div className={classes.notice}>
                No rooms are attached to this booking yet, so the amount cannot
                be calculated here. Please contact the hotel to complete your
                payment.
              </div>
            )}

            {fetchState !== "loading" && !payable && (
              <div className={classes.actions} style={{ justifyContent: "center" }}>
                <button
                  type="button"
                  className={`${classes.btn} ${classes.btnAlt}`}
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            )}

            {payable && (
              <form onSubmit={payHandler}>
                <div className={classes.amountBox}>
                  <div className={classes.amountRow}>
                    <span>
                      Rooms ({totals.roomCount}) &times; {totals.nights} night
                      {totals.nights === 1 ? "" : "s"}
                    </span>
                    <span>{money(totals.roomPerNight * totals.nights)}</span>
                  </div>
                  {totals.extraAdults > 0 && (
                    <div className={classes.amountRow}>
                      <span>
                        Extra adults ({totals.extraAdults}) &times;{" "}
                        {totals.nights} night{totals.nights === 1 ? "" : "s"}
                      </span>
                      <span>
                        {money(totals.extraAdultPerNight * totals.nights)}
                      </span>
                    </div>
                  )}
                  <div className={classes.amountTotal}>
                    <span>Total</span>
                    <span>{money(totals.total)}</span>
                  </div>
                </div>

                <label className={classes.label}>Payment Method</label>
                <div className={classes.methodTabs}>
                  <button
                    type="button"
                    className={`${classes.methodTab} ${
                      !isCard ? classes.activeMethod : ""
                    }`}
                    onClick={() => setPaymentMethod("wallet")}
                  >
                    <i className="fas fa-wallet me-1"></i>Mobile Wallet
                  </button>
                  <button
                    type="button"
                    className={`${classes.methodTab} ${
                      isCard ? classes.activeMethod : ""
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <i className="fas fa-credit-card me-1"></i>Card
                  </button>
                </div>

                {!isCard && (
                  <>
                    <div className={classes.walletGrid}>
                      {WALLET_OPTIONS.map((option) => (
                        <button
                          key={option.name}
                          type="button"
                          className={`${classes.walletOption} ${
                            wallet === option.name ? classes.selectedWallet : ""
                          }`}
                          onClick={() => {
                            setWallet(option.name);
                            setQrFailed(false);
                          }}
                        >
                          <img
                            src={option.logo}
                            alt={option.name}
                            className={classes.walletLogo}
                          />
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className={classes.qrBox}>
                      {qrFailed ? (
                        <div className={classes.qrFallback}>
                          <i className="fas fa-qrcode"></i>
                          <div className={classes.qrPhone}>{merchant.phone}</div>
                          <small>Transfer to this {wallet} number</small>
                        </div>
                      ) : (
                        <img
                          src={`${process.env.PUBLIC_URL}${merchant.qr}`}
                          alt={`${wallet} merchant QR code`}
                          className={classes.qrImg}
                          onError={() => setQrFailed(true)}
                        />
                      )}
                      <div className={classes.qrHint}>
                        Scan with your <b>{wallet}</b> app and transfer{" "}
                        <b>{money(totals.total)}</b>
                        <br />
                        <small>Merchant account: {merchant.phone}</small>
                      </div>
                    </div>
                  </>
                )}

                {isCard && (
                  <>
                    <div className={classes.walletGrid}>
                      {CARD_OPTIONS.map((option) => (
                        <button
                          key={option.name}
                          type="button"
                          className={`${classes.walletOption} ${
                            cardType === option.name
                              ? classes.selectedWallet
                              : ""
                          }`}
                          onClick={() => setCardType(option.name)}
                        >
                          {option.logo ? (
                            <img
                              src={option.logo}
                              alt={option.name}
                              className={classes.walletLogo}
                            />
                          ) : (
                            <i
                              className={`${option.icon} ${classes.cardIcon}`}
                            ></i>
                          )}
                          <span>{option.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className={classes.field}>
                      <label className={classes.label} htmlFor="payCardNo">
                        Card Number
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        className="form-control"
                        id="payCardNo"
                        maxLength={19}
                        placeholder="e.g. 4242424242424242"
                        value={cardNo}
                        onChange={(e) =>
                          setCardNo(e.target.value.replace(/\D/g, "").slice(0, 19))
                        }
                        autoComplete="cc-number"
                      />
                    </div>

                    <div className={classes.field}>
                      <label className={classes.label} htmlFor="payCvc">
                        CVC
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        className="form-control"
                        id="payCvc"
                        maxLength={4}
                        placeholder="e.g. 123"
                        value={cvc}
                        onChange={(e) =>
                          setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        autoComplete="cc-csc"
                      />
                    </div>
                  </>
                )}

                <div className={classes.field}>
                  <label className={classes.label} htmlFor="payHolderName">
                    {isCard ? "Cardholder Name" : "Your Account Name"}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="payHolderName"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    placeholder={
                      isCard ? "Name on the card" : "Name on your wallet account"
                    }
                  />
                </div>

                {!isCard && (
                  <>
                <div className={classes.field}>
                  <label className={classes.label} htmlFor="payTxnId">
                    Transaction ID (last 6 digits)
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    className="form-control"
                    id="payTxnId"
                    maxLength={6}
                    value={transactionId}
                    onChange={(e) =>
                      setTransactionId(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    onBlur={() => setTxnTouched(true)}
                    placeholder="e.g. 123456"
                  />
                  {txnTouched && !txnValid && transactionId.length > 0 && (
                    <div className={classes.hint}>
                      Enter exactly the last 6 digits of your transaction ID.
                    </div>
                  )}
                </div>

                <div className={classes.orDivider}>
                  <span>or</span>
                </div>

                <div className={classes.field}>
                  <label className={classes.label} htmlFor="paySlip">
                    Upload Payment Slip
                  </label>
                  {slip ? (
                    <div className={classes.slipPreview}>
                      <img
                        src={slip.dataUrl}
                        alt="Payment slip"
                        className={classes.slipThumb}
                      />
                      <span className={classes.slipName}>{slip.name}</span>
                      <button
                        type="button"
                        className={classes.slipRemove}
                        onClick={() => setSlip(null)}
                        title="Remove slip"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      id="paySlip"
                      onChange={slipHandler}
                    />
                  )}
                  {slipError && <div className={classes.hint}>{slipError}</div>}
                  {!slipError && (
                    <div className={classes.proofHint}>
                      Provide the transaction ID <b>or</b> a slip screenshot as
                      proof of payment.
                    </div>
                  )}
                </div>
                  </>
                )}

                {error && <div className={classes.error}>{error}</div>}

                <div className={classes.actions}>
                  <button
                    type="button"
                    className={`${classes.btn} ${classes.btnAlt}`}
                    onClick={onClose}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={classes.btn} disabled={!canPay}>
                    {submitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-1"></i>
                        Processing...
                      </>
                    ) : (
                      <>Pay {money(totals.total)}</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PayNowModal;
