import React, { useLayoutEffect } from 'react'
import { initPrettyDataTable } from './prettyDataTable'
import BookingRoomList from '../BookingRoom/BookingRoomList'


const BookingRoomTable = () => {

    useLayoutEffect(() => initPrettyDataTable("#example", 500, { title: "Booking Room List", subtitle: "Stay dates and status for each booked room" }), [])

  return (
    <div className="MainDiv">
    <div className="container-fluid px-0">
         
        <table id="example" className="table table-hover table-striped table-bordered pretty-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
           
            <th>Actions</th>
            
          </tr>
        </thead>
        <tbody>
          <BookingRoomList />
        </tbody>
      </table>
         
      </div>
    </div>
  )
}

export default BookingRoomTable