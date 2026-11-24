import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteActivityLog } from "./activityLogSlice";
import { getToken } from "../../features/auth/authSlice";
import ConfirmModal from "../ui/ConfirmModal";
import ActionIcon from "../ui/ActionIcon";
import ActivityLogForm from "./ActivityLogForm";

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }
  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0] = value;
    const pad = (n) => String(n).padStart(2, "0");
    return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}`;
  }
  return String(value).replace("T", " ");
};

const ActivityLogItem = (props) => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const log = { id: props.id, action: props.action, details: props.details };

  const deleteHandler = () => {
    dispatch(deleteActivityLog({ id: props.id, token }))
      .unwrap()
      .catch((error) => {
        console.log(error);
        alert("Could not delete the log entry. Please make sure the backend is running and try again.");
      });
    setDeleteOpen(false);
  };

  return (
    <tr>
      <td>{props.no}</td>
      <td><strong>{props.action}</strong></td>
      <td>{props.details}</td>
      <td>{props.username}</td>
      <td>{formatDateTime(props.createdAt)}</td>
      <td>
        <ActionIcon type="edit" onClick={() => setEditOpen(true)} title="Edit log entry" />
        <ActionIcon type="delete" onClick={() => setDeleteOpen(true)} title="Delete log entry" />
        {isEditOpen && <ActivityLogForm log={log} onClose={() => setEditOpen(false)} />}
        {isDeleteOpen && (
          <ConfirmModal
            title="Delete Log Entry"
            message={`Delete the log entry "${props.action}"? This cannot be undone.`}
            confirmText="Delete"
            onCancel={() => setDeleteOpen(false)}
            onConfirm={deleteHandler}
          />
        )}
      </td>
    </tr>
  );
};

export default ActivityLogItem;
