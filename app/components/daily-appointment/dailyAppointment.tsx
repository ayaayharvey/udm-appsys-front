import {
  faCalendar,
  faCircleExclamation,
  faInfoCircle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import PersonDetails from "./personDetails";
import { domain } from "@/constants/constans";
import { checkUserRole } from "@/utils/checkUserRole";
import { getToken } from "@/utils/getAuthToken";
import { io } from "socket.io-client";
import { formatDate } from "@/utils/formatDate";

type Appointment = {
  appointment_date: string;
  appointment_id: string;
  appointment_office: string;
  appointment_time: string;
  appointment_status: string;
  user_fullname: string;
  overstaying: boolean;
};

const DailyAppointment = () => {
  const [todaysAppointment, setTodaysAppointment] = useState<Appointment[]>([]);
  const [notifCount, setNotifCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredAppointments = todaysAppointment.filter((appointment) => {
    return appointment.user_fullname
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    const socket = io(`${domain}`, {
      transports: ["websocket"],
    });

    socket.connect();
    socket.emit("joinRoom", checkUserRole());

    socket.on("appointment_update", (update) => {
      const { id, status } = update;
      if (status == "noshow" || status == "attended") {
        setTodaysAppointment((prevAppointments) => {
          const updatedAppointments = prevAppointments.filter((appointment) => {
            return appointment.appointment_id != id;
          });
          return updatedAppointments;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getTodaysAppointment = async () => {
    console.log("guard fetch");
    const date = getCurrentDate();
    const office = checkUserRole();

    const token = getToken();

    if (!token) {
      return new Error("token is missing");
    }

    try {
      const response = await fetch(
        `${domain}/api/daily-appointment/${date}/${office}`,
        {
          method: "get",
          headers: { Authorization: token },
        }
      );

      // http://localhost:8084/api/appointment-notification/2023-12-13/Guard
      const notifResponse = await fetch(
        `${domain}/api/appointment-notification/${date}/${office}`,
        {
          method: "get",
          headers: { Authorization: token },
        }
      );

      if (response.ok && notifResponse.ok) {
        const result = await response.json();
        const notif = await notifResponse.json();

        let final = result.appointments
          ? JSON.parse(JSON.stringify(result.appointments))
          : [];

        if (notif.notifications && notif.notifications.length > 0) {
          setNotifCount(notif.notifications.length);
          final = final.map((x: any) => {
            const index = notif.notifications.findIndex(
              (y: any) => y.appointment_id == x.appointment_id
            );
            if (index > -1) {
              x.overstaying = true;
            }
            return x;
          });
        } else setNotifCount(0);

        setTodaysAppointment(final);
      } else {
        const result = await response.json();
        console.log(result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const socket = io(`${domain}`, {
      transports: ["websocket"],
    });

    socket.connect();
    socket.emit("joinRoom", checkUserRole());

    console.log(checkUserRole(), "guard join");

    socket.on("guard_appointment_update", () => {
      console.log("guard emitted");
      getTodaysAppointment();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    getTodaysAppointment();
  }, []);

  return (
    <div className="w-full">
      <div className="bg-white shadow-md rounded-md lg:px-6 px-3">
        <header className="pt-6 pb-2 w-full border-b-2 border-gray-300">
          <div className="lg:flex justify-between">
            <h1 className="font-bold lg:text-2xl text-lg text-green-700">
              Today&apos;s appointments.
            </h1>
            <div className="flex items-center">
              <FontAwesomeIcon
                className="lg:p-2 lg:text-lg text-sm text-green-700"
                icon={faCalendar}
              />
              <p className="lg:text-base text-sm ml-1">
                {formatDate(getCurrentDate())}
              </p>
            </div>
          </div>
          <div className="w-full my-2">
            <div className="input-group focus-within:border-2 focus-within:border-green-700 w-full rounded-lg">
              <input
                type="text"
                className="w-full bg-gray-200 p-3 outline-none"
                placeholder="Search visitors name"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
              <button className="px-4 py-3 bg-gray-200 border-l-2 border-white hover:bg-gray-300">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>
          <div className="text-gray-400 flex items-center">
            <FontAwesomeIcon
              className="p-1 text-yellow-400"
              icon={faInfoCircle}
            />
            <p className="lg:text-base text-sm">
              Expect {todaysAppointment.length} visitors today.
            </p>
          </div>
          <div className="text-gray-400 flex items-center">
            <FontAwesomeIcon className="p-1 text-red-400" icon={faInfoCircle} />
            <p className="lg:text-base text-sm">
              There {notifCount == 1 ? "is" : "are"} {notifCount} overstaying
              {notifCount == 1 ? " visitor." : " visitors."}
            </p>
          </div>
        </header>
        <main className="h-96 max-h-96 overflow-y-scroll">
          {searchQuery == "" ? (
            todaysAppointment.length > 0 ? (
              todaysAppointment.map((appointment) => (
                <PersonDetails
                  key={appointment.appointment_id}
                  appointment_date={appointment.appointment_date}
                  appointment_id={appointment.appointment_id}
                  appointment_time={appointment.appointment_time}
                  appoinment_office={appointment.appointment_office}
                  user_fullname={appointment.user_fullname}
                  overstaying={appointment.overstaying}
                />
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 lg:text-base text-sm">
                There&apos;s no expected appointment today.
              </div>
            )
          ) : filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <PersonDetails
                key={appointment.appointment_id}
                appointment_date={appointment.appointment_date}
                appointment_id={appointment.appointment_id}
                appointment_time={appointment.appointment_time}
                appoinment_office={appointment.appointment_office}
                user_fullname={appointment.user_fullname}
                overstaying={appointment.overstaying}
              />
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400 lg:text-base text-sm">
              No item found.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

function getCurrentDate(): string {
  // Create a new Date object for the current date
  const currentDate = new Date();

  // Get the year, month, and day from the Date object
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(currentDate.getDate()).padStart(2, "0");

  // Create the formatted date string
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate; // Output: "2023-10-27"
}

export default DailyAppointment;
