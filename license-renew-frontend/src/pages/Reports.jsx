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
    const url = `http://localhost:8000/reports/generate/${format}/`;
  
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
        link.download = `Subscription_Report.${format === "pdf" ? "pdf" : "xlsx"}`;
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
    <Container>
      <Box sx={{ my: 1 }}>
        <Paper sx={{ padding: 1 }}>
          <ReportsOutput data={data} /> 
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={() => handleDownload("pdf")}>
              Download PDF
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleDownload("excel")}>
              Download Excel
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Reports;
