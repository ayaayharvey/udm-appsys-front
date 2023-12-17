import { domain } from "@/constants/constans";
import { formatDate } from "@/utils/formatDate";
import { getToken } from "@/utils/getAuthToken";
import { getDefaultAvatar } from "@/utils/getImagePath";
import {
  faClose,
  faEnvelope,
  faLocation,
  faLocationDot,
  faPhone,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import ConfirmModal from "../modal/confirmModal";
import Preloader from "../preloader/preloader";
import { checkUserRole } from "@/utils/checkUserRole";
import Alert from "../alert/alert";

type Appointment = {
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
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const Details = (props: Appointment) => {
  const {
    appointment_id,
    appointment_date,
    appointment_time,
    appointment_purpose,
    appointment_status,
    appointment_office,
    user_fullname,
    user_email,
    user_address,
    user_id,
    user_phone,
    user_avatar,
    onClose,
    with_personal_items,
  } = props;

  const [openModal, setOpenModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmText, setConfirmtext] = useState("");
  const [status, setStatus] = useState("");
  const [confirmBelongins, setConfirmBelongings] = useState(false);
  const [belongingsText, setBelonginsText] = useState("");
  const [items, setItems] = useState("");
  const [belongingsModal, setBelongingsModal] = useState(true);
  const [personal, setPersonal] = useState("");
  const [alert, setAlert] = useState(false);

  let officeToDispplay: string = "";

  switch (appointment_office) {
    case "OSA":
      officeToDispplay = "Office of Student Affairs";
      break;
    case "ICTO":
      officeToDispplay = "ICTO";
      break;
    case "Registrar":
      officeToDispplay = "Registrar";
      break;
    case "Guidance":
      officeToDispplay = "Guidance";
      break;
    case "CET":
      officeToDispplay = "College of Engineering & Technology";
      break;
    case "CAS":
      officeToDispplay = "College of Art & Science";
      break;
    case "CHS":
      officeToDispplay = "College of Health & Science";
      break;
    case "CBA":
      officeToDispplay = "College of Business Administration";
      break;
  }

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setConfirmModal(false);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("token missing");
      }

      const dataToUpdate = new FormData();
      dataToUpdate.append("id", appointment_id);
      dataToUpdate.append("status", status);
      dataToUpdate.append("office", appointment_office);

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

  const handleBelongingsConfirm = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setLoading(true);
    setConfirmBelongings(false);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("token missing");
      }

      const dataToUpdate = new FormData();
      dataToUpdate.append("userId", user_id);
      dataToUpdate.append("appointmentId", appointment_id);
      dataToUpdate.append("personalItems", items);

      const response = await fetch(`${domain}/api/belongings`, {
        method: "post",
        headers: { Authorization: token },
        body: dataToUpdate,
      });

      if (response.ok) {
        setPersonal(items);
        setOpenModal(true);
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
      `Are your sure you want to mark <b>${user_fullname}</b> as <b>No-show<b/>?`
    );
    setConfirmModal(true);
    setOpenModal(false);
  };

  const handleAttended = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setStatus("attended");
    setConfirmtext(
      `Are your sure you want to mark <b>${user_fullname}</b> as <b>Attended<b/>?`
    );
    setConfirmModal(true);
    setOpenModal(false);
  };

  useEffect(() => {
    const checkItems = async () => {
      try {
        const token = getToken();
        if (!token) {
          return new Error("token is missing");
        }

        const response = await fetch(
          `${domain}/api/belongings/${appointment_id}`,
          {
            method: "get",
            headers: { Authorization: token },
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log(result.items[0].personal_items);
          setPersonal(result.items[0].personal_items);
        } else {
          const result = await response.json();
          console.log(result);
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkItems();
  }, []);

  const handleWithItems = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (items == "") {
      return handleAlert();
    }

    setBelonginsText(
      `Are you sure <b>${user_fullname}</b> has personal items?`
    );
    setOpenModal(false);
    setConfirmBelongings(true);
  };

  const handleWithoutItems = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setBelonginsText(
      `Are you sure <b>${user_fullname}</b> has no personal items?`
    );
    setItems("none");
    setOpenModal(false);
    setConfirmBelongings(true);
  };

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setItems(value);
  };

  const handleAlert = () => {
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 3000);
  };

  return (
    <>
      {alert && <Alert message="Don't leave persontal items empyt!" />}
      {confirmModal && (
        <ConfirmModal
          header="Confirm Appointment"
          text={confirmText}
          onCancel={(e: React.MouseEvent<HTMLButtonElement>) => {
            setConfirmModal(false);
            setOpenModal(true);
          }}
          onConfirm={handleConfirm}
        />
      )}
      {confirmBelongins && (
        <ConfirmModal
          header="Confirm Personal Belongins"
          text={belongingsText}
          onCancel={(e: React.MouseEvent<HTMLButtonElement>) => {
            setConfirmBelongings(false);
            setOpenModal(true);
            setItems("");
          }}
          onConfirm={handleBelongingsConfirm}
        />
      )}
      {loading && (
        <div className="modal modal-open">
          <Preloader />
        </div>
      )}
      <dialog id="my_modal_1" className={`modal ${openModal && "modal-open"}`}>
        <div className="modal-box bg-gray-100 lg:w-8/12 lg:max-w-3xl w-12/12 max-w-4xl text-base lg:text-sm overflow-hidden">
          <header className="flex justify-between">
            <h1 className="lg:text-xl text-base font-semibold text-green-700">
              Visitor&apos;s Details
            </h1>
            <button
              className="lg:text-2xl text-xl hover:bg-gray-300 px-2 rounded-full"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
          </header>
          {checkUserRole() != "Guard" ? (
            <div className="my-4 border-b-2 border-gray-400 pb-4">
              <div className="lg:flex w-full">
                <div className="flex justify-center">
                  <div className="avatar">
                    <div className="rounded-full w-20 ring ring-green-700 ring-offset-1">
                      <Image
                        src={user_avatar ? user_avatar : getDefaultAvatar()}
                        width={100}
                        height={100}
                        alt="photo"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full lg:pl-3 lg:flex items-center sm:w-full">
                  <div className="w-fit overflow-hidden lg:border-r-2 border-green-700 pr-2">
                    <div className="w-full flex">
                      <div className="font-semibold lg:text-lg text-sm">
                        <p>{user_fullname}</p>
                      </div>
                    </div>
                    <div className="w-full flex">
                      <div className="flex justify-center items-center lg:mr-2 w-6 text-green-700">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </div>
                      <div className="lg:text-base text-xs">
                        <p>{user_email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-6/12 overflow-hidden lg:ml-2 flex items-center">
                    <div className="w-full">
                      <div className="w-full flex">
                        <div className="flex justify-center items-center lg:mx-2 w-6 text-green-700">
                          <FontAwesomeIcon icon={faLocationDot} />
                        </div>
                        <div className="lg:text-base text-xs">
                          <p>{user_address}</p>
                        </div>
                      </div>
                      <div className="w-full flex">
                        <div className="flex justify-center items-center lg:mx-2 w-6 text-green-700">
                          <FontAwesomeIcon icon={faPhone} />
                        </div>
                        <div className="lg:text-base text-xs">
                          <p>{user_phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full mb-3">
              <div className="avatar w-full flex justify-center p-3">
                <div className="rounded-full lg:w-20 w-16 ring ring-green-700 ring-offset-1">
                  <Image
                    src={user_avatar ? user_avatar : getDefaultAvatar()}
                    width={100}
                    height={100}
                    alt="photo"
                  />
                </div>
              </div>
              <div className="w-full border-b-2 border-gray-400 text-center pb-2 lg:text-lg">
                <p className="font-semibold">{user_fullname}</p>
              </div>
            </div>
          )}
          <div>
            <div className="flex lg:text-md text-sm">
              <div className="font-semibold text-green-700 mr-2">
                Office to be visited:
              </div>
              <div>{officeToDispplay}</div>
            </div>
            <div className="flex lg:text-md text-sm">
              <div className="font-semibold text-green-700 mr-2">Date:</div>
              <div>{formatDate(appointment_date)}</div>
            </div>
            <div className="flex lg:text-md text-sm">
              <div className="font-semibold text-green-700 mr-2">Time:</div>
              <div>{appointment_time}</div>
            </div>
            <div className="flex lg:text-md text-sm">
              <div className="font-semibold text-green-700 mr-2">Purpose:</div>
              <div>{appointment_purpose}</div>
            </div>

            {checkUserRole() == "Guard" &&
              (personal != "" ? (
                <div className="flex lg:text-md text-sm">
                  <div className="font-semibold text-green-700 w-36">
                    Personal Items:
                  </div>
                  <div className="w-full">{personal}</div>
                </div>
              ) : (
                <div className=" lg:text-md text-sm">
                  <div className="font-semibold text-green-700 mr-2 ">
                    Personal Items:
                  </div>
                  <div className="w-full">
                    <textarea
                      placeholder="Enter personal Items"
                      className="lg:text-base text-sm p-2 w-full bg-transparent border-2 border-gray-400 rounded-md resize-none"
                      onChange={handleTextArea}
                      name="items"
                      value={items}
                    />
                  </div>
                </div>
              ))}
          </div>
          <div>
            {checkUserRole() == "Guard" ? (
              personal == "" && (
                <div className="modal-action w-full flex justify-center lg:justify-end">
                  <button
                    className="btn lg:btn-md btn-xs bg-transparent text-green-700 border-gray-300 hover:bg-green-700 hover:text-white hover:border-green-700"
                    onClick={handleWithoutItems}
                  >
                    No Personal Items
                  </button>
                  <button
                    className="btn lg:btn-md btn-xs bg-transparent text-green-700 border-gray-300 hover:bg-green-700 hover:text-white hover:border-green-700"
                    onClick={handleWithItems}
                  >
                    With Personal Items
                  </button>
                </div>
              )
            ) : (
              <div className="modal-action">
                <button
                  className="btn bg-transparent text-green-700 border-gray-300 hover:bg-green-700 hover:text-white hover:border-green-700"
                  onClick={handleNoShow}
                >
                  Mark as No-Show
                </button>
                <button
                  className="btn bg-transparent text-green-700 border-gray-300 hover:bg-green-700 hover:text-white hover:border-green-700"
                  onClick={handleAttended}
                >
                  Mark as Attended
                </button>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Details;
