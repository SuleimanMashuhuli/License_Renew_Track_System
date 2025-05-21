import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RenewalsPage() {
  const [expiredSubscriptions, setExpiredSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get('http://127.0.0.1:8000/api/subscriptions/', { headers })
      .then((res) => {
        const expired = res.data.filter(sub => sub.status === 'expired');
        setExpiredSubscriptions(expired);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching subscriptions:', err);
        setError('Failed to fetch subscriptions');
        setLoading(false);
      });
  }, []);

  const handleRenewClick = (subscription) => {
    setSelectedSubscription(subscription);
    setShowModal(true);
  };

  const handleProceed = () => {
    if (!selectedSubscription) return;
    navigate(`/layout/renew/${selectedSubscription.id}`);
  };

  if (loading) return <div>Loading subscriptions...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="renewals-page">
      <h2> </h2>
      {expiredSubscriptions.length === 0 ? (
        <p>No expired subscriptions at the moment.</p>
      ) : (
        <table className="renewals-table">
          <caption>Subscriptions expired and need attention.</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Provider</th>
              <th>Department</th>
              <th>Expired On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expiredSubscriptions.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.sub_name}</td>
                <td>{sub.issuing_authority}</td>
                <td>{sub.owner_department}</td>
                <td>{sub.expiring_date}</td>
                <td>
                  <button
                    className="renew-btn"
                    onClick={() => handleRenewClick(sub)}
                  >
                    Renew
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && selectedSubscription && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Renew Subscription</h3>
            <p><strong>Name:</strong> {selectedSubscription.sub_name}</p>
            <p><strong>Provider:</strong> {selectedSubscription.issuing_authority}</p>
            <p><strong>Department:</strong> {selectedSubscription.owner_department}</p>
            <p><strong>Expired On:</strong> {selectedSubscription.expiring_date}</p>
            <div className="modal-actions">
              <button className="proceed-btn" onClick={handleProceed}>Proceed</button>
              <button className="decline-btn" onClick={() => setShowModal(false)}>Decline</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .renewals-page {
          background: white;
          padding: 24px;
          border-radius: 8px;
          // box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);4
        }
        h2 {
        font-weight: 400;
        }
        .renewals-table {
          width: 100%;
         . border-collapse: collapse;
          margin-top: 20px;
        }
        .renewals-table th,
        .renewals-table td {
        
          padding: 10px;
          text-align: left;
          font-weight: 350;
        }
        .renew-btn {
          padding: 4px 12px;
          background-color: #003366;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal {
          background: white;
          padding: 24px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 0 10px rgba(0,0,0,0.25);
        }
        .modal-actions {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .proceed-btn {
          background-color: green;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 4px;
        }
        .decline-btn {
          background-color: #aaa;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 4px;
        }
          .table-container {
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          caption-side: bottom;
          
        }

        th,
        td {
          padding: 8px 15px;
          border-bottom: 1px solid black;
        }

        th {
          background-color: #f5f5f5;
          font-weight: 900;
          color: black;
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
          caption {
          margin-top: 1rem;
          font-size: 14px;
          color: #777;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
