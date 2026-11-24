import { initPrettyDataTable } from './prettyDataTable';
import { useDispatch } from 'react-redux';
import { useEffect, useLayoutEffect } from "react";
import { fetchAllUsers } from "../User/userSlice";
import UserList from "../User/UserList";
import classes from './Chart.module.css'

const UserListTable = () => {
    const dispatch = useDispatch()
  useEffect(() => {
     
          dispatch(fetchAllUsers())
      
  },[dispatch]
  )

  //initialize datatable sorted by latest Updated Date first (cleanup runs before unmount)
  useLayoutEffect(() => initPrettyDataTable("#example", 500, { title: "User List", subtitle: "All registered accounts (customers & admins)" }, [[5, "desc"]]), []);

const card = `card ${classes.card2}`
  return (
    <div className={card}>
    
    <div className="container-fluid px-0">
         
        <table id="example" className="table table-hover table-striped table-bordered pretty-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone </th>
            <th>Registration Date</th>
            <th>Updated Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        <UserList/>
           
        </tbody>
      </table>
         
      </div>

   
  
    </div>
  )
}

export default UserListTable