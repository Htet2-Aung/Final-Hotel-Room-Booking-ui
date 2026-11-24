import React, { useState } from "react";
import "quill/dist/quill.snow.css"; // Import Quill's styles
import ReactQuill from "react-quill"; // Import React-Quill
import "react-quill/dist/quill.snow.css"; // Import React-Quill's styles
import { useDispatch } from "react-redux";
import { addNewRoomType } from "./roomTypeSlice";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../../uploadImage";

const CreateRoomType = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [facilities, setFacilities] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const onNameChange = (e) => setName(e.target.value);
  const onDescriptionChange = (e) => setDescription(e.target.value);
  const onPriceChange = (e) => setPrice(e.target.value);
  const onImageChange = (e) => setImageFile(e.target.files[0]);
  // const onFacilitiesChange = e => setFacilities(e.target.value)

  const canSave =
    [name, description, price, facilities, imageFile].every(Boolean) &&
    addRequestStatus === "idle";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();

    if (canSave) {
      try {
        console.log("If can save");
        setAddRequestStatus("pending");

        const image = imageFile ? await uploadImage(imageFile) : "";

        dispatch(
          addNewRoomType({
            roomType: {
              name,
              description,
              price,
              facilities,
              image,
            },
          })
        ).unwrap();
      } catch (error) {
        console.log(error);
      } finally {
        setAddRequestStatus("idle");
      }

      setName("");
      setDescription("");
      setPrice("");
      setFacilities("");
      setImageFile(null);
      navigate("/admin/roomtypeTable");
    }

    console.log("Cansave: " + canSave);
  };

  return (
    <>
      <div className="container-fluid bg-white">
       
        <div className="row">
          <div className="col-xl-8 col-lg-7">
            <div className="card px-4 mb-3 pt-2" style={{boxShadow: " 0 2px 8px rgba(0, 0, 0, 0.2)"}}>
            <h5 className="text-center"  style={{color: "#2fd5d8" }}>Create Room Type</h5>
              <form onSubmit={onSubmit}>
              <div className="row  my-3">
              <div className="col-md-6">
                  <label for="exampleInputEmail1" className="form-label">
                    Room Type
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="roomType"
                    value={name}
                    onChange={onNameChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label for="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="price"
                    value={price}
                    onChange={onPriceChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
              <div className="col-md-12">
                  <label for="exampleInputEmail1" className="form-label">
                    Room Type' Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="roomTypeImage"
                    accept="image/*"
                    onChange={onImageChange}
                    required
                  />
                  {imageFile && (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="preview"
                      className="img-thumbnail mt-2"
                      style={{ maxHeight: "150px" }}
                    />
                  )}
                  </div>
               
              </div>
               
                <div className="mb-3">
                  <label for="description" className="form-label">
                    Description
                  </label>
                  
                  <textarea
                    className="form-control"
                    rows="5"
                    id="comment"
                    name="text"
                    value={description}
                    onChange={onDescriptionChange}
                    required
                  ></textarea>
                </div>
             
                <div className="mb-3">
                  <label for="facilities" className="form-label">
                    Facilities
                  </label>

                  <ReactQuill
                    theme="snow"
                    value={facilities}
                    onChange={setFacilities}
                  />
                </div>
                <div className="mb-3 text-center">
                  <button type="submit" className="btn text-light" style={{backgroundColor: "#29bfc2"}}>
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateRoomType;
