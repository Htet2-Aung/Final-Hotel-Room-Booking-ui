import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteBookingRoom } from './bookingRoomSlice'
import ConfirmModal from '../ui/ConfirmModal'
import ActionIcon from '../ui/ActionIcon'

const BookingRoomItem = (props) => {

    const [isModalOpen,setModalOpen] = useState(false)
    const dispatch = useDispatch()

    function closeHandler(){
        setModalOpen(false)
    }

    function confirmHandler(){
        dispatch(deleteBookingRoom({id:props.id})).unwrap()
        setModalOpen(false)
     }
    function deleteHandler(){
        setModalOpen(true)
     }

  const isActive = props.checkOut ? new Date(props.checkOut) >= new Date() : true

  return (
    <tr>
    <td>{props.no}</td>
    <td>{props.checkIn}</td>
    <td>{props.checkOut}</td>
    <td>
      {isActive
        ? <span className="badge bg-success">Active</span>
        : <span className="badge bg-secondary">Completed</span>}
    </td>
    <td>
      <ActionIcon type="delete" onClick={deleteHandler} title="Delete booking room" />
      {isModalOpen && (
        <ConfirmModal
          title="Delete Booking Room"
          message="Are you sure you want to delete this booking room? This cannot be undone."
          confirmText="Delete"
          onCancel={closeHandler}
          onConfirm={confirmHandler}
        />
      )}
    </td>
  </tr>
  )
}

export default BookingRoomItem