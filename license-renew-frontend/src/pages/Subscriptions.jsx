import { useState, useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../components/Table.jsx';
import axios from 'axios';


const ActionMenu = ({ sub, index, openModal, handleDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="icon-buttons">
      <button
        onClick={() => openModal(sub, index)}
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
      `}</style>
    </div>
  );
};




export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    sub_name: '',
    sub_type: '',
    issuing_authority: '',
    issuing_date: '',
    expiring_date: '',
    amount: '',
    reference: '',
    owner_first_name: '',
    owner_last_name: '',
    owner_email: '',
    owner_department: '',
    associated_documents: null,
  });
  const [editIndex, setEditIndex] = useState(null);


  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/subscriptions/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched subscriptions:', response.data);
        setSubscriptions(response.data);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };
    fetchSubscriptions();
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      associated_documents: e.target.files[0],
    });
  };


  const openModal = (sub = null, index = null) => {
    if (sub) {
      setFormData(sub);
      setEditIndex(index);
    } else {
      setFormData({
        sub_name: '',
        sub_type: '',
        issuing_authority: '',
        issuing_date: '',
        expiring_date: '',
        amount: '',
        reference: '',
        owner_first_name: '',
        owner_last_name: '',
        owner_email: '',
        owner_department: '',
        associated_documents: null,
      });
      setEditIndex(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    for (const key in formData) {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {

      const token = sessionStorage.getItem('token');

      if (editIndex !== null) {
        const updatedSubscriptions = [...subscriptions];
        updatedSubscriptions[editIndex] = formData;
        setSubscriptions(updatedSubscriptions);

        await axios.put(`http://127.0.0.1:8000/api/subscriptions/update/${subscriptions[editIndex].id}/`, formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
      
        const response = await axios.post('http://127.0.0.1:8000/api/subscriptions/create/', formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setSubscriptions([...subscriptions, response.data]);
      }
      setShowModal(false);
      setFormData({
        sub_name: '',
        sub_type: '',
        issuing_authority: '',
        issuing_date: '',
        expiring_date: '',
        amount: '',
        reference: '',
        owner_first_name: '',
        owner_last_name: '',
        owner_email: '',
        owner_department: '',
        associated_documents: null,
      });
      setEditIndex(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  
  const handleDelete = async (index) => {
    try {
      const token = sessionStorage.getItem('token');

      await axios.delete(`http://127.0.0.1:8000/api/subscriptions/delete/${subscriptions[index].id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
    });
      const updated = [...subscriptions];
      updated.splice(index, 1);
      setSubscriptions(updated);
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const getStatusText = (expiringDate) => {
    if (!expiringDate) return 'Unknown';
    const now = new Date();
    const expiry = new Date(expiringDate);
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  
    if (diffDays < 0) return 'Expired';
    if (diffDays <= 7) return 'Due Soon';
    return 'Active';
  };
  
  const getStatusClass = (expiringDate) => {
    if (!expiringDate) return 'status-unknown';
    const now = new Date();
    const expiry = new Date(expiringDate);
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  
    if (diffDays < 0) return 'status-expired';
    if (diffDays <= 7) return 'status-due-soon';
    return 'status-active';
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
              <input
                name="sub_name"
                placeholder="Subscription Name"
                value={formData.sub_name}
                onChange={handleChange}
                required
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
                name="issuing_date"
                value={formData.issuing_date}
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
              <input
                name="owner_first_name"
                placeholder="Owner's First Name"
                value={formData.owner_first_name}
                onChange={handleChange}
                required
              />
              <input
                name="owner_last_name"
                placeholder="Owner's Last Name"
                value={formData.owner_last_name}
                onChange={handleChange}
                required
              />
              <input
                name="owner_email"
                type="email"
                placeholder="Owner's Email"
                value={formData.owner_email}
                onChange={handleChange}
                required
              />
              <input
                name="owner_department"
                placeholder="Owner's Department"
                value={formData.owner_department}
                onChange={handleChange}
                required
              />
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
              <TableHead>Assigned To</TableHead>
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
                <TableCell>{sub.user ? `${sub.user.first_name} ${sub.user.last_name}` : "N/A"}</TableCell>
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

      `}</style>
    </div>
  );
}
