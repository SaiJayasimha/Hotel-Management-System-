import React, { useState, useEffect } from "react";
import axios from "axios";

import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [captchaMatch, setCaptchaMatch] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 5; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptcha(captcha);
  };

  const handleCaptchaInputChange = (e) => {
    setInputCaptcha(e.target.value);
    if (e.target.value === captcha) {
      setCaptchaMatch(true);
    } else {
      setCaptchaMatch(false);
    }
  };

  const handleLogin = async () => {
    if (!captchaMatch) {
      setError("Captcha is wrong. Please try again.");
      return;
    }

    setLoading(true);
    const user = {
      email,
      password,
    };

    try {
      const result = (await axios.post("/api/users/login", user)).data;
      localStorage.setItem("currentUser", JSON.stringify(result));
      window.location.href = "/home";
    } catch (error) {
      setError("Invalid Credentials");
    }

    setLoading(false);
  };

  return (
    <div>
      {loading && <Loader />}

      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {error && <Error msg={error} />}
          <div className="bs">
            <h2>Login</h2>

            <input
              type="text"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="captcha-container">
              <div className="captcha-box">{captcha}</div>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Captcha"
                value={inputCaptcha}
                onChange={handleCaptchaInputChange}
              />
            </div>
            <button className="btn btn-primary mt-3" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
