import React, { useEffect, useState } from "react";
import { addNewRoom } from "./roomSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchRoomType, getAllRoomType } from "../RoomType/roomTypeSlice";
import ReactQuill from "react-quill";
import { uploadImage } from "../../uploadImage";

const AddRoom = () => {


  const [description, setDescription] = useState("");
  const [image1File, setImage1File] = useState(null);
  const [image2File, setImage2File] = useState(null);
  const [image3File, setImage3File] = useState(null);
  // const [totalRoom, setTotalRoom] = useState("");
  const [roomTypeId , setRoomTypeId] = useState("")
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  // const onDescriptionChange = (e) => setDescription(e.target.value);

  const onImage1Change = (e) => setImage1File(e.target.files[0]);
  const onImage2Change = (e) => setImage2File(e.target.files[0]);
  const onImage3Change = (e) => setImage3File(e.target.files[0]);
  // const ontotalRoomChange = (e) => setTotalRoom(e.target.value);
  const onRoomTypeNameChange = (e) => setRoomTypeId(e.target.value)
  const canSave =
    [description, image1File, image2File, image3File].every(Boolean) &&
    addRequestStatus === "idle";

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const roomTypes = useSelector(getAllRoomType)
  console.log("In the create room: "+roomTypes)

  useEffect(() => {
    dispatch(fetchRoomType())
  },[dispatch])

  console.log("Can save: " + canSave);

  const onSubmit = async (event) => {
    event.preventDefault();
      if(canSave){

        try {

          setAddRequestStatus('pending')

        const [image1Url, image2Url, image3Url] = await Promise.all([
          uploadImage(image1File),
          uploadImage(image2File),
          uploadImage(image3File),
        ]);

       dispatch(
        addNewRoom({
          room: {
            description,
            image1: image1Url,
            image2: image2Url,
            image3: image3Url,
            // totalRoom
          },roomTypeId
        })
       ).unwrap()    
      } catch (error) {
        console.log(error)  
       }finally{
        setAddRequestStatus('idle')
       }
      }
       
      setDescription('')
      setImage1File(null)
      setImage2File(null)
      setImage3File(null)
      navigate(`/admin/roomTable`)
    }


  return (
    <div className="container-fluid bg-white">
      <div className="row">
        <div className="col-xl-8 col-lg-8">
          <div className="card px-4 mb-3" style={{boxShadow: " 0 2px 8px rgba(0, 0, 0, 0.2)"}}>
        
            <form onSubmit={onSubmit}>
              <div className="row my-2">
              <div className="col-md-6">
              <label for="roomType" className="form-label">
                  Room Type
                </label>
              <select className="form-select"  value={roomTypeId} onChange={onRoomTypeNameChange}>
                  <option value="">Choose Room Type</option>
                  {roomTypes.map((roomType) =>

                      <option value={roomType.id}>
                          {roomType.name}
                      </option>

                      )};
                  
                  
                </select>
              </div>
              <div className="col-md-6">
            
                <label for="image1" className="form-label">
                  Room's Bed
                </label>
                <input type="file" className="form-control" accept="image/*" onChange={onImage1Change} required />
                {image1File && <img src={URL.createObjectURL(image1File)} alt="preview" className="img-thumbnail mt-2" style={{ maxHeight: "100px" }} />}
             
              </div>
            
              </div>
              <div className="row my-2">
              <div className="col-md-6">
             
                <label for="image2" className="form-label">
                  Room's Bath
                </label>
                <input type="file" className="form-control" accept="image/*" onChange={onImage2Change} required />
                {image2File && <img src={URL.createObjectURL(image2File)} alt="preview" className="img-thumbnail mt-2" style={{ maxHeight: "100px" }} />}
              
              </div>
              <div className="col-md-6">
            
              <label for="image3"  className="form-label">
                  Front View
                </label>
                <input type="file" className="form-control" accept="image/*" onChange={onImage3Change} required />
                {image3File && <img src={URL.createObjectURL(image3File)} alt="preview" className="img-thumbnail mt-2" style={{ maxHeight: "100px" }} />}
              </div>
              {/* <div>
              <label for="totalRoom"  className="form-label">
                 Total Room
                </label>
                <input type="number" className="form-control" value={totalRoom} onChange={ontotalRoomChange} placeholder="Total Room" />
              </div> */}
              </div>
              <div className="my-3">
                <label for="Description" className="form-label">
                  Description
                </label>
                <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                  />
                {/* <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" value={description} onChange={onDescriptionChange}></textarea> */}
              </div>
              <div className="mb-3 text-center">
                <button type="submit" className="btn text-light" style={{backgroundColor: "#29bfc2"}}>
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
