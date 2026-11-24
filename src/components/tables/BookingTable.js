import React, { useLayoutEffect } from 'react'
import { initPrettyDataTable } from './prettyDataTable'

const BookingTable = () => {

    useLayoutEffect(() => initPrettyDataTable("#example", 500, { title: "Booking List", subtitle: "Guest bookings with contact details and requests" }), [])

  return (
    <div className="MainDiv">
    <div className="container-fluid px-0">
         
        <table id="example" className="table table-hover table-striped table-bordered pretty-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Guest Name</th>
            <th>NRC</th>
            <th>Phone</th>
            <th>Country Of Origin</th>
            <th>Total Adults</th>
            <th>Total Children</th>
            <th>Special Request</th>
            <th>Actions</th>
            
          </tr>
        </thead>
        <tbody>
     
           
        </tbody>
      </table>
         
      </div>
    </div>
  )
}

export default BookingTable