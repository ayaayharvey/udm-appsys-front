import { getDefaultAvatar } from "@/utils/getImagePath";
import React, { useState } from "react";
import Details from "./details";
import ConfirmModal from "../modal/confirmModal";
import Preloader from "../preloader/preloader";
import { getToken } from "@/utils/getAuthToken";
import { domain } from "@/constants/constans";
import { checkUserRole } from "@/utils/checkUserRole";

type Appointment = {
  appointment_date: string;
  appointment_id: string;
  appointment_time: string;
  appoinment_office: string;
  user_fullname: string;
  overstaying: boolean;
};

type DetailsType = {
  appointment_id: string;
  appointment_date: string;
  appointment_time: string;
  appointment_office: string;
  appointment_purpose: string;
  appointment_status: string;
  info_id: string;
  user_id: string;
  user_fullname: string;
  user_address: string;
  user_phone: string;
  user_avatar: string | null;
  user_email: string;
  with_personal_items: boolean;
};

const PersonDetails = (props: Appointment) => {
  const {
    appointment_date,
    appointment_id,
    appointment_time,
    user_fullname,
    appoinment_office,
    overstaying,
  } = props;
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmText, setConfirmtext] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<DetailsType>({
    appointment_id: "",
    appointment_date: "",
    appointment_time: "",
    appointment_office: "",
    appointment_status: "",
    appointment_purpose: "",
    info_id: "",
    user_id: "",
    user_fullname: "",
    user_address: "",
    user_phone: "",
    user_avatar: null,
    user_email: "",
    with_personal_items: false,
  });

  const handleSelected = async (e: React.MouseEvent<HTMLDivElement>) => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("token is missing!");
      }

      const response = await fetch(
        `${domain}/api/appointment-details/${appointment_id}`,
        {
          method: "get",
          headers: { Authorization: token },
        }
      );

      if (response.ok) {
        const result = await response.json();

        const buffer = Buffer.from(result.details[0]?.user_avatar.data);
        const base64Image = buffer.toString("base64");
        const avatarUrl = `data:image/png;base64,${base64Image}`;

        setSelected((prevData) => ({
          ...prevData,
          appointment_id: result.details[0]?.appointment_id,
          appointment_date: result.details[0]?.appointment_date,
          appointment_time: result.details[0]?.appointment_time,
          appointment_office: result.details[0]?.appointment_office,
          appointment_status: result.details[0]?.appointment_status,
          appointment_purpose: result.details[0]?.appointment_purpose,
          info_id: result.details[0]?.info_id,
          user_id: result.details[0]?.user_id,
          user_fullname: result.details[0]?.user_fullname,
          user_address: result.details[0]?.user_address,
          user_phone: result.details[0]?.user_phone,
          user_avatar: avatarUrl,
          user_email: result.details[0]?.user_email,
          with_personal_items: result.details[0]?.with_personal_items,
        }));

        setLoading(false);
        setOpenModal(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenModal(false);
  };

  const handleApprove = (e: React.MouseEvent<HTMLButtonElement>) => {
    setConfirmtext(
      `Are you sure to approve appointment with <strong>${name}</strong>?`
    );

    if (openModal) {
      setOpenModal(false);
    }

    setConfirmModal(true);
  };

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setConfirmModal(false);
    setOpenModal(false);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("token missing");
      }

      const dataToUpdate = new FormData();
      dataToUpdate.append("id", appointment_id);
      dataToUpdate.append("status", status);
      dataToUpdate.append("office", appoinment_office);

      const response = await fetch(`${domain}/api/appointment`, {
        method: "put",
        headers: { Authorization: token },
        body: dataToUpdate,
      });

      if (response.ok) {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const handleNoShow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setStatus("noshow");
    setConfirmtext(
      `Are your sure you want to mark <b>${selected.user_fullname}</b> as <b>No-show<b/>?`
    );
    setConfirmModal(true);
  };

  const handleAttended = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setStatus("attended");
    setConfirmtext(
      checkUserRole() == "Guard"
        ? `Are your sure you want to mark this visitor as <b>Out from Overstaying?<b/>`
        : `Are your sure you want to mark <b>${selected.user_fullname}</b> as <b>Attended<b/>?`
    );
    setConfirmModal(true);
  };

  return (
    <>
      {openModal && (
        <Details
          key={selected.appointment_id}
          appointment_id={selected.appointment_id}
          appointment_date={selected.appointment_date}
          appointment_time={selected.appointment_time}
          appointment_office={selected.appointment_office}
          appointment_purpose={selected.appointment_purpose}
          appointment_status={selected.appointment_status}
          info_id={selected.info_id}
          user_id={selected.user_id}
          user_fullname={selected.user_fullname}
          user_address={selected.user_address}
          user_phone={selected.user_phone}
          user_avatar={selected.user_avatar}
          user_email={selected.user_email}
          with_personal_items={selected.with_personal_items}
          onClose={handleClose}
        />
      )}

      {confirmModal && (
        <ConfirmModal
          header={
            checkUserRole() == "Guard"
              ? "Update Overstay"
              : "Confirm Appointment"
          }
          text={confirmText}
          onCancel={(e: React.MouseEvent<HTMLButtonElement>) =>
            setConfirmModal(false)
          }
          onConfirm={handleConfirm}
        />
      )}
      {loading && (
        <div className="modal modal-open">
          <Preloader />
        </div>
      )}

      <div className="w-full items-center my-2 rounded-t-md cursor-pointer hover:bg-gray-100">
        <div className="flex w-full " onClick={handleSelected}>
          <div className="w-8/12 flex items-center">
            <div className="avatar m-3">
              <div className="lg:w-12 w-12 rounded-xl">
                <img src={getDefaultAvatar()} />
              </div>
            </div>
            <div>
              <h1 className="lg:text-lg text-base font-semibold over">
                {user_fullname}
              </h1>
              <p className="stat-desc text-gray-400 ">Visitor&apos;s name</p>
            </div>
          </div>
          <div className="flex justify-end w-4/12 items-center">
            {overstaying && (
              <div className="bg-red-700 lg:p-3 p-1 lg:text-base text-sm rounded-md text-white mr-3">
                Overstaying
              </div>
            )}
            <div className="bg-green-700 lg:p-3 p-1 lg:text-base text-sm rounded-md text-white">
              {appointment_time} Session
            </div>
          </div>
        </div>
        {checkUserRole() != "Guard" ? (
          <div className="flex justify-end bg-gray-100 rounded-b-md">
            <button className="p-2 ml-1 text-green-700" onClick={handleNoShow}>
              Mark as No-Show
            </button>
            <button
              className="p-2 mr-1 text-green-700"
              onClick={handleAttended}
            >
              Mark as Attended
            </button>
          </div>
        ) : (
          <div className="flex justify-end bg-green-700 rounded-b-md"></div>
        )}
        {checkUserRole() == "Guard" && overstaying ? (
          <div className="flex justify-end bg-gray-100 rounded-b-md">
            <button className="p-2 mr-1 text-red-700" onClick={handleAttended}>
              Done Overstay
            </button>
          </div>
        ) : (
          <div className="flex justify-end bg-green-700 rounded-b-md"></div>
        )}
      </div>
    </>
  );
};
export default PersonDetails;
