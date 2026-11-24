import React, { useEffect, useLayoutEffect } from 'react'

//jQuery libraries
import { initPrettyDataTable } from '../tables/prettyDataTable';

import { useDispatch } from 'react-redux';
import Bookinglist from './BookingList';
import {  fetchBooking } from './bookingSlice';
import classes from "../tables/Chart.module.css"


const BookingShow = () => {
  
  const dispatch = useDispatch()
  useEffect(() => {
     
          dispatch(fetchBooking())
      
  },[dispatch]
  )

  useLayoutEffect(() => initPrettyDataTable("#example", 500, { title: "Booking List", subtitle: "All guest bookings — confirm, send email or delete" }), []);


const card = `card ${classes.card2}`
  
  return (
    <div className={card}>
    <div className="container-fluid px-0">
         
    <table id="example" className="table table-hover table-striped table-bordered pretty-table">

        <thead>
          <tr>
            <th>Number</th>
            <th>Guest Name</th>
            <th>checkIn</th>
            <th>checkOut</th>
            <th>Expired</th>
            <th>Actions</th>
            <th>Details</th>
           
            {/* <th>TotalAdults</th>
            <th>TotalChildren</th>
            <th>Special Request</th>
            <th>CreatedAt</th> */}
          </tr>
        </thead>
        <tbody>
        <Bookinglist/>
           
        </tbody>
      </table>
         
      </div>
    </div>
  )
}

export default BookingShow