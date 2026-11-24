// import bannerImg from "../images/island.jpg"
import bannerImg from "../images/home_page.jpg"
import ARoom from "../Room/ARoom";
import classes from "./Home.module.css"
import ShowRoomType from "../RoomType/ShowRoomType";
import SearchBar from "./SearchBar";
import SelectedRoom from "../Room/SelectedRoom";
import BookingSteps from "./BookingSteps";
import { fetchAllRoom, getFilteredRoom, getSearchBar } from "../Room/roomSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";


const Home = () => {

 const message = `text-light ${classes.message}`

 const filteredRooms = useSelector(getFilteredRoom)
 console.log("In room detail with filtered rooms: "+filteredRooms)
 const isSelected = useSelector(getSearchBar)
 console.log("In room detail for selected component: "+isSelected)


 const dispatch = useDispatch()
 useEffect(()=>{
   dispatch(fetchAllRoom())
 },[dispatch])


  return (
    <>
    <section>
  <img className={classes.banner} alt="Hotel view" src={bannerImg}/>
  <h3 className={message}>Book Your Stay Without Hassle</h3>
    <SearchBar/>

    {isSelected && (
    <section>
    <BookingSteps current={1} />
    <div className="row mt-3">
        <div className="col-sm-12 col-md-7">
        <h4 className="ms-4 mb-3" style={{color: "#1a8081"}}>Available Rooms ({filteredRooms.length})</h4>
        {filteredRooms.length === 0 && (
          <p className="ms-4 text-muted">No rooms available for your selected dates and room type. Please try another search.</p>
        )}
        {
          filteredRooms.map(
            (room) => (
                <ARoom
                    key = {room.id}
                    id = {room.id}
                    description = {room.description}
                    image1 = {room.image1}
                    image2 = {room.image2}
                    image3 = {room.image3}
                    roomTypeId = {room.roomType?.id}
                    roomTypeName = {room.roomType?.name ?? '-'}
                    roomTypePrice = {room.roomType?.price ?? 0}
                    roomTypeDescription = {room.roomType?.description ?? ''}
                    roomTypeFacilities = {room.roomType?.facilities ?? ''}
                    roomSelected = {room.selected}

                />
            ))
  }

        </div>
        <div className="col-sm-12 col-md-4 mt-4">
       <SelectedRoom/>
        </div>
    </div>
    </section>
    )}

    <ShowRoomType/>
 </section>

</>
  )
}

export default Home