import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deletePayment } from "./paymentSlice";
import ConfirmModal from "../ui/ConfirmModal";
import ActionIcon from "../ui/ActionIcon";

const AdminPayment = (props) => {
  const dispatch = useDispatch();
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [slipOpen, setSlipOpen] = useState(false);

  function deleteHandler() {
    setDeleteModal(true);
  }
  function closeHandler() {
    setDeleteModal(false);
  }
  function confirmHandler() {
    dispatch(deletePayment({ id: props.id })).unwrap();
    setDeleteModal(false);
  }

  return (
    <tr>
      <td>{props.id}</td>
      <td>{props.holderName}</td>
      <td>{props.cardNo}</td>
      <td>{props.total}</td>
      <td>{props.cardType}</td>
      <td>{props.transactionId ?? "—"}</td>
      <td>
        {props.slipImage ? (
          <img
            src={props.slipImage}
            alt="Payment slip"
            title="Click to view slip"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => setSlipOpen(true)}
          />
        ) : (
          "—"
        )}
        {slipOpen && (
          <div
            onClick={() => setSlipOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.7)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              cursor: "zoom-out",
            }}
          >
            <img
              src={props.slipImage}
              alt="Payment slip"
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                borderRadius: "8px",
                background: "#fff",
              }}
            />
          </div>
        )}
      </td>
      <td>
        <ActionIcon type="delete" onClick={deleteHandler} title="Delete payment" />
        {isDeleteModal && (
          <ConfirmModal
            title="Delete Payment"
            message={`Are you sure you want to delete payment ${props.invoiceNo ?? `#${props.id}`}? This cannot be undone.`}
            confirmText="Delete"
            onCancel={closeHandler}
            onConfirm={confirmHandler}
          />
        )}
      </td>
    </tr>
  );
};

export default AdminPayment;
