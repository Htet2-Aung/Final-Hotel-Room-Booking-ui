import React, { useEffect, useLayoutEffect } from 'react'
import { initPrettyDataTable } from './prettyDataTable';
import { fetchRoomType} from '../RoomType/roomTypeSlice';
import { useDispatch } from 'react-redux';
import RoomTypeList from '../RoomType/RoomTypeList';
import classes from './Chart.module.css'

const RoomTypeTable = () => {

  const dispatch = useDispatch()
  useEffect(() => {
     
        dispatch(fetchRoomType())
      
  },[dispatch]
  )

   //initialize datatable (cleanup runs before unmount)
   useLayoutEffect(() => initPrettyDataTable("#example", 500, { title: "Room Type List", subtitle: "Room categories with price and facilities" }), []);


const card = `card ${classes.card2}`
  
  return (
    <div className={card}>
    <div className="container-fluid px-0">
         
        <table id="example" className="table table-hover table-striped table-bordered pretty-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Room Type</th>
            <th>Room Type View</th>
            <th>Description</th>
            <th>Price</th>
            <th>Facilities</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        <RoomTypeList/>
           
        </tbody>
      </table>
         
      </div>
    </div>
  )
}

export default RoomTypeTable