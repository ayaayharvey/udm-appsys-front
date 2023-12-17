import { formatDate } from "@/utils/formatDate";
import { getDefaultAvatar } from "@/utils/getImagePath";
import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ConfirmModal from "../modal/confirmModal";
import { domain } from "@/constants/constans";
import { getToken } from "@/utils/getAuthToken";
import { checkUserRole } from "@/utils/checkUserRole";
import Preloader from "../preloader/preloader";

type Request = {
  id: string;
  name: string;
  date: string;
  time: string;
  office: string;
  email: string;
};

const RecentReqDetails = () => {
  const [request, setRequest] = useState<Request>({
    id: "",
    name: "",
    date: "",
    time: "",
    office: "",
    email: "",
  });

  const [avatar, setAvatar] = useState(getDefaultAvatar());
  const [modalApprove, setModalApprove] = useState(false);
  const [modalReject, setModalReject] = useState(false);
  const [modalText, setModalText] = useState("");
  const [activeRequest, setActiveRequest] = useState<Request>({
    id: "",
    name: "",
    date: "",
    time: "",
    office: "",
    email: "",
  });
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const socket = io(`${domain}`, {
      transports: ["websocket"],
    });

    socket.connect();
    socket.emit("joinRoom", checkUserRole());

    socket.on("new_request", (request) => {
      const [
        {
          appointment_id,
          appointment_date,
          appointment_office,
          appointment_time,
          user_fullname,
          user_avatar,
          user_email,
        },
      ] = request;
      setRequest((prevData) => ({
        ...prevData,
        id: appointment_id,
        name: user_fullname,
        date: formatDate(appointment_date),
        time: appointment_time,
        office: appointment_office,
        email: user_email,
      }));

      if (user_avatar) {
        const buffer = Buffer.from(user_avatar);

        const base64Image = buffer.toString("base64");
        const avatarUrl = `data:image/png;base64,${base64Image}`;

        setAvatar(avatarUrl);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const onCancelApproval = (e: React.MouseEvent<HTMLButtonElement>) => {
    setModalApprove(false);
  };

  const onConfirmApproval = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setModalApprove(false);
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("token missing");
      }

      const dataToUpdate = new FormData();
      dataToUpdate.append("id", activeRequest?.id);
      dataToUpdate.append("email", activeRequest?.email);
      dataToUpdate.append("name", activeRequest.name);
      dataToUpdate.append("office", activeRequest.office);
      dataToUpdate.append("date", activeRequest.date);
      dataToUpdate.append("time", activeRequest.time);
      dataToUpdate.append("status", "approved");

      const response = await fetch(`${domain}/api/appointment`, {
        method: "put",
        headers: { Authorization: token },
        body: dataToUpdate,
      });

      if (response.ok) {
        if (activeRequest.id == request.id) {
          setRequest(() => ({
            id: "",
            name: "",
            date: "",
            time: "",
            office: "",
            email: "",
          }));
        }
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleApprove = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveRequest(request);
    setModalText(
      `Are you sure to approve appointment with <strong>${request.name}</strong>?`
    );
    setModalApprove(true);
  };

  const handleReject = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveRequest(request);
    setModalText(
      `Are you sure to reject appointment with <strong>${request.name}</strong>?`
    );
    setModalReject(true);
  };

  const onCancelReject = (e: React.MouseEvent<HTMLButtonElement>) => {
    setModalReject(false);
  };

  const onConfirmReject = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setModalReject(false);
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("token missing");
      }

      const dataToUpdate = new FormData();
      dataToUpdate.append("id", activeRequest?.id);
      dataToUpdate.append("email", activeRequest?.email);
      dataToUpdate.append("name", activeRequest.name);
      dataToUpdate.append("office", activeRequest.office);
      dataToUpdate.append("date", activeRequest.date);
      dataToUpdate.append("time", activeRequest.time);
      dataToUpdate.append("status", "rejected");

      const response = await fetch(`${domain}/api/appointment`, {
        method: "put",
        headers: { Authorization: token },
        body: dataToUpdate,
      });

      if (response.ok) {
        if (activeRequest.id == request.id) {
          setRequest(() => ({
            id: "",
            name: "",
            date: "",
            time: "",
            office: "",
            email: "",
          }));
        }
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {loading && (
        <div className="modal modal-open">
          <Preloader />
        </div>
      )}
      {modalApprove && (
        <ConfirmModal
          key="approve"
          text={modalText}
          header="Confirm your Approval"
          onCancel={onCancelApproval}
          onConfirm={onConfirmApproval}
        />
      )}
      {modalReject && (
        <ConfirmModal
          key="reject"
          text={modalText}
          header="Confirm your Rejection"
          onCancel={onCancelReject}
          onConfirm={onConfirmReject}
        />
      )}
      {request.date != "" ? (
        <div className="w-full items-center my-2 rounded-t-md cursor-pointer hover:bg-gray-100">
          <div className="flex w-full ">
            <div className="w-7/12 flex items-center">
              <div className="avatar m-3">
                <div className="w-12 rounded-full">
                  <img src={avatar} />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-semibold over">{request.name}</h1>
                <p className="stat-desc text-gray-400">Visitor&apos;s name</p>
              </div>
            </div>
            <div className="flex justify-center w-5/12 items-center">
              <div className="flex items-center mr-2">
                <FontAwesomeIcon
                  className="p-1 text-green-700"
                  icon={faCalendar}
                />
                <div>{request.date}</div>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon
                  className="p-1 text-green-700"
                  icon={faClock}
                />
                <div>{request.time}</div>
              </div>
            </div>
          </div>
          <div className="flex justify-end bg-gray-100 rounded-b-md">
            <button className="p-2 ml-1 text-green-700" onClick={handleReject}>
              Reject
            </button>
            <button className="p-2 mr-1 text-green-700" onClick={handleApprove}>
              Approve
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full p-6 flex justify-center text-gray-400">
          No recent request.
        </div>
      )}
    </>
  );
};

export default RecentReqDetails;
