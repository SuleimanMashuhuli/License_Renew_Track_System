import React, { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "react-datepicker/dist/react-datepicker.css";
import { Table } from "../components/ui";

const ReportsOutput = ({ data }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionTypes, setSubscriptionTypes] = useState([]);
  const [providers, setProviders] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
 

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/subscriptions/")
      .then(res =>  {
        console.log("Fetched:", data.list);
        setSubscriptionData(data.list || []); })
      .catch(error => console.error("Error fetching subscription data:", error));
  }, []);
  console.log("Subscription Data:", subscriptionData);


  return (
    <div className="reports-container">
      
      <div className="summary">
        <div className="metric-item blue">
          <h2>Total Subscriptions</h2>
          <p>{subscriptions.total_subscriptions}</p>
        </div>
        <div className="metric-item green">
          <h2>Active</h2>
          <p>{subscriptions.active_subscriptions}</p>
        </div>
        <div className="metric-item red">
          <h2>Expired</h2>
          <p>{subscriptions.expired_subscriptions}</p>
        </div>
        <div className="metric-item yellow">
          <h2>Total Revenue</h2>
          <p>Kshs.{subscriptions.total_revenue}</p>
        </div>
      </div>

      
      <div className="charts-container">
      
        <div className="chart-item">
          <h2>Subscriptions by Type</h2>
          <ResponsiveContainer width="50%" height={300}>
            <BarChart data={subscriptionTypes}>
              <XAxis dataKey="subscription_type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

       
        <div className="chart-item">
          <h2>Active vs Expired Subscriptions</h2>
          <ResponsiveContainer width="50%" height={300}>
            <PieChart>
              <Pie 
                dataKey="value" 
                data={[
                  { name: 'Active', value: subscriptions.active_subscriptions || 0, fill: "#4CAF50" },
                  { name: 'Expired', value: subscriptions.expired_subscriptions || 0, fill: "#F44336" }
                ]} 
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="data-table-container">
        <h2>Subscription Data</h2>
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Subscription Type</th>
              <th>Amount Paid</th>
              <th>Issue Date</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {subscriptionData?.map((sub, index) => (
              <tr key={index}>
                <td>{sub.issuing_authority || "N/A"}</td>
                <td>{sub.sub_type || "N/A"}</td>
                <td>Kshs.{sub.amount || "0.00"}</td>
                <td>{sub.issuing_date || "N/A"}</td>
                <td>{sub.expiring_date || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Styles */}
      <style>
        {`

          h2 {
            color: black;
          }

          .summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
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

          .blue {
            background-color: #4299e1;
            color: white;
          }

          .green {
            background-color: #48bb78;
            color: white;
          }

          .red {
            background-color: #f56565;
            color: white;
          }

          .yellow {
            background-color: #ecc94b;
            color: white;
          }

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

            .chart-item {
              text-align: center;
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

        .reports-container {
          padding: 1rem;
        }

        .chart-item {
          padding: 0.75rem;
        }

        table th, table td {
          padding: 0.5rem;
          font-size: 0.85rem;
        }
      }
        `}
      </style>
    </div>
  );
};

export default ReportsOutput;
