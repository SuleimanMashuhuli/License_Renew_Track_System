import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpSession, setOtpSession] = useState(null);
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

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/sign_in/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.redirect === "set-password") {
        
          navigate("/set-password", { state: { userId: data.user_id } });
        } else {
          
          localStorage.setItem("otp_token", data.otp_token);
          setOtpSession(data.otp_token); 
        }
      } else {
        setError(data?.message || "Invalid credentials");
      }
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (index, value) => {
    if (/[^0-9]/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    const otpToken = localStorage.getItem("otp_token");
    if (!otpToken) {
      setError("OTP token is missing. Please log in again.");
      return;
    }

    try {
      console.log("Sending OTP session:", otpSession);
      console.log("Sending OTP code:", otpCode);

      const res = await fetch("http://127.0.0.1:8000/api/user/verify_otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp_token: otpSession,
          otp: otpCode.toString(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.removeItem("otp_token"); 
        navigate("/layout");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/user/resend_otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp_token: otpSession }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("OTP resent:", data.message);
        alert("A new OTP has been sent to your email.");
        setOtpSession(data.otp_token); 
      } else {
        setError(data.message || "Unable to resend OTP.");
      }
    } catch {
      setError("An error occurred while resending the OTP.");
    }
  };


  return (
    <div className="signin-box">
      <div className="signin-left">
      <div className="left-overlay" />

          <img src="/logoWhite.png" className="scatter-logo logo1" alt="logo" />
          <img src="/logoWhite.png" className="scatter-logo logo2" alt="logo" />
          <img src="/logoWhite.png" className="scatter-logo logo3" alt="logo" />
          <img src="/logoWhite.png" className="scatter-logo logo4" alt="logo" />

        <div className="left-content">
          <p className="description">Amazingly.Better.Choice.</p>
        </div>
      </div>

      <div className="signin-right">
        {otpSession === null ? (
          <form onSubmit={handleSubmit} className="signin-form">
            <img src="/logO.jpg" className="form-logo" alt="logo" />
            <h2 className="form-title">Login to your account</h2>
            {error && <p className="error">{error}</p>}

            <input
              type="text"
              name="username"
              placeholder="Email or Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <div className="password-wrapper">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="show-hide-icon" onClick={togglePasswordVisibility}>
                <i className={passwordVisible ? "fa fa-eye-slash" : "fa fa-eye"}></i>
              </span>
            </div>

            <div className="form-options">
              <label className="form-check-label">
                <input type="checkbox" className="form-check-input" /> Remember me
              </label>
              <Link to="/forgot_password" className="signin-link">Forgot password?</Link>
            </div>

            <button type="submit" className="submit-btn">Login</button>

            <p className="login-link">
              Don’t have an account?{" "}
              <Link to="/sign_up" className="signin-link">Register</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="signin-form">
            <h2 className="form-title">Enter the OTP we emailed you</h2>
            {error && <p className="error">{error}</p>}
            <div className="otp-inputs">
              {otp.slice(0, 3).map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="otp-slot"
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
              <span className="otp-hyphen">-</span>
              {otp.slice(3).map((digit, index) => (
                <input
                  key={index + 3}
                  id={`otp-input-${index + 3}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index + 3, e.target.value)}
                  className="otp-slot"
                  aria-label={`OTP digit ${index + 4}`}
                />
              ))}
            </div>

            <div className="button-row">
              <button type="submit" className="verify-btn" disabled={otp.join("").length !== 6}>
                Verify
              </button>
              <button type="button" className="resend-btn" onClick={handleResend}>
                Resend Code
              </button>
            </div>
          </form>
        )}
      </div>

      <style>
  {`
 @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');



.signin-box {
  display: flex;
  height: 100vh;
  width: 100vw;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
}

.signin-left {
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

.signin-right {
  width: 50%;
  background: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.form-logo {
  width: 20%;
  height: auto;
  margin: 0 auto 0px auto;
  display: block;
}

.signin-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 60%;
  max-width: 600px;
}

.form-title {
  text-align: center;
  color: #1e3a8a;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.signin-form input {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  width: 100%; 
}

.password-wrapper {
  position: relative;
}

.show-hide-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.submit-btn {
  background-color: hsl(224.4, 64.3%, 32.9%);
  color: white;
  padding: 8px 16px; 
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%; 
  margin-top: 12px;
}

.submit-btn:hover {
  background-color: #1d4ed8;
}

.error {
  color: #dc2626;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  
}
  .otp-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.otp-slot {
  width: 36px;
  height: 36px;
  font-size: 24px;
  text-align: center;
  border: 1.5px solid #ccc;
  border-radius: 6px;
  outline-offset: 2px;
  transition: border-color 0.2s ease;
}

.otp-slot:focus {
  border-color: hsl(224, 70%, 50%);
  box-shadow: 0 0 5px hsl(224, 70%, 70%);
}

.otp-hyphen {
  font-size: 28px;
  font-weight: bold;
  margin: 0 8px;
  user-select: none;
}


.button-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.verify-btn,
.resend-btn {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.verify-btn {
  background-color: hsl(224, 64%, 33%);
  color: white;
}

.verify-btn:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
}

.verify-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.resend-btn {
  background-color: #e5e7eb;
  color: #374151;
}

.resend-btn:hover {
  background-color: #d1d5db;
}


@media (max-width: 768px) {
  .signin-box {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .signin-left,
  .signin-right {
    width: 100%;
    padding: 30px;
  }

  .signin-left {
    align-items: center;
    text-align: center;
  }

  .learn-more-btn {
    margin: 20px auto 0 auto;
  }

  .form-title {
    font-size: 20px;
  }

  .signin-form input {
    font-size: 13px;
    padding: 8px 12px;
  }

  .submit-btn {
    font-size: 14px;
    padding: 8px 14px;
  }

  .login-link {
    font-size: 13px;
  }
}[]
  `}
</style>

    </div>
  );
};

export default Login;
