import React, { useEffect, useLayoutEffect } from 'react'
import RoomList from '../Room/RoomList'
import { useDispatch } from 'react-redux'
import { fetchAllRoom } from '../Room/roomSlice'
import { initPrettyDataTable } from './prettyDataTable'
import classes from './Chart.module.css'

const RoomTable = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAllRoom())
    },[dispatch])

    useLayoutEffect(() => initPrettyDataTable("#example", 500, { title: "Room List", subtitle: "Rooms with photos, room type and details" }), [])

    const card = `card ${classes.card2}`
  return (
    <div className={card}>
    <div className="container-fluid px-0">
         
        <table id="example" className="table table-hover table-striped table-bordered pretty-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Room Type</th>
            <th>Room's Bed</th>
            <th>Room's Bath</th>
            <th>Front View</th>
            {/* <th>No of Rooms</th> */}
            <th>Description</th>
            <th>Actions</th>
            
          </tr>
        </thead>
        <tbody>
        <RoomList/>
           
        </tbody>
      </table>
         
      </div>
    </div>
  )
}

export default RoomTable