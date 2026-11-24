import { Link } from "react-router-dom"
import classes from "./Footer.module.css"
import cbpayLogo from "../images/cbpay.svg"
import wavepayLogo from "../images/wave.jpeg"
import kbzpayLogo from "../images/kbz.png"
import onepayLogo from "../images/onepay.png"

const Footer = () => {
    const footer = `row ${classes.footer}`

  return (
    <section className={classes.last}>

        <div className={footer}>
            <div className="col-md-4 col-sm-12">
                <h6 style={{fontWeight: "bold"}}>ABOUT </h6>
                <p className={classes.about}>Relax Oasis Hotel — easy room booking at the best price.</p>
                <p className={classes.about}><i className="fas fa-envelope"></i> relax.oasis.myanmar@gmail.com</p>
            </div>
            <div className="col-md-4 col-sm-12">
            <h6>HELP</h6>
            <Link to="/find-your"><p>Find/Print Your Booking</p></Link>
            <Link to="/frequently-asked-questions"><p>FAQs</p></Link>
            <Link to="contact-us"><p>Contact Us</p></Link>

            </div>
            <div className="col-md-4 col-sm-12">
            <h6 style={{fontWeight: "bold"}}>WE ACCEPT</h6>
            <div className={classes.payRow}>

            <i className={`fab fa-cc-visa ${classes.payIcon}`} title="Visa Card"></i>
            <i className={`fab fa-cc-mastercard ${classes.payIcon}`} title="Master Card"></i>
            <i className={`fas fa-credit-card ${classes.payIcon}`} title="Credit Card"></i>
            <span className={classes.mpuBadge} title="MPU Card">MPU</span>
            <img src={cbpayLogo} alt="CB Pay" title="CB Pay" className={classes.walletIcon} />
            <img src={wavepayLogo} alt="Wave Pay" title="Wave Pay" className={classes.walletIcon} />
            <img src={kbzpayLogo} alt="KBZ Pay" title="KBZ Pay" className={classes.walletIcon} />
            <img src={onepayLogo} alt="Onepay" title="Onepay" className={classes.walletIcon} />

          </div>
          <p className={classes.payNote}>Visa, Master, Credit and MPU Cards, plus CB Pay, Wave Pay, KBZ Pay and Onepay mobile wallets, are accepted at checkout.</p>
        </div>
        </div>
    </section>
  )
}

export default Footer
