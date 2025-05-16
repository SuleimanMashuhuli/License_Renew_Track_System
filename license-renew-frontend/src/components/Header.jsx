import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "../components/Avatar.jsx";

export default function Header() {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); 
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.error('No token found!');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleSearchKeyDown = async (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/subscriptions/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: searchTerm,
          },
        });

        const results = response.data;
        if (results.length === 0) {
            alert("No results found");
            return;
        }

        const hasOwnerMatch = results.some(
            item =>
              (item.owner_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.owner_last_name?.toLowerCase().includes(searchTerm.toLowerCase()))
          );
    
          if (hasOwnerMatch) {
            navigate("/layout/employees");
            return;
          }
    
          const hasSubscriptionMatch = results.some(
            item =>
              item.sub_type &&
              item.expiring_date
          );
    
          if (hasSubscriptionMatch) {
            navigate("/layout/subscription");
            return;
          }
    
          alert("No relevant results found");
        } catch (error) {
          console.error("Search error:", error);
          alert("Error searching");
        }
      }
    };


  const initials = userData
    ? `${userData.first_name?.[0] || ""}${userData.last_name?.[0] || ""}`
    : "";

  return (
    <div className="header">
        <input
            type="text"
            placeholder="Search by..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
        />
        
        <div className="right-section">
            <button className="notification-button">
            <i className="far fa-bell"></i>
        </button>

        <div
            className="profile-avatar"
            onClick={() => {
            console.log("Avatar clicked, modal open before:", isModalOpen);
            setIsModalOpen(!isModalOpen);
        }}
        style={{ cursor: "pointer" }}
        >

        <Avatar>
            <AvatarFallback>
            {userData
                ? `${userData.first_name?.[0] || ""}${userData.last_name?.[0] || ""}`
                : <i className="far fa-user"></i>}
            </AvatarFallback>
        </Avatar>
        </div>


        {isModalOpen && (
        <div className="modal-overlay">
            <div className="modal-content">
            <button
                onClick={() => setIsModalOpen(false)}
                className="close-btn"
            >
                &times;
            </button>

            <div className="license-profile-image">
                <Avatar>
                <AvatarFallback>
                    {userData
                    ? `${userData.first_name?.[0] || ""}${userData.last_name?.[0] || ""}`
                    : <i className="far fa-user"></i>}
                </AvatarFallback>
                </Avatar>

                <h2 className="text-lg font-medium">
                {userData
                    ? `${userData.first_name} ${userData.last_name}`
                    : "Guest User"}
                </h2>
            </div>

            <button className="action-Btn">
                <a href="/vprofile">View Profile</a>
            </button>
            <button className="action-Btn">
                <a href="/sign_in">Sign Out</a>
            </button>
            </div>
        </div>
        )}

      </div>

      <style>
        {`
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid hsl(226.2 57% 21%);
            background-color: white;
          }

          .search-input {
            border: 1px solid #ccc;
            padding: 0.5rem 0.75rem;
            border-radius: 4px;
            width: 33%;
            margin-left: 20px;
          }

          .right-section {
            display: flex;
            align-items: center;
            gap: 3rem;
            margin-right: 20px;
          }

          .notification-button {
            background: none;
            border: none;
            font-size: 1.25rem;
            cursor: pointer;
          }

          .profile-avatar {
            width: 2.5rem;
            height: 2.5rem;
            background-color: #f0f0f0;
            border-radius: 50%;
            border: 1px solid black;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-weight: bold;
            font-size: 1rem;
          }

          .avatar-text {
            color: black;
          }

         .modal-overlay {
            position: fixed;
            top: 4rem;
            right: 2rem;
            background-color: rgba(255, 255, 255, 0.95);
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 1rem;
            z-index: 9999;
            width: 250px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            outline: 2px solid red; 
            }


          .modal-content {
            position: relative;
          }

          .close-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.75rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
          }

          .license-profile-image {
            text-align: center;
            margin-bottom: 1rem;
          }

          .action-Btn {
            background-color: #2563eb;
            color: white;
            padding: 0.5rem 1rem;
            margin-top: 1rem;
            border: none;
            border-radius: 4px;
            width: 100%;
            cursor: pointer;
          }

          .action-Btn a {
            color: white;
            text-decoration: none;
            display: block;
          }
        `}
      </style>
    </div>
  );
}
