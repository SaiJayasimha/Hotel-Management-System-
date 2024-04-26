import React, { useState } from "react";
import axios from "axios";

import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPasswordError, setShowPasswordError] = useState(false); // State to control the visibility of password error message

  async function register() {
    if (password === cpassword) {
      if (!isPasswordStrong(password)) {
        setShowPasswordError(true); // Show password error message if the password is not strong
        return;
      }

      const user = {
        name,
        email,
        password,
        cpassword,
      };

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const result = (await axios.post("/api/users/register", user)).data;
        console.log(result);
        setSuccess(result);
        setName("");
        setEmail("");
        setPassword("");
        setCpassword("");
      } catch (error) {
        console.log(error.response.data.message);
        setError(error.response.data.message); // Set the error message received from the server
      }

      setLoading(false);
    } else {
      alert("Password not matched");
    }
  }

  // Function to check if password is strong
  const isPasswordStrong = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/; // Regex pattern for strong password
    return regex.test(password);
  };

  return (
    <div>
      {loading && <Loader></Loader>}
      {error.length > 0 && <Error msg={error}></Error>}
      {success.length > 0 && <Success msg={success}></Success>}
      {showPasswordError && (
        <Error
          msg="Password must contain at least one capital letter, one number, and be at least 6 characters long."
          onClose={() => setShowPasswordError(false)} // Close the error message
        />
      )}

      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          <div className="bs">
            <h2>Register</h2>
            <input
              type="text"
              className="form-control"
              placeholder="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="password"
              className="form-control"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <input
              type="password"
              className="form-control"
              placeholder="confirm password"
              value={cpassword}
              onChange={(e) => {
                setCpassword(e.target.value);
              }}
            />
            {loading ? (
              <div>Registering... Please Wait...</div>
            ) : (
              <button className="btn btn-primary mt-3" onClick={register}>
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
