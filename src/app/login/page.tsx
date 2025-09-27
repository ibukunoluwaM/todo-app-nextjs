"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
export default function Login() {
  // sets the content of the error messgae
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [redirectMsg, setRedirectMsg] = useState<boolean>(false);
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);
  const [validationForm, setValidationForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: validationForm.email,
      password: validationForm.password,
      callbackUrl: "/todo",
    });

    if (res?.error) {
      console.log("NextAuth error:", res.error);
      setErrorMsg(res.error);
      setShowErrorMsg(true);
      setIsLoading(false);
      setTimeout(() => {
        setShowErrorMsg(false);
      }, 4000);
      return;
    }
    window.location.href = "/todo";
    // setIsLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValidationForm({ ...validationForm, [name]: value });
  }

  // handle google sign in
  function handleGoogleSignIn() {
    setRedirectMsg(true);
    signIn("google", { callbackUrl: "/todo" });
  }

  return (
    <div className="w-[100%] h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-center text-xl font-bold">To-do App</h1>
      <p>Kindly enter your email address and your password to log in.</p>
      <form onSubmit={handleSubmit} className="w-[600px]">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box max-w-xl border p-4">
          <legend className="fieldset-legend text-lg">Log in</legend>
          {/* error message */}
          {showErrorMsg && (
            <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
          )}
          {/* email */}
          <div className="pb-3">
            <label className="pb-2" htmlFor="email">
              Enter Email
            </label>

            <div className="pt-2">
              <input
                id="email"
                type="email"
                name="email"
                onChange={handleChange}
                value={validationForm.email}
                className="w-full bg-transparent input input-accent pl-2  focus:outline-none py-3"
                placeholder="user@example.com"
              />
            </div>
          </div>

          {/* password */}
          <label className="" htmlFor="password">
            Enter Password
          </label>

          <div className="flex border border-[#37cdbe] items-center px-2 rounded-md w-[100%]">
            <input
              type={visible ? "text" : "password"}
              name="password"
              onChange={handleChange}
              value={validationForm.password}
              placeholder="Password"
              // minlength="8"
              //pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              className="w-full bg-transparent input input-accent pl-2 border-none focus:outline-none py-3"
            />
            <Image
              src="/trailingIcon.svg"
              alt=""
              className="cursor-pointer"
              onClick={() => setVisible(!visible)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#37cdbe] p-3 rounded-md text-white mt-3 hover:bg-gray-200 hover:text-black cursor-pointer"
          >
            {isLoading ? (
              <span className="loading loading-dots loading-xl"></span>
            ) : (
              "Log in"
            )}
          </button>
        </fieldset>
      </form>
      {redirectMsg ? (
        <p className="mt-2">Redirecting...</p>
      ) : (
        <button
          onClick={handleGoogleSignIn}
          className="mt-3 bg-white p-2 hover:bg-gray-200 focus:bg-[#37cdbe] rounded-md cursor-pointer flex justify-center items-center"
        >
          <FontAwesomeIcon
            icon={faGoogle}
            style={{ color: "#63E6BE", fontSize: "24px" }}
          />
          <span className="text-sm ml-2">Continue with Google</span>
        </button>
      )}
    </div>
  );
}
