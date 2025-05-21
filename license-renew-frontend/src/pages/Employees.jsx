import React, { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/Table.jsx';

export default function UserManagement() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedOwnerEmail, setSelectedOwnerEmail] = useState(null);
  const [selectedOwnerSubscriptions, setSelectedOwnerSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch('http://127.0.0.1:8000/api/subscriptions/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        setSubscriptions(data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };
    fetchSubscriptions();
  }, []);

  const ownerSubscriptionsMap = useMemo(() => {
    const map = {};
    subscriptions.forEach((sub) => {
      const email = sub.owner_email.toLowerCase();
      if (!map[email]) map[email] = [];
      map[email].push(sub);
    });
    return map;
  }, [subscriptions]);

  const uniqueOwners = useMemo(() => {
    const ownerMap = new Map();
    subscriptions.forEach((sub) => {
      if (!ownerMap.has(sub.owner_email)) {
        ownerMap.set(sub.owner_email, sub);
      }
    });
    return Array.from(ownerMap.values());
  }, [subscriptions]);

  const handleOwnerClick = (email) => {
    setSelectedOwnerEmail(email);
    setSelectedOwnerSubscriptions(ownerSubscriptionsMap[email.toLowerCase()] || []);
  };

  
  return (
    <div className="employees-page">
      <h1></h1>
      <div className="add-btn-container">
        <button className="add-btn" >
          <i className="fa-regular fa-plus"></i>&nbsp;&nbsp; View Owners
        </button>
      </div>

      <div className="tables-container" style={{ marginTop: "40px" }}>
        <div className="employees-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Holds</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uniqueOwners.map((owner) => (
                <TableRow
                  key={owner.owner_email}
                  className={`transition duration-150 ${
                    selectedOwnerEmail === owner.owner_email ? "bg-blue-100" : ""
                  }`}
                >
                  <TableCell>
                    <span
                      onClick={() => handleOwnerClick(owner.owner_email)}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      {owner.owner_first_name} {owner.owner_last_name}
                    </span>
                  </TableCell>
                  <TableCell>{owner.owner_email}</TableCell>
                  <TableCell>{owner.owner_department}</TableCell>
                  <TableCell>
                      {ownerSubscriptionsMap[owner.owner_email.toLowerCase()]?.length || 0}
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="employees-table-right">
          {selectedOwnerEmail && (
            <>
              {selectedOwnerSubscriptions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Issuing Authority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOwnerSubscriptions.map((sub, index) => (
                      <TableRow key={index}>
                        <TableCell>{sub.sub_name}</TableCell>
                        <TableCell>{sub.sub_type}</TableCell>
                        <TableCell>{sub.issuing_authority}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p style={{ padding: "1rem", color: "#555" }}>
                  No subscriptions found for this owner.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .employees-page {
          background: white;
          padding: 24px;
          border-radius: 8px;
          // box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .add-btn-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1rem;
        }

        .add-btn {
          background-color: hsl(224.4, 64.3%, 32.9%);
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .add-btn i {
          font-size: 12px;
        }

        .tables-container {
          display: flex;
          gap: 20px;
          overflow: hidden;
        }

        .employees-table {
          width: 60%;
          // border: 1px solid #333;
          // border-radius: 10px;
          overflow: hidden;
        }

        .employees-table-right {
          width: 40%;
          // border: 1px solid #333;
          // border-radius: 10px;
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        th, td {
          padding: 8px 15px;
          border-bottom: 1px solid black;
        }

        th {
          background-color: #f5f5f5;
          font-weight: bold;
          color: #333;
          text-transform: uppercase;
          font-size: 14px;
        }

        td {
          font-size: 13px;
          color: #555;
        }

        tbody tr:nth-child(even) {
          background-color: #fff;
        }

        tbody tr:hover {
          background-color: #f1f1f1;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          width: 50%;
          max-width: 600px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .modal h2 {
          margin-bottom: 1rem;
        }

        .modal input {
          width: 100%;
          padding: 8px;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          }
          border-radius: 4px;

        .modal-actions {
          display: flex;
          justify-content: space-between;
        }

        .modal-actions button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
        }

        .modal-actions button:first-child {
          background-color: #003366;
          color: white;
        }

        .modal-actions button:last-child {
          background-color: #ccc;
        }

        caption {
          margin-top: 1rem;
          font-size: 14px;
          color: #777;
          text-align: center;
        }

        .hover\\:underline:hover {
          text-decoration: none;
        }

        .cursor-pointer {
          cursor: pointer;
        }

      `}</style>
    </div>
  );
}
