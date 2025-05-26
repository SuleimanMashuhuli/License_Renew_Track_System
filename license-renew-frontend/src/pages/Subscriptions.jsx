import { useState, useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../components/Table.jsx';
import axios from 'axios';


const ActionMenu = ({ sub, index, openModal, handleDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="icon-buttons">
      <button
        onClick={() => openModal(index)}
        className="icon-button edit"
        title="Edit"
      >
        <i className="fas fa-pencil-alt"></i>
      </button>
      <button
        onClick={() => handleDelete(index)}
        className="icon-button delete"
        title="Delete"
      >
        <i className="fas fa-trash-alt"></i>
      </button>

      <style>{`

         .icon-buttons {
          display: flex;
          gap: 10px;
          justify-content: start;
        }

        .icon-button {
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
          padding: 4px;
          transition: transform 0.2s ease;
        }

        .icon-button.edit {
          color: #f0ad4e; 
        }

        .icon-button.delete {
          color: #d9534f;
        }

        .mini-modal {
          margin-left: 20px;
          position: absolute;
          bottom: 0; 
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 5px 8px;
          border-radius: 6px;
          width: 60px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .mini-modal button {
          padding: 4px 6px;
          font-size: 12px;
          border: none;
          background-color: #f0f0f0;
          cursor: pointer;
          text-align: left;
          transition: background 0.3s;
        }

        .mini-modal button:hover {
          background-color: #e0e0e0;
        }

        .mini-modal button:last-child {
          color: red;
        }


         @media screen and (max-width: 600px) {
          .icon-buttons {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }

          .icon-button {
            font-size: 12px;
            padding: 3px;
          }
        }
      `}</style>
    </div>
  );
};


export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [formData, setFormData] = useState({
    sub_name: '',
    sub_type: '',
    issuing_authority: '',
    issuing_date: '',
    expiring_date: '',
    amount: '',
    reference: '',
    owners: [{ first_name: '', last_name: '', email: '', department: '' }],
    associated_documents: null,
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSubscriptions = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/subscriptions/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptions(response.data);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const openModal = (index = null) => {
    if (index !== null) {
      const sub = subscriptions[index];

      if (!sub) {
        console.warn(`Subscription at index ${index} is undefined`);
        return; 
      }

      const formatDate = (date) =>
        date ? new Date(date).toISOString().split('T')[0] : '';

      setEditIndex(index);
      setFormData({
        sub_name: sub.sub_name || '',
        sub_type: sub.sub_type || '',
        issuing_authority: sub.issuing_authority || '',
        issuing_date: formatDate(sub.issuing_date),
        expiring_date: formatDate(sub.expiring_date),
        amount: sub.amount || '',
        reference: sub.reference || '',
        owners: sub.owners?.length
          ? sub.owners.map((o) => ({
              first_name: o.first_name || '',
              last_name: o.last_name || '',
              email: o.email || '',
              department: o.department || '',
            }))
          : [{ first_name: '', last_name: '', email: '', department: '' }],
        associated_documents: null,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      sub_name: '',
      sub_type: '',
      issuing_authority: '',
      issuing_date: '',
      expiring_date: '',
      amount: '',
      reference: '',
      owners: [{ first_name: '', last_name: '', email: '', department: '' }],
      associated_documents: null,
    });
    setEditIndex(null);
    setShowModal(false);
    setError('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const token = sessionStorage.getItem('token');
    console.log("Token:", token);
    if (!token) {
      setError('No token found. Please log in again.');
      setLoading(false);
      return;
    }
  
    const payload = new FormData();
  
    for (const key in formData) {
      if (key === 'associated_documents' && formData[key] instanceof File) {
        payload.append(key, formData[key]);
      } else if (key === 'owners')  {
        payload.append('owners', JSON.stringify(formData[key])); 
      } else {
        payload.append(key, formData[key]);
      }
    }
  
    console.log("FormData payload:");
    for (let pair of payload.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
  
    try {
      let response;
      if (editIndex !== null) {
        const subId = subscriptions[editIndex].id;
        console.log("Updating subscription with ID:", subId);
  
        response = await axios.put(
          `http://127.0.0.1:8000/api/subscriptions/update/${subId}/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        const updated = [...subscriptions];
        updated[editIndex] = response.data;
        setSubscriptions(updated);
        console.log("Subscription updated successfully:", response.data);
      } else {
        console.log("Creating new subscription...");
        response = await axios.post(
          'http://127.0.0.1:8000/api/subscriptions/',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setSubscriptions([...subscriptions, response.data]);
        console.log("Subscription created successfully:", response.data);
      }
  
      resetForm();
    } catch (err) {
      console.error('Error submitting form:', err);
      console.log("Full error response:", err.response?.data || err.message);
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this subscription?');
    if (!confirmDelete) return;

    const token = sessionStorage.getItem('token');
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/subscriptions/delete/${subscriptions[index].id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updated = [...subscriptions];
      updated.splice(index, 1);
      setSubscriptions(updated);
    } catch (err) {
      console.error('Error deleting subscription:', err);
    }
  };

   const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, associated_documents: file });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'associated_documents') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleOwnerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedOwners = [...formData.owners];
    updatedOwners[index][name] = value;
    setFormData({ ...formData, owners: updatedOwners });
  };

  const addOwner = () => {
    setFormData({
      ...formData,
      owners: [...formData.owners, { first_name: '', last_name: '', email: '', department: '' }],
    });
  };

  const removeOwner = (index) => {
    const updatedOwners = [...formData.owners];
    updatedOwners.splice(index, 1);
    setFormData({ ...formData, owners: updatedOwners });
  };

  const renderOwnersList = (owners) => {
    if (!owners || !Array.isArray(owners) || owners.length === 0) return 'N/A';
    return owners.map((o, i) => (
      <div key={i}>
        {o.first_name} {o.last_name} 
      </div>
    ));
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
            <form onSubmit={handleSubmit}>
              <input
                name="sub_name"
                placeholder="Subscription Name"
                value={formData.sub_name}
                onChange={handleChange}
                required
                style={{ marginTop: '0px' }}
              />
              <input
                name="sub_type"
                placeholder="Subscription Type"
                value={formData.sub_type}
                onChange={handleChange}
                required
              />
              <input
                name="issuing_authority"
                placeholder="Issuing Authority"
                value={formData.issuing_authority}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                value={formData.issuing_date}
                name="issuing_date"
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="expiring_date"
                value={formData.expiring_date}
                onChange={handleChange}
                required
              />
              <input
                name="amount"
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              <input
                name="reference"
                placeholder="Reference Number"
                value={formData.reference}
                onChange={handleChange}
                required
              />

              <hr style={{ marginBottom: '20px' }} />

              {formData.owners.map((owner, idx) => (
                <div key={idx} style={{ marginBottom: '0px', paddingBottom: '10px' }}>
                  <input
                    name="first_name"
                    placeholder="First Name"
                    value={owner.first_name}
                    onChange={(e) => handleOwnerChange(idx, e)}
                    required
                  />
                  <input
                    name="last_name"
                    placeholder="Last Name"
                    value={owner.last_name}
                    onChange={(e) => handleOwnerChange(idx, e)}
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={owner.email}
                    onChange={(e) => handleOwnerChange(idx, e)}
                    required
                  />
                  <input
                    name="department"
                    placeholder="Department"
                    value={owner.department}
                    onChange={(e) => handleOwnerChange(idx, e)}
                    required
                  />
                  {formData.owners.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOwner(idx)}
                      style={{ marginTop: '5px', color: 'red', cursor: 'pointer' }}
                      className='remove-owner-btn'
                    >
                      Remove Owner
                    </button>
                  )}
                </div>
              ))}

              <button type="button" onClick={addOwner} style={{ marginBottom: '15px' }} className='add-owner-btn'>
                + Add Owner
              </button>

              <input
                type="file"
                name="associated_documents"
                onChange={handleFileChange}
                accept="application/pdf,image/*" 
              />

              <div className="modal-actions">
                <button type="submit">{editIndex !== null ? 'Update' : 'Save'}</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
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
              <TableHead>Issuing Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Owners</TableHead>
              <TableHead>Action</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub, index) => (
              <TableRow key={sub.id || index}>
                <TableCell>{sub.sub_name}</TableCell>
                <TableCell>{sub.sub_type}</TableCell>
                <TableCell>{sub.issuing_authority}</TableCell>
                <TableCell>{sub.issuing_date ? new Date(sub.issuing_date).toLocaleDateString("en-GB") : "N/A"}</TableCell>
                <TableCell>{sub.expiring_date ? new Date(sub.expiring_date).toLocaleDateString("en-GB") : "N/A"}</TableCell>
                <TableCell>
                  {(() => {
                    const today = new Date();
                    const expiry = new Date(sub.expiring_date);
                    const daysDiff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

                    if (daysDiff < 0) {
                      return <span className="badge badge-expired">Expired</span>;
                    } else if (daysDiff <= 7) {
                      return <span className="badge badge-due-soon">Due Soon</span>;
                    } else {
                      return <span className="badge badge-active">Active</span>;
                    }
                  })()}
                </TableCell>
                <TableCell>{sub.reference}</TableCell>
                <TableCell>{renderOwnersList(sub.owners)}</TableCell>
                <TableCell>
                  <ActionMenu sub={sub} index={index} openModal={openModal} handleDelete={handleDelete} />
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
        }

        .modal { 
          overflow-y: auto;
          z-index: 1000;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          max-height: 80vh;
          overflow-y: auto;
          max-width: 600px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .modal input {
          width: 100%;
          padding: 6px;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .remove-owner-btn {
          margin-top: 5px;
          color: red;
          border-radius: 4px;
          border: 1px solid #ccc;
          background: #93c5fd;
          padding: 6px 10px;
        }

        .add-owner-btn {
          margin-bottom: 15px;
          background-color: ##dbeafe;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 4px 10px;
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
          border: px solid #a3a3a3;
           border-right: 1px solid #a3a3a3;
          border-left: 1px solid #a3a3a3;
          border-top: 1px solid #a3a3a3;
       
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
          border-bottom: 1px solid #a3a3a3;
        }

        th {
          background-color: #f5f5f5;
          font-weight: bold;
          color: #333;
          #text-transform: uppercase;
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
          background-color: #fff;
        }
         .badge {
            display: inline-block;
            padding: 1px 12px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 500;
            text-align: left;
          }

          .badge-active {
            background-color: #d4edda;
            color: #155724;
          }

          .badge-due-soon {
            background-color: #fff3cd;
            color: #856404;
          }

          .badge-expired {
            background-color: #f8d7da;
            color: #721c24;
          }


        caption {
          margin-top: 1rem;
          font-size: 14px;
          color: #777;
          text-align: center;
        }



        @media (max-width: 768px) {
          .modal {
            width: 95%;
            padding: 15px;
          }

          .add-btn-container {
            justify-content: center;
          }

          .modal input,
          .modal button {
            width: 100%;
            margin-bottom: 10px;
          }

          .table-container {
            overflow-x: auto;
          }

          table {
            width: 1000px;
          }
        }

        @media (max-width: 480px) {
          .modal {
            padding: 10px;
          }

          .modal-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .remove-owner-btn,
          .add-owner-btn {
            width: 100%;
            margin-top: 10px;
          }
        }

      `}</style>
    </div>
  );
}
