import React, { useEffect, useLayoutEffect } from 'react'

//jQuery libraries
import { initPrettyDataTable } from '../tables/prettyDataTable';
import classes from "../tables/Chart.module.css"

import { fetchAllPayments } from './paymentSlice';
import { useDispatch } from 'react-redux';

import Paymentlist from './PaymentList';

const PaymentShow = () => {

  // const roomTypeList = useSelector(getAllRoomType)
 
  // console.log("Room Type List: "+roomTypeList)

  
  const dispatch = useDispatch()
  useEffect(() => {
     
          dispatch(fetchAllPayments())
      
  },[dispatch]
  )

  useLayoutEffect(() => initPrettyDataTable("#example", 500, { title: "Payment List", subtitle: "Payments received for guest bookings" }), []);
  
const card = `card ${classes.card2}`
  return (
    <div className={card}>
    <div className="container-fluid px-0">
         
    <table id="example" className="table table-hover table-striped table-bordered pretty-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Holder Name</th>
            <th>Card Number</th>
            <th>Total</th>
            <th>Card Type</th>
            <th>Txn ID</th>
            <th>Slip</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        <Paymentlist/>
           
        </tbody>
      </table>
         
      </div>
    </div>
  )
}

export default PaymentShow