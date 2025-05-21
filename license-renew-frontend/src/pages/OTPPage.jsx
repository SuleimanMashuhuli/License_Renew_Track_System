import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OTPPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");

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

    try {
      const res = await fetch("http://127.0.0.1:8000/user/verify_otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp_session: state.otpSession,
          otp_code: otpCode,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem(
          "auth_data",
          JSON.stringify({
            token: data.access_token,          
            id: data.user.id       
          })
        );
        
        sessionStorage.setItem("refresh_token", data.refresh);
        sessionStorage.setItem("user", JSON.stringify(data.user));
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
      const res = await fetch("http://127.0.0.1:8000/user/resend_otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp_session: state.otpSession }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("A new OTP has been sent to your email.");
      } else {
        setError(data.message || "Unable to resend OTP.");
      }
    } catch {
      setError("An error occurred while resending the OTP.");
    }
  };

  return (
    <div className="otp-container">
      <img src="/logoWhite.png" alt="Logo" className="Logo" />
      <h2>Enter the OTP we emailed you</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleVerify}>
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

          <span>-</span>

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
          <button
            type="submit"
            className="verify-btn"
            disabled={otp.join("").length !== 6}
          >
            Verify
          </button>
          <button
            type="button"
            className="resend-btn"
            onClick={handleResend}
          >
            Resend Code
          </button>
        </div>
      </form>

      <style>
        {`
        body {
          margin: 0;
          padding: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .otp-container {
          width: 100%;
          max-width: 700px;
          padding: 30px;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        img {
            width: 50%;    
            height: auto;   
            margin-bottom: 5px;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }

        h2 {
          font-size: 22px;
          color: #1e3a8a;
          margin-bottom: 24px;
        }

        .error {
          color: #dc2626;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .otp-inputs {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 20px;
        }

        .otp-slot {
          width: 50px;
          height: 60px;
          text-align: center;
          font-size: 24px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        .otp-slot:focus {
          border-color: #2563eb;
          outline: none;
        }

        .button-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 10%;
        }

        .verify-btn,
        .resend-btn {
          flex: 1;
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .verify-btn {
          background-color: #2563eb;
          color: white;
        }

        .verify-btn:hover {
          background-color: #1e40af;
        }

        .verify-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .resend-btn {
          background-color: #f3f4f6;
          color: #1e3a8a;
          border: 1px solid #cbd5e1;
        }

        .resend-btn:hover {
          background-color: #e2e8f0;
        }

        span {
          font-size: 24px;
          font-weight: bold;
          margin-top: 10px;
        }
      `}
      </style>
    </div>
  );
};

export default OTPPage;
