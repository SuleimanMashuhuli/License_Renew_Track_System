import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "../components/Avatar.jsx";

export default function Header() {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.error("No token found!");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/me/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    setIsModalOpen(false);
  }, [location]);

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchKeyDown = async (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/subscriptions/", {
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

        const hasOwnerMatch = results.find(
          (item) =>
            item.owner_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.owner_last_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (hasOwnerMatch) {
          navigate("/layout/employees", {
            state: { searchId: hasOwnerMatch.id, searchTerm },
          });
          return;
        }

        const hasSubscriptionMatch = results.find(
          (item) =>
            item.sub_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.expiring_date?.includes(searchTerm)
        );

        if (hasSubscriptionMatch) {
          navigate("/layout/subscription", {
            state: { searchId: hasSubscriptionMatch.id, searchTerm },
          });
          return;
        }

        alert("No relevant results found");
      } catch (error) {
        console.error("Search error:", error);
        alert("Error searching");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign_in");
  };

  const initials = userData
    ? `${userData.first_name?.[0] || ""}${userData.last_name?.[0] || ""}`
    : "";

  return (
    <div className="header">
      <input
        type="text"
        placeholder="Type and search by..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearchKeyDown}
      />

      <div className="right-section">
        <button className="notification-button">
          <i className="far fa-bell"></i>
        </button>

        <div className="profile-box" onClick={handleProfileClick}>
          <div className="avatar-circle">
            <Avatar>
              <AvatarFallback>
                {initials || <i className="far fa-user"></i>}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="user-details">
            <div className="user-name"> Hi! &nbsp;
              {userData ? `${userData.first_name}` : "Guest User"}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal} >
            <div className="user-header">
              <img
                src="/Faceless businessman avatar_ Man in suit with blue tie.jpeg"
                className="avatar-img"
                width="50"
                height="50"
                alt=""
              />
              <div className="user-info">
                <h6 className="user-name">{userData?.first_name} {userData?.last_name}</h6>
                <small className="user-department">Dpt. Logistics</small>
              </div>
            </div>

            <hr className="divider" />

            <ul className="menu-list">
              <li>
                <a href="pages-user-profile.html" className="menu-item">
                  <i className="bi bi-person-fill icon"></i> <span>Profile</span>
                </a>
              </li>
              <li>
                <a href="#" className="menu-item">
                  <i className="bi bi-gear-fill icon"></i> <span>Setting</span>
                </a>
              </li>
              <li>
                <a href="#" className="menu-item">
                  <i className="bi bi-cloud-arrow-down-fill icon"></i> <span>Downloads</span>
                </a>
              </li>
            </ul>

            <hr className="divider" />

            <div onClick={handleLogout} className="menu-item logout-item">
              <i className="bi bi-lock-fill icon"></i> <span>Logout</span>
            </div>
          </div>
        )}


      <style>
        {`
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid hsl(226.2 57% 21%);
            background-color: white;
            height: 72px;
            box-sizing: border-box;
          }

          .search-input {
            border: 1px solid #ccc;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
            padding: 0.5rem 0.75rem;
            border-radius: 30px;
            width: 35%;
            font-size: 0.95rem;
            height: 40px;
          }

          .right-section {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-right: 20px;

          }

          .notification-button {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            height: 40px;
            width: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
            .profile-box .user-details .user-name {
            font-weight: 400;
            font-size: 0.8rem;
            margin-right: 10px;
          }

          .profile-box {
            display: flex;
            align-items: center;
            padding: 0.2rem 0.2rem;
            background-color: #fff;
            border-radius: 30px;
            border: 1px solid #ccc;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
            gap: 0.6rem;
            transition: box-shadow 0.2s ease;
            height: 40px;
          }

          .avatar-circle {
            min-width: 2rem;
            height: 2rem;
            background-color: #fff;
            border-radius: 50%;
            border: 1px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.9rem;
            color: hsl(224.4, 64.3%, 32.9%);
            flex-shrink: 0;
          }

          .user-details {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .user-name {
            font-weight: 300;
            font-size: 8px;
            color: #555;
          }

          .modal-box {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            min-width: 280px;
            max-width: 350px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
          }

          .modal-header-row {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .modal-user-name {
            font-weight: 600;
            font-size: 1rem;
            color: hsl(224.4, 64.3%, 32.9%);;
          }

          .modal-overlay {
            position: fixed;
            top: 72px; 
            right: 1rem;
            background: #fff;
            display: grid;
            align-items: flex-start;
            justify-content: flex-end;
            padding: 1rem;
            z-index: 999;
            margin: 0;  
          }

          .close-btn {
            margin-top: 1rem;
            background: #1f2937;
            color: white;
            border: none;
            padding: 0.5rem 1.5rem;
            border-radius: 5px;
            cursor: pointer;
          }
            .user-header {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
          }

          .avatar-img {
            border-radius: 50%;
          }

          .user-info {
            margin-left: 1rem;
            text-align: left;
          }

          .user-name {
            margin: 0;
            font-size: 1rem;
            font-weight: 600;
          }

          .user-department {
            color: #6c757d;
            font-size: 0.85rem;
          }

          .divider {
            margin: 1rem 0;
            border: 0;
            border-top: 1px solid #dee2e6;
          }

          .menu-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .menu-item {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: #212529;
            padding: 0.4rem 0;
            cursor: pointer;
          }

          .menu-item:hover {
            color: #0d6efd;
          }

          .icon {
            margin-right: 0.75rem;
            font-size: 1.1rem;
          }

          .logout-item {
            color: #dc3545;
            font-weight: 500;
          }
          .logout-item:hover {
            color: #b02a37;
          }

        `}
      </style>
    </div>
  );
}
