"use client";
import { checkUserRole } from "@/utils/checkUserRole";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/navbar";
import AdminNav from "../components/admin-navbar/adminnav";
import { domain } from "@/constants/constans";
import { getToken } from "@/utils/getAuthToken";
import Footer from "../components/footer/footer";
import DailyAppointment from "../components/daily-appointment/dailyAppointment";

const Page = () => {
  const { push } = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const authUser = async () => {
      try {
        const role = checkUserRole();
        if (role == "visitor") {
          return push("/home");
        } else if (role == "admin") {
          push("/admin-dashboard");
        }
      } catch (err) {
        return push("/login");
      }
    };

    setAuthorized(true);
    authUser();
  }, []);

  useEffect(() => {
    const getUsername = async () => {
      try {
        const token = getToken();
        if (!token) {
          push("/login");
          return new Error("token missing!");
        }

        const response = await fetch(`${domain}/api/employee-profile`, {
          method: "get",
          headers: { Authorization: token },
        });

        if (response.ok) {
          const result = await response.json();
          setUsername(result?.profile[0].user_fullname);
        }
      } catch (err) {
        console.log(err);
        return push("/login");
      }
    };

    getUsername();
  }, []);

  return (
    <>
      <div className="h-full relative">
        <AdminNav />
        <div className="w-full px-2 lg:px-16 lg:pt-11 pt-6 pb-4 flex">
          <header className="mx-2">
            <h1 className="lg:text-4xl text-2xl font-extrabold text-green-700">
              Hi, {username}.
            </h1>
            <p className="text-gray-500 mt-2 sm:text-sm">
              Let&apos;s track your appointment daily.
            </p>
          </header>
        </div>
        <div className="w-full flex lg:px-16 px-4">
          <DailyAppointment />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Page;
