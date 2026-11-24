import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addActivityLog, updateActivityLog } from "./activityLogSlice";
import { getToken } from "../../features/auth/authSlice";
import classes from "./ActivityLogForm.module.css";

const ActivityLogForm = (props) => {
  // when props.log is set the form edits that entry, otherwise it creates a new one
  const isEdit = Boolean(props.log);
  const [action, setAction] = useState(isEdit ? props.log.action : "");
  const [details, setDetails] = useState(isEdit ? props.log.details : "");

  const dispatch = useDispatch();
  const token = useSelector(getToken);

  const canSave = [action.trim(), details.trim()].every(Boolean);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!canSave) {
      return;
    }
    const log = { action: action.trim(), details: details.trim() };
    const thunk = isEdit
      ? updateActivityLog({ id: props.log.id, log, token })
      : addActivityLog({ log, token });
    dispatch(thunk)
      .unwrap()
      .catch((error) => {
        console.log(error);
        alert("Could not save the log entry. Please make sure the backend is running and try again.");
      });
    props.onClose();
  };

  return (
    <>
      <div className={classes.overlay} onClick={props.onClose}></div>
      <div className={classes.modal}>
        <h5 className="mb-3">{isEdit ? "Edit Log Entry" : "New Log Entry"}</h5>
        <form onSubmit={submitHandler}>
          <label className="form-label">Action:</label>
          <input
            className="form-control mb-2"
            type="text"
            placeholder="e.g. NOTE"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
          <label className="form-label">Details:</label>
          <textarea
            className="form-control"
            rows={5}
            placeholder="What happened?"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <div className="row my-3">
            <div className="col-md-6 pt-2">
              <button
                type="submit"
                className="btn text-light w-100"
                style={{ backgroundColor: "#29bfc2" }}
                disabled={!canSave}
              >
                {isEdit ? "Save Changes" : "Add Entry"}
              </button>
            </div>
            <div className="col-md-6 pt-2">
              <button
                type="button"
                className="btn text-light w-100"
                style={{ backgroundColor: "red" }}
                onClick={props.onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ActivityLogForm;
