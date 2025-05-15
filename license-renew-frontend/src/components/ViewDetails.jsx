import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewDetails = () => {
    const [licenseData, setLicenseData] = useState({});
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [licenses, setLicenses] = useState([]);

    useEffect(() => {
        fetchLicenseData(id);
    }, [id]); 

    const fetchLicenseData = async () => {
        console.log("License ID:", id);

        try {
            const response = await axios.get(`http://127.0.0.1:8000/licenseS/${id}/`);
            console.log("API Response:", response.data);
            setLicenseData(response.data);
        } catch (error) {
            console.error("Error fetching license details:", error);
        } finally {
            setLoading(false);
        }
    };


 useEffect(() => {
       
        fetchLicenses();
    }, []);

    const fetchLicenses = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/licenseS/");
            const data = await response.json();
            console.log("Fetched data:", data);
            setLicenses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching licenses:", error);
            setLicenses([]);
        }
    };



    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete this license?`)) return;
        try {
            await axios.delete(`http://localhost:8000/license-delete/${id}/`);
            setLicenses(licenses.filter(l => l.id !== id));
        } catch (error) {
            console.error("Error deleting license:", error);
        }
    };



    return (
        <div className="license-detail-container">
            <div className="license-detail-body">

                {licenses.map((license) =>(
                <div key={license.id} >
                
                </div>
                ))}
          
                <div className="license-image">
                    
                        <img 
                            src={licenseData.profile_picture 
                                ? `http://127.0.0.1:8000${licenseData.profile_picture}` 
                                : "/user.png"
                            } 
                            alt="" 
                            className="profile-image-img"
                        />
                    
                    <p className="username">{licenseData.owner_full_name}</p>
                </div>
                <div className="license-details">
                    <p><strong>Name:</strong> {licenseData.owner_full_name}</p>
                    <p><strong>Email:</strong> {licenseData.owner_email}</p>
                    <p><strong>Department:</strong> {licenseData.owner_department}</p>
                    <p><strong>Provider:</strong> {licenseData.providers}</p>
                    <p><strong>Amount Paid:</strong> {licenseData.amount_paid}</p>
                    <p><strong>Issue Date:</strong> {licenseData.issue_date}</p>
                    <p><strong>Expiry Date:</strong> {licenseData.expiry_date}</p>
                    <p><strong>Duration:</strong> {licenseData.duration} (Months)</p>
                    <p><strong>Subscription Type:</strong> {licenseData.subscription_type}</p>
                    <p><strong>Document:</strong> {licenseData.document ? (
                            <a 
                                href={`http://127.0.0.1:8000${licenseData.document}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                View Document
                            </a>
                        ) : "No document uploaded"
                    }</p>
                </div>
            </div>
            <style jsx>
                {
                    `
               .license-detail-container {
                    display: flex;
                    justify-content: center;
                    padding: 20px;
                }

                .license-detail-body {
                    position: relative;
                    display: flex;
                    width: 80%;
                    min-height: 400px;
                    background-color: #f9f9f9;
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                
                .delete-container {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    display: flex;
                    align-items: center;
                }

                .delete-button {
                    padding: 2px 6px;
                    font-size: 0.6rem;
                    border: none;
                    border-radius: 10%;
                    background-color: #F44336;
                    color: white;
                    cursor: pointer;
                    line-height: 1;
                    width: 50px;
                    height: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .license-image {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 40%; 
                    margin-right: 20px;
                    border-right: 2px solid #ccc; 
                    padding-right: 20px;
                }

                .profile-image-img {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .username {
                    margin-top: 10px;
                    font-weight: bold;
                }

                .license-details {
                    width: 60%; 
                    padding-left: 20px;
                }

                .license-details p {
                    margin: 5px 0;
                    text-align: justify;
                }
                @media (max-width: 768px) {
                    .license-detail-body {
                        flex-direction: column;
                        align-items: center;
                    }

                    .license-image {
                        margin-bottom: 20px;
                        border-right: none;
                        padding-right: 0;
                    }

                    .license-details {
                        padding-left: 0;
                    }
                }
                    `
                }
            </style>
        </div>
    );
};

export default ViewDetails;
