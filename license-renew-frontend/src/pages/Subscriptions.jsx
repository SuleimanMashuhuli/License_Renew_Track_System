import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/Table.jsx';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setformData] = useState({
    name: '',
    authority: '',
    expiry: '',
    type: '',
    amount: '',
    reference: '',
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (sub = null, index = null) => {
    if (sub) {
      setformData(sub);
      setEditIndex(index);
    } else {
      setformData({
        name: '',
        authority: '',
        expiry: '',
        type: '',
        amount: '',
        reference: '',
      });
      setEditIndex(null);
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...subscriptions];
      updated[editIndex] = formData;
      setSubscriptions(updated);
    } else {
      setSubscriptions([...subscriptions, formData]);
    }
    setShowModal(false);
    setformData({
      name: '',
      authority: '',
      expiry: '',
      type: '',
      amount: '',
      reference: '',
    });
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    const updated = [...subscriptions];
    updated.splice(index, 1);
    setSubscriptions(updated);
  };

  return (
    <div className="subscriptions-page">
      <h1></h1>
      <div className="add-btn-container">
        <button className="add-btn" onClick={() => openModal()}>
          <i class="fa-regular fa-plus"></i>&nbsp;&nbsp; Add
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editIndex !== null ? 'Edit' : 'Add'} Subscription</h2>
            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              <input name="authority" placeholder="Issuing Authority" value={formData.authority} onChange={handleChange} required />
              <input type="date" name="expiry" value={formData.expiry} onChange={handleChange} required />
              <input name="type" placeholder="Subscription Type" value={formData.type} onChange={handleChange} required />
              <input name="amount" type="number" placeholder="Amount" value={formData.amount} onChange={handleChange} required />
              <input name="reference" placeholder="Reference Number" value={formData.reference} onChange={handleChange} required />
              <div className="modal-actions">
                <button type="submit">{editIndex !== null ? 'Update' : 'Save'}</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container" style={{ marginTop: '40px' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Issuing Authority</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Action</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub, index) => (
              <TableRow key={index}>
                <TableCell>{sub.sub_name}</TableCell>
                <TableCell>{sub.sub_type}</TableCell>
                <TableCell>{sub.issuing_authority}</TableCell>
                <TableCell>{new Date(sub.expiring_date).toLocaleDateString()}</TableCell>
                <TableCell>${sub.amount}</TableCell>
                <TableCell>{sub.reference}</TableCell>
                <TableCell>
                  <div className="card-actions">
                   
                    <button onClick={() => openModal(sub, index)} className="btn-edit">
                      Edit
                    </button>
                 
                    <button onClick={() => handleDelete(index)} className="btn-delete">
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>  


      <style>{`
        .subscriptions-page {
        background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
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
        font-size: 12px
        }

        .subscription-list {
          display: grid;
          gap: 1rem;
        }

        .subscription-card {
          background: #fff;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: start;
        }

        .card-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .card-actions button {
          padding: 6px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .card-actions button:first-child {
          background-color: #0066cc;
          color: white;
        }

        .delete-btn {
          background-color: #cc0000;
          color: white;
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
          border-radius: 4px;
        }

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
          padding: 12px 15px;
          border: 0px solid #e0e0e0;
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
          background-color: #f9f9f9;
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
