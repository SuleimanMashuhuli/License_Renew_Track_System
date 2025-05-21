import React from "react";

const SignOut = () => {
  

  const handleLogout = async () => {
    const refreshToken = sessionStorage.getItem("refresh_token");

    try {
      await fetch("http://localhost:8000/api/sign_out/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("user");
    
    
    window.location.replace("/sign_in");
  };

  return (
    <button onClick={handleLogout}>Sign Out</button>
  );
};

export default SignOut;
