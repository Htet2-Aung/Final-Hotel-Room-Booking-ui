import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchBooking,
  deleteBooking,
  selectBookingByUsername,
  getBookingStatus,
} from "./bookingSlice";
import { getToken, getUser } from "../../features/auth/authSlice";

import ConfirmModal from "../ui/ConfirmModal";
import ActionIcon from "../ui/ActionIcon";
import { openBookingInvoicePdf } from "./bookingInvoicePdf";
import PayNowModal from "./PayNowModal";
import Pagination from "../ui/Pagination";

const statusBadge = (status) => {
  const value = String(status ?? "");
  if (value === "Confirmed") return <span className="badge bg-success">Confirmed</span>;
  if (value === "Pending") return <span className="badge bg-warning text-dark">Pending</span>;
  return <span className="badge bg-secondary">{value || "Unknown"}</span>;
};

const YourBooking = () => {
  const dispatch = useDispatch();

  const user = useSelector(getUser);
  const token = useSelector(getToken);
  const bookings = useSelector((state) => selectBookingByUsername(state, String(user.username)));
  const bookingStatus = useSelector(getBookingStatus);

  const [cancelTarget, setCancelTarget] = useState(null);
  const [noticeTarget, setNoticeTarget] = useState(null);
  const [previewingId, setPreviewingId] = useState(null);
  const [payTarget, setPayTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchBooking());
  }, [dispatch]);

  // keep the page index valid when the list shrinks (e.g. after a cancel)
  // or the page size changes
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(bookings.length / pageSize));
    setCurrentPage((prev) => (prev > maxPage ? maxPage : prev));
  }, [bookings.length, pageSize]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBookings = bookings.slice(startIndex, startIndex + pageSize);

  const previewHandler = async (booking) => {
    // open the tab inside the click handler so popup blockers don't kill it
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.title = "Booking Invoice";
    }
    try {
      setPreviewingId(booking.id);
      const response = await fetch(
        `http://localhost:8181/api/bookingRoom/bookingWithRoom/${booking.id}`
      );
      const data = await response.json();
      openBookingInvoicePdf(data.booking ?? booking, data.rooms ?? [], previewWindow);
    } catch (error) {
      console.error("Error generating invoice PDF:", error);
      if (previewWindow) {
        previewWindow.close();
      }
    } finally {
      setPreviewingId(null);
    }
  };

  const confirmCancelHandler = () => {
    dispatch(deleteBooking({ id: cancelTarget.id, token })).unwrap();
    setCancelTarget(null);
  };

  return (
    <section>
      <div className="container py-5">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered pretty-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Invoice No</th>
                    <th>Guest Name</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Rooms</th>
                    <th>Adults</th>
                    <th>Children</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingStatus === "loading" && (
                    <tr>
                      <td colSpan="11" className="text-center py-4">
                        Loading your bookings...
                      </td>
                    </tr>
                  )}
                  {bookingStatus !== "loading" && bookings.length === 0 && (
                    <tr>
                      <td colSpan="11" className="text-center py-4 text-muted">
                        You have no bookings yet.
                      </td>
                    </tr>
                  )}
                  {paginatedBookings.map((booking, index) => {
                    // only confirmed bookings may be cancelled; pending ones are locked
                    const canCancel = String(booking.statuss) === "Confirmed";
                    return (
                    <tr key={booking.id}>
                      <td>{startIndex + index + 1}</td>
                      <td>{booking.payment?.invoiceNo ?? `RO-000${booking.id}`}</td>
                      <td>{booking.guestName}</td>
                      <td>{booking.checkIn ?? "-"}</td>
                      <td>{booking.checkOut ?? "-"}</td>
                      <td>{booking.bookingRooms?.length ?? booking.numOfRoom ?? 0}</td>
                      <td>{booking.totalAdults ?? 0}</td>
                      <td>{booking.totalChildren ?? 0}</td>
                      <td>
                        {booking.payment ? (
                          `${Number(booking.payment.total || 0).toLocaleString("en-US")} MMK`
                        ) : (
                          <>
                            <span className="text-muted d-block">Not paid</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-theme text-light mt-1"
                              onClick={() => setPayTarget(booking)}
                            >
                              <i className="fas fa-wallet me-1"></i>Pay Now
                            </button>
                          </>
                        )}
                      </td>
                      <td>{statusBadge(booking.statuss)}</td>
                      <td className="text-nowrap">
                        {previewingId === booking.id ? (
                          <i className="fas fa-spinner fa-spin" title="Generating PDF..."></i>
                        ) : (
                          <ActionIcon
                            type="view"
                            onClick={() => previewHandler(booking)}
                            title="Preview invoice PDF"
                          />
                        )}
                        <span style={{ opacity: canCancel ? 1 : 0.4 }}>
                          <ActionIcon
                            type="delete"
                            onClick={() =>
                              canCancel ? setCancelTarget(booking) : setNoticeTarget(booking)
                            }
                            title={
                              canCancel
                                ? "Cancel this booking"
                                : "Pending bookings cannot be cancelled yet"
                            }
                          />
                        </span>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {bookings.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={bookings.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            )}
          </div>
        </div>
      </div>
      {cancelTarget && (
        <ConfirmModal
          title="Cancel Booking"
          message={`Are you sure you want to cancel this booking${
            cancelTarget.payment ? ` (${cancelTarget.payment.invoiceNo})` : ` #${cancelTarget.id}`
          }? This cannot be undone.`}
          confirmText="Cancel Booking"
          onCancel={() => setCancelTarget(null)}
          onConfirm={confirmCancelHandler}
        />
      )}
      {noticeTarget && (
        <ConfirmModal
          title="Cannot Cancel Booking"
          message={`Booking ${
            noticeTarget.payment?.invoiceNo ?? `#${noticeTarget.id}`
          } is still pending. You can cancel it only after the hotel has confirmed it.`}
          confirmText="OK"
          cancelText={null}
          variant="primary"
          onCancel={() => setNoticeTarget(null)}
          onConfirm={() => setNoticeTarget(null)}
        />
      )}
      {payTarget && (
        <PayNowModal
          booking={payTarget}
          onClose={() => setPayTarget(null)}
          onPaid={() => {
            setPayTarget(null);
            dispatch(fetchBooking());
          }}
        />
      )}
    </section>
  );
};

export default YourBooking;
