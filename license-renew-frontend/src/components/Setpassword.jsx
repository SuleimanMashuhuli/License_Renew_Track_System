import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId;

  if (!userId) {
    navigate("/sign_in");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 15) {
      setError("Password must be at least 15 characters.");
      return;
    }

    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/set_password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, new_password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password set successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/sign_in");
        }, 2000);
      } else {
        setError(data.error || "Failed to set password.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="set-password-container">
      <h2>Create Your Password</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={15}
        />
        <input
          type="password"
          placeholder="Cornfirm password"
          value={password}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={15}
        />
        <button type="submit">Set Password</button>
      </form>

      <style>
        {`.set-password-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            background-color: #fff;
            text-align: center;
            }

            .set-password-container h2 {
            margin-bottom: 20px;
            color: #333;
            }

            .set-password-container .error {
            color: #d9534f;
            margin-bottom: 15px;
            font-weight: bold;
            }

            .set-password-container .success {
            color: #28a745;
            margin-bottom: 15px;
            font-weight: bold;
            }

            .set-password-container form {
            display: flex;
            flex-direction: column;
            gap: 15px;
            }

            .set-password-container input[type="password"] {
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 16px;
            }

            .set-password-container button {
            padding: 12px;
            background-color: hsl(224.4, 64.3%, 32.9%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
            }

            .set-password-container button:hover {
            background-color: #0056b3;
            }
        `}
      </style>
    </div>
  );
};

export default SetPassword;
