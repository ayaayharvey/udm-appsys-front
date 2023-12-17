"use client";
import React, { useEffect, useState } from "react";
import Footer from "../components/footer/footer";
import InputField from "../components/input-field/inputField";
import SubmitButton from "../components/buttons/submitButton";
import Link from "next/link";
import Alert from "../components/alert/alert";
import Preloader from "../components/preloader/preloader";
import { useRouter } from "next/navigation";
import Toast from "../components/toast/toast";
import Header from "../components/header/header";
import Cookies from "js-cookie";
import { userAuthentication } from "@/auth/userAuth";
import { domain } from "@/constants/constans";
import { checkUserRole } from "@/utils/checkUserRole";
import ForgotPassword from "./forgotPassword";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const { push } = useRouter();
  const isAuthorized = userAuthentication();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [forgot, setForgot] = useState(false);

  useEffect(() => {
    if (isAuthorized) {
      const role = checkUserRole();
      if (role == "visitor") {
        push("/home");
      } else if (role == "Guard") {
        push("/guard-dashboard");
      } else {
        push("/admin-dashboard");
      }
    }
  }, []);

  // input change handler.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // submit form handler.
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // check if input or formData is allowed.
      setShowLoader(true);
      await validateInput(formData);

      // create a form data to send in server.
      const dataToLogin = new FormData();
      dataToLogin.append("email", formData.email);
      dataToLogin.append("password", formData.password);

      // pass the form data to server and authenticate.
      const response = await fetch(`${domain}/api/login-authentication`, {
        method: "POST",
        body: dataToLogin,
      });

      // wait for the response.
      const result = await response.json();
      const { status, token, role } = result;
      if (response.ok) {
        handleShowToast();
        Cookies.set("jwtToken", token);
        if (role === "visitor") {
          push("/home");
        } else if (role == "admin") {
          push("/admin-dashboard");
        } else if (role == "Guard") {
          push("/guard-dashboard");
        }
      } else {
        throw new Error(status);
      }
    } catch (err: any) {
      setShowLoader(false);
      setAlertMessage(err.message);
      handleShowAlert();
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

  const handleForgotPassword = (e: React.MouseEvent<HTMLParagraphElement>) => {
    setForgot(true);
  };

  const closeForgotPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    setForgot(false);
  };

  return (
    <>
      <div className="relative h-full">
        {forgot && <ForgotPassword close={closeForgotPassword} />}
        {showAlert && <Alert message={alertMessage} />}
        {showToast && <Toast text="Login successfull!" />}
        <Header />
        {showLoader ? (
          <div
            className="
            flex w-full lg:items-center justify-center"
          >
            <Preloader />
          </div>
        ) : (
          <>
            <div className="flex w-full lg:items-center justify-center">
              <div className="lg:w-4/12 w-full px-6 lg:px-6 py-12 lg:bg-white lg:m-12 lg:rounded-lg lg:shadow-lg">
                <h3 className="lg:text-2xl text-lg font-semibold text-green-700">
                  Login
                </h3>
                <div className="mt-4">
                  <form onSubmit={handleSubmitForm}>
                    <InputField
                      key="email"
                      id="email"
                      placeholder="test@example.com"
                      name="email"
                      text="Enter your registered email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <InputField
                      key="password"
                      id="password"
                      placeholder="Check your caps-lock"
                      name="password"
                      text="Enter your password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <div className="w-full text-right my-2 text-blue-400 text-sm">
                      <p onClick={handleForgotPassword}>Forgot password?</p>
                    </div>
                    <SubmitButton key="login" id="login" text="Login" />
                  </form>
                  <div className="flex w-full justify-center mt-2">
                    <div>
                      <span>Don&apos;t have an account? </span>
                      <span className="text-green-700">
                        <Link href="/signup">Sign up</Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </>
        )}
      </div>
    </>
  );
};

// to validate login form input.
function validateInput(data: LoginForm): Promise<boolean> {
  const { email, password } = data;
  return new Promise((resolve, reject) => {
    if (email == "" || password == "") {
      reject(new Error(`Don't leave any field empty!`));
    }

    if (!email.includes("@") || !email.includes(".com")) {
      reject(new Error(`Enter a valid email!`));
    }

    resolve(true);
  });
}

export default Login;
