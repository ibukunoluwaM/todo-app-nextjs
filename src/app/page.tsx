"use client";
import { signIn } from "next-auth/react";
import React, { FormEvent, SetStateAction, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { routeModule } from "next/dist/build/templates/app-page";

export default function Page() {
  const router = useRouter();
  // sets the content of the error messgae
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [redirectMsg, setRedirectMsg] = useState<boolean>(false);
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);
  const [validationForm, setValidationForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValidationForm({ ...validationForm, [name]: value });
  }

  // handles new users sign up: credentials alone
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // loading schema
    setIsLoading(true);
    // checks if input isnt empty

    if (
      validationForm.email === "" ||
      validationForm.password === "" ||
      validationForm.passwordConfirm === "" ||
      validationForm.username === ""
    ) {
      setIsLoading(false);
      setShowErrorMsg(true);
      setErrorMsg(
        " Email, password and username are required for signup! Kindly supply all required details to proceed."
      );
      setTimeout(() => {
        setShowErrorMsg(false);
      }, 5000);
      return;
    }

    // if passwords don't match
    if (validationForm.password !== validationForm.passwordConfirm) {
      setErrorMsg("Passwords don't match. Enter the correct password.");
      setShowErrorMsg(true);
      setTimeout(() => {
        setShowErrorMsg(false);
      }, 3000);
      setIsLoading(false);
      return;
    }

    // saves sign in data
    const signUpResponse = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: validationForm.email,
        password: validationForm.password,
        username: validationForm.username,
      }),
    });

    // gets feedback from fetch api call
    const data = await signUpResponse.json();

    // handles sign in error
    if (!signUpResponse.ok) {
      setIsLoading(false);
      setErrorMsg(data.error || "Signup failed. Try again.");
      setShowErrorMsg(true);
      setTimeout(() => setShowErrorMsg(false), 3000);
      return;
    }

    // automatically signs new users in

    await signIn("credentials", {
      redirect: true,
      email: validationForm.email,
      password: validationForm.password,
      callbackUrl: "/todo",
    });
    setIsLoading(false);
    console.log(signUpResponse);
  }

  // hanled login loading
  function logInLoading() {
    router.push("/login");
    setIsLoginLoading(true);
  }

  // handle google sign in
  function handleGoogleSignIn() {
    setRedirectMsg(true);
    signIn("google", { callbackUrl: "/todo" });
  }

  return (
    <div className="w-[100%] h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-center text-xl font-bold">To-do App</h1>
      <p>Sign up to create an account</p>
      <form onSubmit={handleSubmit} className="w-[600px]">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box max-w-xl border p-4">
          <legend className="fieldset-legend text-lg">Sign Up</legend>
          {/* error message */}
          <p className={`text-red-600 ${showErrorMsg ? "" : "hidden"} `}>
            {errorMsg}
          </p>
          {/* username */}
          <div className="pb-3">
            <label className="pb-2" htmlFor="email">
              Username:
            </label>

            <div className="pt-2">
              <input
                id="username"
                required
                type="text"
                name="username"
                onChange={handleChange}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  const raw = e.target.value;
                  const formatted =
                    raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
                  setValidationForm({ ...validationForm, username: formatted });
                }}
                value={validationForm.username}
                className="w-full bg-transparent input input-accent pl-2  focus:outline-none py-3"
                placeholder="John Doe"
              />
            </div>
          </div>

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
            <img
              src="/trailingIcon.svg"
              alt=""
              className="cursor-pointer"
              onClick={() => setVisible(!visible)}
            />
          </div>

          {/* confirm password */}
          <label className="" htmlFor="password">
            Confirm password
          </label>

          <div className="flex border border-[#37cdbe] items-center px-2 rounded-md w-[100%]">
            <input
              type={visible ? "text" : "password"}
              name="passwordConfirm"
              onChange={handleChange}
              value={validationForm.passwordConfirm}
              placeholder="Confirm Password"
              // minlength="8"
              //pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              className="w-full bg-transparent input input-accent pl-2 border-none focus:outline-none py-3"
            />
            <img
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
              "Sign up"
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
          <span className="text-sm ml-2">Sign in with Google</span>
        </button>
      )}

      <button onClick={logInLoading} className="cursor-pointer underline">
        Have an account? Log in here
      </button>
      {isLoginLoading && (
        <span className="loading loading-dots loading-xl inline"></span>
      )}
    </div>
  );
}
