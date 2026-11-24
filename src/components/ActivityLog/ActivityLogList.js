import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActivityLogItem from "./ActivityLogItem";
import { fetchActivityLogs, getActivityLogError, getActivityLogStatus, getAllActivityLogs } from "./activityLogSlice";
import { getToken } from "../../features/auth/authSlice";

const ActivityLogList = () => {
  const logList = useSelector(getAllActivityLogs);

  const logStatus = useSelector(getActivityLogStatus);

  const logError = useSelector(getActivityLogError);

  const dispatch = useDispatch();
  const token = useSelector(getToken);
  useEffect(() => {
    if (logStatus === "idle") {
      dispatch(fetchActivityLogs(token));
    }
  }, [logStatus, dispatch, token]);

  let content;
  let index = 1;

  if (logStatus === "loading") {
    content = <p>Loading.....</p>;
  }

  if (logStatus === "succeeded") {
    content = logList.map((log) => (
      <ActivityLogItem
        no={index++}
        key={log.id}
        id={log.id}
        action={log.action}
        details={log.details}
        username={log.username}
        createdAt={log.createdAt}
      />
    ));
  }

  if (logStatus === "failed") {
    content = <p>{logError}</p>;
  }

  return content;
};

export default ActivityLogList;
