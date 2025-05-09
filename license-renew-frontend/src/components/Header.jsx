import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; 
import axios from "axios";
import {
  Avatar,
  AvatarFallback,
} from "../components/Avatar.jsx";

export default function Header() {
    const [licenseData, setLicenseData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);  
    const token = localStorage.getItem('token');
    const location = useLocation();  

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                console.error('No token found!');
                return;
            }

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/create/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setLicenseData(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchUserData();
    }, [token]);

    useEffect(() => {
        setIsModalOpen(false); 
    }, [location]);

    const getInitialsAvatar = (firstName, lastName) => {
        const fullName = `${firstName || ''} ${lastName || ''}`.trim();
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff&size=128`;
    };

    return (
        <div className="header">
            <input type="text" placeholder="Search..." className="search-input" />
            <div className="right-section">
                <button className="notification-button">
                    <i className="far fa-bell"></i>
                </button>
                <div className="profile-avatar">
                    <button onClick={() => setIsModalOpen(!isModalOpen)} className="user-profile">
                        <Avatar>
                            {licenseData ? (
                                <AvatarFallback>
                                    {licenseData.user?.first_name?.[0]}
                                    {licenseData.user?.last_name?.[0]}
                                </AvatarFallback>
                            ) : (
                                <AvatarFallback><i className="fa-regular fa-user"></i></AvatarFallback>
                            )}
                        </Avatar>
                    </button>
                </div>

                
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button onClick={() => setIsModalOpen(false)} className="close-btn">&times;</button>
                            <br />
                            <div className="license-profile-image">
                                {licenseData && (
                                    <>
                                        <Avatar>
                                            <AvatarFallback>
                                                {licenseData.user?.first_name?.[0]}
                                                {licenseData.user?.last_name?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h2 className="text-lg font-medium ">{licenseData.user?.first_name} {licenseData.user?.last_name}</h2>
                                    </>
                                )}
                            </div>
                        
                            <button className="action-Btn"><a href="/vprofile" >View Profile</a></button>
                            <button className="action-Btn"><a href="/sign_in" >Sign Out</a></button>
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
                        border-bottom: 1px solid #e5e7eb;
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
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .profile-avatar {
                        width: 2rem;
                        height: 2rem;
                        background-color: #FFF;
                        border-radius: 50%;
                        border: 1px solid black;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .modal-overlay {
                        position: absolute;
                        top: 4rem;
                        right: 2rem;
                        background-color: white;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        padding: 1rem;
                        z-index: 100;
                        width: 250px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    }

                    .close-btn {
                        cursor: pointer;
                        font-size: 1.5rem;
                        position: absolute;
                        top: 0.5rem;
                        right: 0.75rem;
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
                        text-align: center;
                        text-decoration: none;
                    }

                    .license-profile-image {
                        text-align: center;
                        margin-bottom: 1rem;
                    }
                `}
            </style>
        </div>
    );
}
