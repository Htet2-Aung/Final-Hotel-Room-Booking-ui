import React, { useState } from "react";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { deleteRoomType } from "./roomTypeSlice";
import ConfirmModal from "../ui/ConfirmModal";
import ActionIcon from "../ui/ActionIcon";
import { getRoomError } from "../Room/roomSlice";

const AdminRoomType = (props) => {

  const dispatch = useDispatch()
  const [isDeleteModal, setDeleteModal] = useState(false);

  const error = useSelector(getRoomError)
  console.log("ADMINROOMTYPE WITH ERROR: "+error)


  function deleteHandler() {
    console.log("hello delete");
    setDeleteModal(true);
  }
  function closeHandler() {
    setDeleteModal(false);
  }
  function confirmHandler() {
    dispatch(deleteRoomType({ id: props.id })).unwrap();
    setDeleteModal(false);

  }
  console.log("SetModalOpen: " + isDeleteModal);

  return (
    <tr>
      <td>{props.no}</td>
      <td>{props.name}</td>
      <td><img src={props.image} alt="roomtype image" className="w-100"/></td>
      <td>{parse(String(props.description ?? ''))}</td>
      <td>{props.price}</td>
      <td>{parse(props.facilities)}</td>
      <td className="px-3">
        <ActionIcon
          type="edit"
          to={`/admin/roomtypeTable/updateroomType/${props.id}`}
          title="Edit room type"
        />
        <ActionIcon type="delete" onClick={deleteHandler} title="Delete room type" />
        {isDeleteModal && (
          <ConfirmModal
            title="Delete Room Type"
            message={`Are you sure you want to delete room type "${props.name}"? This cannot be undone.`}
            confirmText="Delete"
            onCancel={closeHandler}
            onConfirm={confirmHandler}
          />
        )}
       
      </td>
    </tr>
  );
};

export default AdminRoomType
