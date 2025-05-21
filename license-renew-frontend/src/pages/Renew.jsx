import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


const Renew = () => {
  const [license, setLicense] = useState(null);
  const [renewalDate, setRenewalDate] = useState("");
  const [newExpiryDate, setNewExpiryDate] = useState("");
  const [document, setDocument] = useState(null);
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [subscriptionType, setSubscriptionType] = useState("");
  const [provider, setProvider] = useState("");
  const [renewalHistory, setRenewalHistory] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    if (!id) return;
    const token = sessionStorage.getItem("token");
  
    axios.get(`http://127.0.0.1:8000/api/subscriptions/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const data = res.data;
      setLicense(data);
      setSubscriptionType(data.sub_type || "");
      setProvider(data.issuing_authority || "");
      setRenewalHistory(Array.isArray(data.renewal_history) ? data.renewal_history : []);
    })
    .catch(err => {
      console.error("Failed to fetch subscription details:", err);
    });
  }, [id]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!renewalDate || !newExpiryDate || !paidAmount || !document) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("renewal_date", renewalDate);
    formData.append("new_expiry_date", newExpiryDate);
    formData.append("paid_amount", paidAmount);
    formData.append("renewal_document", document);
    formData.append("subscription_type", subscriptionType);
    formData.append("provider", provider);
    formData.append("notes", notes);

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/subscriptions/${id}/renew/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Subscription renewed successfully!");
      navigate("/renewals"); // Redirect back to renewals list or dashboard
    } catch (error) {
      console.error("Renewal error:", error);
      alert("Renewal failed.");
    }
  };

  if (!license) return <div>Loading subscription details...</div>;

  return (
    <div className="renew-form-container">
      <div className="license-info">
        <div><strong>Associated User:</strong> {license.user?.first_name} {license.user?.last_name}</div>
        <div><strong>Current Expiry Date:</strong> {license.expiring_date}</div>
        <div><strong>Provider:</strong> {license.issuing_authority}</div>
        <div><strong>Subscription Type:</strong> {license.sub_type}</div>
        <div><strong>Status:</strong> {license.status}</div>
      </div>

      <h2>Renew License</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Renewal Date <span style={{color: 'red'}}>*</span></label>
          <input
            type="date"
            className="input"
            value={renewalDate}
            onChange={(e) => setRenewalDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>New Expiry Date <span style={{color: 'red'}}>*</span></label>
          <input
            type="date"
            className="input"
            value={newExpiryDate}
            onChange={(e) => setNewExpiryDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Paid Amount <span style={{color: 'red'}}>*</span></label>
          <input
            type="number"
            step="0.01"
            className="input"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Receipt <span style={{color: 'red'}}>*</span></label>
          <input
            type="file"
            onChange={(e) => setDocument(e.target.files[0])}
            accept=".pdf,.jpg,.png,.jpeg"
            required
          />
        </div>

        <div className="form-group">
          <label>Provider</label>
          <input
            className="input"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Subscription Type</label>
          <select
            className="input"
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="Trial">Trial</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Semi-Annual">Semi-Annual</option>
            <option value="Annual">Annual</option>
            <option value="Biennial">Biennial</option>
            <option value="Triennial">Triennial</option>
            <option value="Quadrennial">Quadrennial</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            className="input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      <div className="renewal-history" style={{ marginTop: "2rem" }}>
        <h2>Renewal History</h2>
        {renewalHistory.length === 0 ? (
          <p>No renewal history available.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Old Expiry Date</th>
                <th>New Expiry Date</th>
                <th>Renewal Date</th>
                <th>Renewed By</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {renewalHistory.map((history, index) => (
                <tr key={index}>
                  <td>{history.old_expiry_date || "N/A"}</td>
                  <td>{history.new_expiry_date || "N/A"}</td>
                  <td>{history.renewal_date || "N/A"}</td>
                  <td>{history.renewed_by || "N/A"}</td>
                  <td>{history.notes || "-"}</td>
                </tr>
              ))}
          </tbody>
        </table>
        )}
      </div>

      <style>
        {`
              
          .renew-form-container {
            max-width: 900px;
            margin: 0rem auto;
            // padding: 1rem;
            background-color: #ffffff;
            // box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .renew-form-container h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .license-info {
            margin-bottom: 1.5rem;
            background-color: #f9f9f9;
            padding: 1rem;
            // border-radius: 8px;
            // border: 1px solid #ddd;
          }

          .license-info div {
            margin-bottom: 0.8rem;
          }

    
          .form-group {
            margin-bottom: 1.2rem;
          }

          .input {
            width: 100%;
            padding: 0.6rem;
            // border-radius: 8px;
            border: 1px solid #ccc;
            background-color: #f9f9f9;
          }

          .input:focus {
            border-color: #3b82f6;
            outline: none;
          }

          textarea.input {
            min-height: 100px;
          }

          .btn {
            padding: 0.75rem 1.5rem;
            background-color: #3b82f6;
            color: white;
            font-size: 1rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .btn:hover {
            background-color: #2563eb;
          }

         
          .renewal-history {
            margin-top: 2rem;
          }

          .history-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
          }

          .history-table th, .history-table td {
            padding: 1rem;
            border: 1px solid #ddd;
            text-align: left;
          }

          .history-table th {
            background-color: #f2f2f2;
          }

          .history-table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          `}
      </style>
    </div>
  );
};

export default Renew;
