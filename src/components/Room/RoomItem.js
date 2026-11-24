import React, {  useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteRoom } from './roomSlice'
import parse from "html-react-parser";
import ConfirmModal from '../ui/ConfirmModal'
import ActionIcon from '../ui/ActionIcon'

const RoomItem = (props) => {

  const dispatch = useDispatch()
    // const roomTId = props.roomTypeId;
    // const roomType = useSelector((state)=>selectRoomTypeById(state,Number(roomTId)))

    
 
    // console.log("In the roomItem with roomType: "+roomTId )

    // const typeName = roomType.name
    // console.log("In the roomItem with name: "+typeName )

    
    const [isModalOpen,setModalOpen] = useState(false)

    function closeHandler(){
        setModalOpen(false)
    }

    function confirmHandler(){
        dispatch(deleteRoom({id:props.id})).unwrap()
        setModalOpen(false)
     }
    function deleteHandler(){
        setModalOpen(true)
     }

     const typeName = props.roomType?.name ?? 'No type'

  return (
    <tr>
    <td>{props.no}</td>
    <td>{typeName}</td>
    <td><img src={props.image1} className="image fluid" width="100px" height="100px" alt={`${typeName} room`}/></td>
    <td><img src={props.image2} className="image fluid" width="100px" height="100px" alt={`${typeName} room`}/></td>
    <td><img src={props.image3} className="image fluid" width="100px" height="100px" alt={`${typeName} room`}/></td>
    {/* <td>{Number(props.totalRoom)}</td> */}
    <td>{parse(String(props.description ?? ''))}</td>
    <td>
      <ActionIcon
        type="edit"
        to={`/admin/roomTable/updateroom/${props.id}`}
        title="Edit room"
      />
      <ActionIcon type="delete" onClick={deleteHandler} title="Delete room" />
      {isModalOpen && (
        <ConfirmModal
          title="Delete Room"
          message={`Are you sure you want to delete this ${typeName} room? This cannot be undone.`}
          confirmText="Delete"
          onCancel={closeHandler}
          onConfirm={confirmHandler}
        />
      )}
    </td>
  </tr>
  )
}

export default RoomItem