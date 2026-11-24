import React, { useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import classes from './Chart.module.css'
import ActivityLogList from '../ActivityLog/ActivityLogList';
import ActivityLogForm from '../ActivityLog/ActivityLogForm';
import { getActivityLogStatus } from '../ActivityLog/activityLogSlice';
import { initPrettyDataTable } from './prettyDataTable';

const ActivityLogTable = () => {

  const logStatus = useSelector(getActivityLogStatus);
  const [isFormOpen, setFormOpen] = useState(false);

  // init only after the log rows are rendered (fetch happens in ActivityLogList),
  // sorted by latest Date/Time first; the cleanup destroys the DataTable
  // BEFORE React unmounts the table, or React's removeChild crashes
  useLayoutEffect(() => {
    if (logStatus !== 'succeeded') {
      return;
    }
    return initPrettyDataTable("#example", 0, { title: "Activity Log", subtitle: "Actions performed under your login" }, [[4, "desc"]]);
  }, [logStatus]);

  const card = `card ${classes.card2}`

  return (
    <div className={card}>
      <div className="container-fluid px-0">
        <div className="d-flex justify-content-end mb-2">
          <button
            type="button"
            className="btn btn-sm text-light"
            style={{ backgroundColor: "#29bfc2" }}
            onClick={() => setFormOpen(true)}
          >
            <i className="fas fa-plus me-1"></i>Add Entry
          </button>
        </div>

        <table id="example" className="table table-hover table-striped table-bordered pretty-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Action</th>
              <th>Details</th>
              <th>Username</th>
              <th>Date / Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <ActivityLogList />

          </tbody>
        </table>

      </div>
      {isFormOpen && <ActivityLogForm onClose={() => setFormOpen(false)} />}
    </div>
  )
}

export default ActivityLogTable
