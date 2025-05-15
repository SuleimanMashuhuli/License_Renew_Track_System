import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";


const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/sign_up/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("User registered successfully!");
        setTimeout(() => navigate("/sign_in"), 2000);
      } else {
        setError(data?.message || "Failed to register");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-box">
       <div className="signup-left">
      <div className="left-overlay" />

          <img src="/logoWhite.png" className="scatter-logo logo1" alt="logo" />
          <img src="/logoWhite.png" className="scatter-logo logo2" alt="logo" />
          <img src="/logoWhite.png" className="scatter-logo logo3" alt="logo" />
          <img src="/logoWhite.png" className="scatter-logo logo4" alt="logo" />

        <div className="left-content">
          <p className="description">Amazingly.Better.Choice.</p>
        </div>
      </div>

      <div className="signup-right">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2 className="form-title">Register to login</h2>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
          <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />

          <button type="submit" className="submit-btn">
            Sign Up
          </button>

          <p className="login-link">
            Already have an account?{" "}
            <Link to="/sign_in" className="signin-link">
              Sign In
            </Link>
          </p>
        </form>
      </div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');



          .signup-box {
            display: flex;
            height: 100vh;
            width: 100vw;
            border-radius: 0;
            overflow: hidden;
            box-shadow: none;
          }

          .signup-left {
            width: 50%;
            position: relative;
            background-color: hsl(224.4, 64.3%, 32.9%);
            color: white;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
              align-items: center;
          }
          .left-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1;
          }
            .scatter-logo {
            position: absolute;
            width: 100px;
            opacity: 5; 
            mix-blend-mode: screen;
            z-index: 0;
          }

          .logo1 {
            top: 10%;
            left: 15%;
          }
          .logo2 {
            top: 40%;
            left: 60%;
          }
          .logo3 {
            bottom: 20%;
            left: 25%;
          }
          .logo4 {
            bottom: 10%;
            right: 15%;
          }

          .left-content {
            position: relative;
            z-index: 2;
            text-align: center;
            padding: 40px;
          }
          .description {
            font-size: 60px;
            color: #e5e7eb;
            text-align: center;
            font-family: "IBM Plex Mono", monospace;
            font-weight: 400;
            font-style: normal;
          }

          .signup-right {
            width: 50%;
            background: white;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          .signup-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 70%;
          }

          .form-title {
            text-align: center;
            color: #1e3a8a;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .signup-form input {
            padding: 10px 14px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
          }

          .submit-btn {
            background-color: hsl(224.4, 64.3%, 32.9%);
            color: white;
            padding: 10px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s ease;
          }

          .submit-btn:hover {
            background-color: #1d4ed8;
          }

          .error {
            color: #dc2626;
            text-align: center;
            font-size: 14px;
          }

          .success {
            color: #16a34a;
            text-align: center;
            font-size: 14px;
          }

          .login-link {
            text-align: center;
            font-size: 14px;
            margin-top: 8px;
          }

          .signin-link {
            color: #2563eb;
            text-decoration: none;
          }

          .signin-link:hover {
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            .signup-box {
              flex-direction: column;
              height: auto;
              min-height: 100vh;
            }

            .signup-left,
            .signup-right {
              width: 100%;
              padding: 30px;
            }

            .signup-left {
              align-items: center;
              text-align: center;
            }

            .learn-more-btn {
              margin: 20px auto 0 auto;
            }

            .form-title {
              font-size: 20px;
            }

            .signup-form input {
              font-size: 13px;
              padding: 8px 12px;
            }

            .submit-btn {
              font-size: 14px;
              padding: 10px;
            }

            .login-link {
              font-size: 13px;
            }
          }

        `}
      </style>
    </div>
  );
};

export default SignUp;
