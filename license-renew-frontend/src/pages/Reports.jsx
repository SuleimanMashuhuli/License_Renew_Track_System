import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, Paper, Button } from "@mui/material";
import ReportsOutput from '../components/ReportsOutput';

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");  
      try {
        const response = await fetch('http://localhost:8000/api/subscriptions/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
  
        const result = await response.json();
        setData(result);
        console.log("Fetched data:", result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const handleDownload = (format) => {
    const token = sessionStorage.getItem("token");
    const url = `http://localhost:8000/api/report/html/?download=${format}`;
  
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to download report");
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `Subscription_Report.${format === "pdf" ? "pdf" : "csv"}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Download error:", error));
  };
  
  
  
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <div className="container">
      <div className="box my-1">
        <div className="paper">
          <ReportsOutput data={data} />
          <div className="button-row">
            <button className="btn primary" onClick={() => handleDownload("pdf")}>
              Download PDF
            </button>
            <button className="btn secondary" onClick={() => handleDownload("csv")}>
              Download Excel
            </button>
          </div>
        </div>
      </div>
      <style>
        {`.container {
          display: flex;
          flex-direction: column;
          gap: 40px;
          padding: 24px;
        }

        .box {
          margin-top: 8px;  
          margin-bottom: 8px;
        }

        .button-row {
          margin-top: 16px;
          display: flex;
          gap: 16px;        
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          color: white;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .btn.primary {
          background-color: #1976d2;
        }

        .btn.primary:hover {
          background-color: #115293;
        }

        .btn.secondary {
          background-color: #9c27b0; 
        }

        .btn.secondary:hover {
          background-color: #6d1b7b;
        }
      `}
      </style>
    </div>

  );
};

export default Reports;
