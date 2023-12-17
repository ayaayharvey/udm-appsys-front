"use client";
import React, { MouseEventHandler, useEffect, useState } from "react";
import Navbar from "../components/navbar/navbar";
import { useRouter } from "next/navigation";
import { userAuthentication } from "@/auth/userAuth";
import { getToken } from "@/utils/getAuthToken";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./styles.css";
import Footer from "../components/footer/footer";
import SubmitButton from "../components/buttons/submitButton";
import Preloader from "../components/preloader/preloader";
import ConfirmModal from "../components/modal/confirmModal";
import Alert from "../components/alert/alert";
import Toast from "../components/toast/toast";
import moment from "moment-timezone";
import { checkUserRole } from "@/utils/checkUserRole";
import { domain } from "@/constants/constans";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type appointmentData = {
  date: string;
  office: string;
  time: string;
  purpose: string;
};

const Home = () => {
  const { push } = useRouter();
  const [date, setDate] = useState<Date>();
  const [appointment, setAppointment] = useState<appointmentData>({
    date: "",
    office: "",
    time: "",
    purpose: "",
  });

  const [showLoader, setShowLoader] = useState(false);
  const [minDate, setMinDate] = useState<Date>();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [toastText, setToastText] = useState("");

  // set date selection
  useEffect(() => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 2);
    setMinDate(currentDate);
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAppointment((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAppointment((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppointment((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (
    value: Value,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (value instanceof Date) {
      // Convert the date to the Philippines timezone ('Asia/Manila')
      const formattedDate = moment(value)
        .tz("Asia/Manila")
        .format("YYYY-MM-DD");

      setAppointment((prevData) => ({
        ...prevData,
        date: formattedDate,
      }));
    }
  };

  const HandleSubmitAppointment = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const isValid = await validateInput(appointment);
      if (isValid) {
        setDialogOpen(true);
      }
    } catch (err: any) {
      setAlertMessage(err?.message);
      handleShowAlert();
    }
  };

  const handleOnCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    return setDialogOpen(false);
  };

  const handleOnConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setDialogOpen(false);
      setShowLoader(true);

      const token = getToken();
      if (!token) {
        throw new Error("Unauthorized");
      }

      const appointmentToSend = new FormData();
      appointmentToSend.append("date", appointment.date);
      appointmentToSend.append("office", appointment.office);
      appointmentToSend.append("time", appointment.time);
      appointmentToSend.append("purpose", appointment.purpose);

      const response = await fetch(`${domain}/api/appointment`, {
        method: "POST",
        headers: { Authorization: token },
        body: appointmentToSend,
      });

      if (response.ok) {
        setAppointment(() => ({
          date: "",
          office: "",
          time: "",
          purpose: "",
        }));
        setToastText("Appointment sent.");
        handleShowToast();
        setShowLoader(false);
      }
    } catch (err: any) {
      setShowLoader(false);
      setAlertMessage(err?.message);
    }
  };

  // alert handler.
  const handleShowAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 3000);
  };

  // toast handler.
  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  if (showLoader) {
    return (
      <div className="h-full relative">
        <div className="flex w-full lg:items-center justify-center lg:h-full">
          <Preloader />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {dialogOpen && (
        <ConfirmModal
          key="confirm modal"
          header="Confirm appointment"
          text="Are you ready to schedule your appointment and submit your request?"
          onCancel={handleOnCancel}
          onConfirm={handleOnConfirm}
        />
      )}
      {showAlert && <Alert message={alertMessage} />}
      {showToast && <Toast text={toastText} />}
      <Navbar key="navbar" />
      <>
        <div className="my-6">
          <div className="w-full px-12 lg:py-6 py-4 flex items-center justify-center">
            <h1 className="lg:w-10/12 lg:text-2xl text-xl font-bold text-green-700 text-center">
              Make an appointment
            </h1>
          </div>
          <form onSubmit={HandleSubmitAppointment}>
            <div className="w-full lg:flex justify-center">
              <div className="lg:w-5/12 p-4 flex items-center justify-center">
                <Calendar
                  className="p-4"
                  minDate={minDate}
                  value={date}
                  onChange={handleDateChange}
                />
              </div>
              <div className="lg:w-4/12 py-4">
                <div className="w-full px-4 pb-4 flex justify-center">
                  <div className="w-full lg:text-base text-sm bg-gray-300 p-4 rounded-md">
                    <p className="italic">
                      <strong>Reminder:</strong> Please choose your preferred
                      time for the appointment: <br />
                      <br />
                      <strong>Morning (AM):</strong> 8 AM - 12 PM
                      <br />
                      <strong>Afternoon (PM):</strong> 1 PM - 5 PM
                      <br />
                      <br />
                      Stay tuned for the confirmation email.
                    </p>
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <div className="w-8/12">
                    <div className="">
                      <label
                        htmlFor=""
                        className="text-green-700 font-semibold"
                      >
                        Office to be visited
                      </label>
                      <select
                        className="lg:w-full w-11/12 p-2 bg-transparent rounded-md border-2 border-gray-400"
                        name="office"
                        value={appointment.office}
                        onChange={handleSelectChange}
                      >
                        <option value="">None</option>
                        <option value="OSA">Office of Student Affairs</option>
                        <option value="ICTO">ICTO</option>
                        <option value="Registrar">Registrar</option>
                        <option value="Guidance">Guidance</option>
                        <option value="CET">
                          College of Engineering & Technology
                        </option>
                        <option value="CAS">College of Art & Science</option>
                        <option value="CHS">College of Health Science</option>
                        <option value="CBA">
                          College of Business Administration
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="w-3/12 flex justify-end">
                    <div className="w-fit">
                      <div>
                        <label
                          htmlFor=""
                          className="text-green-700 font-semibold"
                        >
                          Time
                        </label>
                      </div>
                      <div id="Time" className="join flex justify-center">
                        <input
                          className="join-item btn btn-sm border-gray-400 border-2 hover:bg-gray-300 hover:border-gray-300"
                          type="radio"
                          name="time"
                          aria-label="AM"
                          value="AM"
                          onChange={handleInputChange}
                        />
                        <input
                          className="join-item btn btn-sm border-gray-400 border-2 hover:bg-gray-300 hover:border-gray-300"
                          type="radio"
                          name="time"
                          aria-label="PM"
                          value="PM"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full p-5 flex justify-center">
                  <div className="w-full">
                    <label htmlFor="" className="text-green-700 font-semibold">
                      Purpose to visit
                    </label>
                    <textarea
                      className="w-full bg-transparent border-gray-400 border-2 rounded-md px-3 py-2 resize-none min-h-16"
                      placeholder="Aa"
                      name="purpose"
                      value={appointment.purpose}
                      onChange={handleTextareaChange}
                    />
                  </div>
                </div>
                <div className="px-4">
                  <SubmitButton
                    key="Appointment-btn"
                    id="appointment"
                    text="Submit appointment"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <Footer />
      </>
    </div>
  );
};

function validateInput(data: appointmentData): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const { date, office, time, purpose } = data;

    if (date === null || date === "") {
      reject(new Error("Select a date!"));
    }

    if (office === "" || time === "" || purpose === "") {
      reject(new Error(`Don't leave any field empty!`));
    }

    resolve(true);
  });
}

export default Home;
