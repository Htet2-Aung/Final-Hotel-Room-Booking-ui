import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectRoomById, updateRoom } from './roomSlice';
import { fetchRoomType, getAllRoomType } from '../RoomType/roomTypeSlice';
import ReactQuill from 'react-quill';
import { uploadImage } from '../../uploadImage';

const UpdateRoom = () => {

    const { roomId } = useParams()
    const room = useSelector((state) => selectRoomById(state,Number(roomId)))
    console.log("Room Id in update form:"+roomId)
    console.log("Room in update form: "+room)

    const [id,setId] = useState(room?.id)
    const [description, setDescription] = useState(room?.description);
    const [image1, setImage1] = useState(room?.image1);
    const [image2, setImage2] = useState(room?.image2);
    const [image3, setImage3] = useState(room?.image3);
    const [image1File, setImage1File] = useState(null);
    const [image2File, setImage2File] = useState(null);
    const [image3File, setImage3File] = useState(null);
    const [roomTypeId , setRoomTypeId] = useState(room?.roomType.id)
    const [addRequestStatus, setAddRequestStatus] = useState("idle");
  
    // const onDescriptionChange = (e) => setDescription(e.target.value);
  
    const onImage1Change = (e) => setImage1File(e.target.files[0]);
    const onImage2Change = (e) => setImage2File(e.target.files[0]);
    const onImage3Change = (e) => setImage3File(e.target.files[0]);
    const onRoomTypeNameChange = (e) => setRoomTypeId(e.target.value)
    const canSave =
      [description, image1, image2, image3].every(Boolean) &&
      addRequestStatus === "idle";
  
      const dispatch = useDispatch()
      const navigate = useNavigate()

      const roomTypes = useSelector(getAllRoomType)
  console.log("In the update room: "+roomTypes)

  useEffect(() => {
    dispatch(fetchRoomType())
  },[dispatch])
  
    console.log("Can save: " + canSave);
  
    const onSubmit = async (event) => {
      event.preventDefault();
        if(canSave){
  
          try {
  
            setAddRequestStatus('pending')

            const image1Url = image1File ? await uploadImage(image1File) : image1;
            const image2Url = image2File ? await uploadImage(image2File) : image2;
            const image3Url = image3File ? await uploadImage(image3File) : image3;
  
         dispatch(
          updateRoom({
            room: {
                id,
              description,
              image1: image1Url,
              image2: image2Url,
              image3: image3Url
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
        setImage1('')
        setImage2('')
        setImage3('')
        navigate(`/admin/roomTable`)
      }
  
  
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-8 col-lg-7">
            <div className="card px-4 mb-3">
              <form onSubmit={onSubmit}>
              <div className="my-3">
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
            
                <div className="mb-3">
                  <label for="image1" className="form-label">
                    Room's Bed
                  </label>
                  {!image1File && image1 && <img src={image1} alt="current" className="img-thumbnail d-block mb-1" style={{ maxHeight: "80px" }} />}
                  {image1File && <img src={URL.createObjectURL(image1File)} alt="preview" className="img-thumbnail d-block mb-1" style={{ maxHeight: "80px" }} />}
                  <input type="file" className="form-control" accept="image/*" onChange={onImage1Change} />
                  <small className="text-muted">Leave empty to keep the current image.</small>
                </div>
                <div className="mb-3">
                  <label for="image2" className="form-label">
                    Room's Bath
                  </label>
                  {!image2File && image2 && <img src={image2} alt="current" className="img-thumbnail d-block mb-1" style={{ maxHeight: "80px" }} />}
                  {image2File && <img src={URL.createObjectURL(image2File)} alt="preview" className="img-thumbnail d-block mb-1" style={{ maxHeight: "80px" }} />}
                  <input type="file" className="form-control" accept="image/*" onChange={onImage2Change} />
                  <small className="text-muted">Leave empty to keep the current image.</small>
                </div>
                <div className="mb-3">
                  <label for="image3"  className="form-label">
                    Front View
                  </label>
                  {!image3File && image3 && <img src={image3} alt="current" className="img-thumbnail d-block mb-1" style={{ maxHeight: "80px" }} />}
                  {image3File && <img src={URL.createObjectURL(image3File)} alt="preview" className="img-thumbnail d-block mb-1" style={{ maxHeight: "80px" }} />}
                  <input type="file" className="form-control" accept="image/*" onChange={onImage3Change} />
                  <small className="text-muted">Leave empty to keep the current image.</small>
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
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}

export default UpdateRoom