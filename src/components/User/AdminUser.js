import { useState } from "react";
import { fetchAllUsers, deleteUser } from "./userSlice";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../features/auth/authSlice";
import ConfirmModal from "../ui/ConfirmModal";
import ActionIcon from "../ui/ActionIcon";

const AdminUser = (props) => {

  const dispatch = useDispatch();
  const loginUser = useSelector(getUser);

  const isSelf = loginUser && Number(loginUser.id) === Number(props.id);

  const [isDeleteModal, setDeleteModal] = useState(false);

  const onDeleteUser = () => setDeleteModal(true);

  const closeHandler = () => setDeleteModal(false);

  const confirmHandler = () => {
    dispatch(deleteUser({ id: props.id }))
      .unwrap()
      .then(() => dispatch(fetchAllUsers()))
      .catch((error) => console.log(error));
    setDeleteModal(false);
  };

  return (
    <tr>
      <td>{props.no}</td>
      <td>{props.firstname} {props.lastname }</td>
      <td>{props.username}</td>
      <td>{props.phone}</td>
      <td>{props.createdAt}</td>
      <td>{props.updatedAt}</td>
      <td className="text-center">
        <ActionIcon
          type="delete"
          onClick={onDeleteUser}
          disabled={isSelf}
          title={isSelf ? "You cannot delete your own account" : "Delete this user"}
        />
        {isDeleteModal && (
          <ConfirmModal
            title="Delete User"
            message={`Are you sure you want to delete user "${props.username}"?\nThis cannot be undone.`}
            confirmText="Delete"
            onCancel={closeHandler}
            onConfirm={confirmHandler}
          />
        )}
      </td>
    </tr>
  );
};

export default AdminUser;
