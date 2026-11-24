import React, { useState } from "react";
import { Link } from "react-router-dom";
import BookingDetails from "../tables/BookingDetails";
import BackDrop from "../pages/BackDrop";
import EmailForm from "../Email/EmailForm";
import { useDispatch, useSelector } from "react-redux";
import { getSendEmail, setEmail, sendEmail1 } from "../Email/emailSlice";
import { updateBooking, deleteBooking } from "./bookingSlice";
import { getToken } from "../../features/auth/authSlice";
import ConfirmModal from "../ui/ConfirmModal";
import ActionIcon from "../ui/ActionIcon";

const AdminBooking = (props) => {

  const [isModalOpen,setModalOpen]= useState(false)
  const isEmail = useSelector(getSendEmail)
  const dispatch = useDispatch()
  const token =useSelector(getToken);
  const bookingId = props.id
  // const sendEmail = true;
  // console.log("SendEmail: "+sendEmail)
  
  function detailHandler(){
    setModalOpen(true)
  }

  function closeHandler(){
    setModalOpen(false);
    dispatch(setEmail(false))
  }

  function sendEmailHandler(){
    
    dispatch(setEmail(true))
    
  }

  

  console.log("is Modal open"+isModalOpen)
 
  const date1 = props.checkOut;
  console.log("Date1 :"+date1)
 const getExpired = () => {
      const currentDate = new Date();
      console.log("Date: "+currentDate)
      const checkOut = new Date(date1)
      console.log("checkOut:"+checkOut)
      return currentDate > checkOut;
     }
     console.log(getExpired())

  const getStatusColor = () => {
      if(getExpired())
        
        return "red";
      
      return "";
     
    }

    const getStatus = () => {
      if(getExpired())
        
        return "Expired";
      
      return "-";
     
    }
    
  
    const funDisabled = () => {
      if(props.statuss === 'Confirmed'){
        return true
      }else if(props.statuss === 'Pending'){
        return false
      }
    }

    console.log("FunDisabled:"+funDisabled())

    const buildConfirmEmailText = () =>
`Dear ${props.guestName},

Thank you for choosing Relax Oasis Hotel. Your booking has been confirmed.

Booking Reference : BK-${props.id}
Check-in Date     : ${props.checkIn}
Check-out Date    : ${props.checkOut}
Number of Rooms   : ${props.numOfRoom}
Guests            : ${props.totalAdults} adult(s), ${props.totalChildren} child(ren)

Please present this email or your booking reference at the front desk when you arrive.
If you have any questions about your stay, just reply to this email.

Warm regards,
Relax Oasis Hotel
relax.oasis.myanmar@gmail.com`;

    const confirmHandler = (e) => {

      dispatch(
        updateBooking({
          booking: {
            guestName: props.guestName,
            nrc: props.nrc,
            phone: props.phone,
            username: props.username,
            countryOfOrigin: props.countryOfOrigin,
            totalAdults: props.totalAdults,
            totalChildren: props.totalChildren,
            specialRequest:props.specialRequest,
            checkIn:props.checkIn,
            checkOut:props.checkOut,
            numOfRoom:props.numOfRoom,

      },token,bookingId
        })
      )
        .unwrap()
        .then(() => {
          // booking confirmed -> automatically send confirmation email to the guest
          // (skip when the booking has no guest email on file)
          if (!props.username) {
            return;
          }
          dispatch(
            sendEmail1({
              email: {
                to: props.username,
                subject: `Booking Confirmed - Relax Oasis Hotel (Ref BK-${props.id})`,
                text: buildConfirmEmailText(),
              },
              token,
            })
          ).unwrap();
        })
        .catch((error) => {
          console.log(error);
          alert("Booking confirmation failed (" + (error.message || error) + "). Please make sure the backend is running and try again. No confirmation email was sent.");
        });
      setConfirm(false)
    }

    const [isConfirm,setConfirm] = useState(false)

    function cancelHandler(){
      setConfirm(false)
    }

    // --- admin delete (cancel) booking ---
    const [isDeleteOpen, setDeleteOpen] = useState(false)

    function openDeleteHandler(){
      setDeleteOpen(true)
    }

    function cancelDeleteHandler(){
      setDeleteOpen(false)
    }

    function deleteHandler(){
      dispatch(deleteBooking({ id: props.id, token }))
        .unwrap()
        .catch((error) => {
          console.log(error);
          alert("Booking delete failed (" + (error.message || error) + "). Please make sure the backend is running and try again.");
        });
      setDeleteOpen(false)
    }

    // function confirmHandler(){
    //     dispatch(deleteRoom({id:props.id})).unwrap()
      
    //  }
    function clickHandler(){
      setConfirm(true)
     }

    

  return (
    <tr style={{color: getStatusColor()}}>
      <td>{props.invoiceNo}</td>
      <td>{props.guestName}</td>
      <td>{props.checkIn}</td>
      <td>{props.checkOut}</td>
      <td>{getStatus()}</td>
      <td>
      <ActionIcon
        type="confirm"
        onClick={clickHandler}
        disabled={funDisabled()}
        title={funDisabled() ? "Already confirmed" : "Confirm booking"}
      />
     
      {/* <button className="btn btn-success" ></button> */}
     {isConfirm && (
       <ConfirmModal
         title="Confirm Booking"
         message={props.username
            ? `Mark booking ${props.invoiceNo} as confirmed? A confirmation email will be sent to ${props.username} automatically.`
            : `Mark booking ${props.invoiceNo} as confirmed? Note: this booking has no guest email on file, so no confirmation email will be sent.`}
         confirmText="Confirm"
         variant="primary"
         onCancel={cancelHandler}
         onConfirm={confirmHandler}
       />
     )}
     <ActionIcon type="email" onClick={sendEmailHandler} title="Send custom email" />
      <ActionIcon type="delete" onClick={openDeleteHandler} title="Delete booking" />
      {isDeleteOpen && (
        <ConfirmModal
          title="Delete Booking"
          message={`Permanently delete booking ${props.invoiceNo} for ${props.guestName}? Its room links and payment record will also be removed. This cannot be undone.`}
          confirmText="Delete"
          onCancel={cancelDeleteHandler}
          onConfirm={deleteHandler}
        />
      )}
   
   {isEmail && <EmailForm
           id = {props.id}
          
           />}
           {isEmail && <BackDrop onDrop={closeHandler}/>}
      
      </td>
      <td>
      <Link  onClick={detailHandler}>View more..</Link>
        {isModalOpen && <BookingDetails 
                id = {props.id}
                />}
                {isModalOpen && <BackDrop onDrop={closeHandler}/>}
      </td>
    
      {/* <td>{props.totalAdults}</td>
      <td>{props.totalChildren}</td>
      <td>{props.specialRequest}</td>
      <td>{props.createdAt}</td> */}
      
    </tr>
  );
};

export default AdminBooking
