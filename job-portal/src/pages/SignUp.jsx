import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {auth } from '../firebase/firebase.config';
import { createUserWithEmailAndPassword } from "firebase/auth";

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    createUserWithEmailAndPassword(auth,email, password) // Change here
      .then((result) => {
        const user = result.user;
        console.log(user);
        alert("Signup successful!");
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.error("Signup error:", error); // Log error for debugging
        setErrorMessage(error.message); // Show actual error message
      });
  };


  return (
    <div className="h-screen mx-auto container flex items-center justify-center">
      <div className="w-full max-w-xs mx-auto">
        <form
          onSubmit={handleSignup}
          className="bg-white shadow-md rounded px-8 pt-8 pb-8 mb-4"
        >
          <h3 className="text-xl font-semibold mb-4">Create an Account</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="email"
              type="email"
              placeholder="name@email.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              name="password"
              type="password"
              placeholder="******************"
            />
            {/* Show error message if signup fails */}
            {errorMessage && (
              <p className="text-red-500 text-xs italic">
                {errorMessage}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <input
              className="bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              value="Sign up"
            />
          </div>

        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2023 JobPortal. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Signup;
