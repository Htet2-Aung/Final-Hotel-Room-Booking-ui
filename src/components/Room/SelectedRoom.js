import { useSelector } from "react-redux";
import {
  findRoomByselected,
 
} from "./roomSlice";
import SelectedRoomItem from "./SelectedRoomItem";
import { Link } from "react-router-dom";

const SelectedRoom = () => {
  

  const selectedRooms = useSelector(findRoomByselected);
  console.log("SelectedRoom component: " + selectedRooms);

 
  // const roomTypeId = selectedRooms.roomTypeId;
  // const roomtype = useSelector((state) => selectRoomTypeById(state, Number(roomTypeId)) );

  

  let content;
  if (selectedRooms.length === 0) {
    console.log("selectedRooms.length"+selectedRooms.length)
    content = <p className="text-center my-4">If you want to book a room, you must select a room.</p>;
  } else {
    content = (
      <>
      <h4 className="card-title my-2">Selected rooms</h4>
      {selectedRooms.map((room) => (
      
    <SelectedRoomItem 
    id = {room.id}
    image1 = {room.image1}
    roomType = {room.roomType?.name ?? '-'}
    price = {room.roomType?.price ?? 0}
    />
    ))}
    </>
    )
  }

  return (
    <div className="card px-3">
    <form>
      {content}
      {selectedRooms.length > 0 && (
      <div className="row text-center">
        <Link to="/form">
        <button className="btn btn-theme mb-2 text-light">Proceed To Guest Info <i className="fas fa-arrow-right ms-1"></i></button>
        </Link>
      </div>
      )}
      </form>
    </div>
    
    );
  // return <p>Select Room</p>
};

export default SelectedRoom;
