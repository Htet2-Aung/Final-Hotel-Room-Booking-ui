import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import BookingSteps from "../pages/BookingSteps";
import { getSelectedBooking } from "./bookingSlice";
import { getTotalPayment } from "../Payment/paymentSlice";
import { findRoomByselected, getFilteredDate } from "../Room/roomSlice";
import classes from "./BookingConfirmed.module.css";

const BookingConfirmed = () => {
  const guest = useSelector(getSelectedBooking);
  const totalPayment = useSelector(getTotalPayment);
  const selectedRooms = useSelector(findRoomByselected);
  const filteredDate = useSelector(getFilteredDate);

  const roomNames = selectedRooms.map((room) => room.roomType?.name ?? '-').join(", ");

  return (
    <section>
      <div className="container">
        <BookingSteps current={4} />
        <div className="row justify-content-center">
          <div className="col-md-8 col-sm-12">
            <div className={`card text-center ${classes.card}`}>
              <div className="card-body py-5">
                <div className={classes.checkCircle}>
                  <i className="fas fa-check"></i>
                </div>
                <h2 className="text-hotel-primary mt-4 fw-bold">Booking Confirmed!</h2>
                <p className="text-muted mt-3">
                  Thank you for booking with Relaxation Oasis. <br />
                  Your payment has been received and your booking information
                  has been saved.
                </p>

                <div className={classes.summary}>
                  <h5 className="text-hotel-primary mb-3">
                    <i className="fas fa-receipt me-2"></i>Booking Summary
                  </h5>
                  <div className={classes.line}>
                    <span className={classes.key}>Guest Name</span>
                    <span className={classes.value}>{guest.guestName || "-"}</span>
                  </div>
                  <div className={classes.line}>
                    <span className={classes.key}>Phone</span>
                    <span className={classes.value}>{guest.phone || "-"}</span>
                  </div>
                  <div className={classes.line}>
                    <span className={classes.key}>Check-in</span>
                    <span className={classes.value}>{filteredDate.checkIn || "-"}</span>
                  </div>
                  <div className={classes.line}>
                    <span className={classes.key}>Check-out</span>
                    <span className={classes.value}>{filteredDate.checkOut || "-"}</span>
                  </div>
                  <div className={classes.line}>
                    <span className={classes.key}>Rooms</span>
                    <span className={classes.value}>
                      {selectedRooms.length > 0
                        ? `${selectedRooms.length} (${roomNames})`
                        : "-"}
                    </span>
                  </div>
                  <div className={classes.line}>
                    <span className={classes.key}>Total Paid</span>
                    <span className={classes.value}>
                      {totalPayment.total ? `${totalPayment.total} MMK` : "-"}
                    </span>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3 mt-4">
                  <Link to="/find-your">
                    <button className="btn btn-theme text-light">View Your Booking</button>
                  </Link>
                  <Link to="/">
                    <button className="btn btn-outline-secondary">Back to Home</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingConfirmed;