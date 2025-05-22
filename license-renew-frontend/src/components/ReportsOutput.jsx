import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import "react-datepicker/dist/react-datepicker.css";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/Table.jsx';


const ReportsOutput = () => {
  const [subscriptions, setSubscriptions] = useState({});
  const [subscriptionData, setSubscriptionData] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
  
    fetch("http://127.0.0.1:8000/api/full-report/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setSubscriptions(data.metrics || {});
        setSubscriptionData(data.list || []);
      })
      .catch((error) => console.error("Error fetching subscription data:", error));
  }, []);
  

  const pieChartData = Object.entries(
    subscriptionData.reduce((acc, curr) => {
      acc[curr.sub_type] = (acc[curr.sub_type] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#FF69B4"];

  return (
    <div className="reports-container">
  
      <div className="summary">
        <div className="metric-item blue">
          <h2>Total Subscriptions</h2>
          <p>{subscriptions.total_subscriptions || 0}</p>
        </div>
        <div className="metric-item green">
          <h2>Active</h2>
          <p>{subscriptions.active_subscriptions || 0}</p>
        </div>
        <div className="metric-item red">
          <h2>Expired</h2>
          <p>{subscriptions.expired_subscriptions || 0}</p>
        </div>
        <div className="metric-item yellow">
          <h2>Total Revenue</h2>
          <p>Kshs.{subscriptions.total_revenue || 0}</p>
        </div>
      </div>

    
      <div className="charts-container">
      
        <div className="chart-item">
          <h2>Subscription Status</h2>
          <ResponsiveContainer width="50%" height={300}>
            <BarChart
              data={[
                { name: "Active", count: subscriptions.active_subscriptions || 0 },
                { name: "Expired", count: subscriptions.expired_subscriptions || 0 },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#27272a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        
        <div className="chart-item">
          <h2>Subscriptions by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={pieChartData}
                cx="50%" cy="50%"
                outerRadius={80}
                label
              >
                {pieChartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

  
      <div className="data-table-container">
        <h2>Subscription Data</h2>
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Subscription Type</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionData.map((sub, index) => (
                <TableRow key={index}>
                  <TableCell>{sub.issuing_authority || "N/A"}</TableCell>
                  <TableCell>{sub.sub_type || "N/A"}</TableCell>
                  <TableCell>Kshs.{sub.amount || "0.00"}</TableCell>
                  <TableCell>{sub.issuing_date || "N/A"}</TableCell>
                  <TableCell>{sub.expiring_date || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
      </div>

      
      <style>{`
        .reports-container {
            display: flex;
            flex-direction: column;
            gap: 40px;
            padding: 24px;
            max-width: 1200px; 
            margin: 0 auto;     
            box-sizing: border-box;
            width: 100%;
        }
        .summary {
           display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 16px;
          margin-bottom: 1.5rem;
        }
        .metric-item {
          background-color: white;
          padding: 1rem;
          border-radius: 1rem;
          text-align: center;
        }
        .metric-item h2 {
          font-size: 1rem;
          font-weight: normal;
        }
        .metric-item p {
          font-size: 1.25rem;
          font-weight: bold;
        }
        .blue { background-color: #1e3a8a; color: white;  }
        .green { background-color: #1e3a8a; color: white;  }
        .red { background-color: #1e3a8a; color: white;  }
        .yellow { background-color: #1e3a8a; color: white; }

        .charts-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .chart-item {
          background-color: white;
          padding: 1rem;
          border-radius: 1rem;
        }

        .data-table-container {
          background-color: white;
          padding: 1rem;
          margin-top: 1.5rem;
          border-radius: 1rem;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 0.75rem;
          text-align: left;
        }

        th {
          background-color: #f1f1f1;
        }

        @media (max-width: 1024px) {
          .summary {
            grid-template-columns: repeat(2, 1fr);
          }

          .charts-container {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .summary {
            grid-template-columns: 1fr;
          }
          .metric-item h2 {
            font-size: 0.9rem;
          }
          .metric-item p {
            font-size: 1rem;
          }
          table th, table td {
            padding: 0.5rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportsOutput;
