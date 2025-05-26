import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/Table.jsx';



const ActionMenu = ({ sub, handleEditAdmin, handleDeleteAdmin }) => {

  return (
    <div className="icon-buttons">
      <button
        onClick={() => handleEditAdmin(sub)}
        className="icon-button edit"
        title="Edit"
      >
        <i className="fas fa-pencil-alt"></i>
      </button>
      <button
        onClick={() => handleDeleteAdmin(sub.id)}
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
          align-items: start;
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



export default function Admins () {
  const [admins, setAdmins] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobiNumber: '',
    password: ''
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = () => {
    const token = sessionStorage.getItem('token'); 
  
    axios.get('http://127.0.0.1:8000/api/users/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => setAdmins(response.data))
    .catch(error => console.error("Error fetching admins", error));
  };
  

  const openModal = (admins = null, index = null) => {
    if (admins) {
      setFormData(admins);
      setIsEditing(index);
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        mobiNumber: '',
        password: ''
      });
      setIsEditing(null);
    }
    setShowModal(true);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.mobiNumber || !formData.first_name || !formData.last_name|| !formData.email) {
      alert('Please fill in all fields.');
      return;
    }

    const token = sessionStorage.getItem('token'); 

    axios.post('http://127.0.0.1:8000/api/admin/create/', formData,  {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setAdmins([...admins, response.data]);
        resetForm();
      })
      .catch(error => console.error("Error adding admin", error));
  };

  const handleEditAdmin = (admin) => {
    setIsEditing(true);
    setCurrentAdmin(admin);
    setFormData({
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      mobiNumber: admin.mobiNumber,
      password: ''
    });
  };

  const handleSubmitEdit = () => {

    const token = sessionStorage.getItem('token'); 

    axios.put(`http://127.0.0.1:8000/api/users/${currentAdmin.id}/update/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setAdmins(admins.map(admin => admin.id === currentAdmin.id ? response.data : admin));
        resetForm();
        setIsEditing(false);
      })
      .catch(error => console.error("Error editing admin", error));
  };

  const handleDeleteAdmin = (adminId) => {

    const token = sessionStorage.getItem('token'); 

    axios.delete(`http://127.0.0.1:8000/api/users/${adminId}/delete/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        setAdmins(admins.filter(admin => admin.id !== adminId));
      })
      .catch(error => console.error("Error deleting admin", error));
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      mobiNumber: '',
      password: ''
    });
    setIsEditing(false);
    setCurrentAdmin(null);
  };

  return (
     <div className="admins-page">
      <h1></h1>
      <div className="add-btn-container">
        <button className="add-btn" onClick={() => openModal()}>
          <i class="fa-regular fa-plus"></i>&nbsp;&nbsp; Add
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEditing !== null ? 'Edit' : 'Add'} Subscription</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                isEditing !== null ? handleSubmitEdit() : handleSubmit();
              }}>
              <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
              <input name="last_name" placeholder="Surname Name" value={formData.last_name} onChange={handleChange} required />
              <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input name="mobiNumber" placeholder="Phone Number" value={formData.mobiNumber} onChange={handleChange} required />
              <input name="password" placeholder="Password" value={formData.password} onChange={handleChange}  />
              <div className="modal-actions">
                <button type="submit">{isEditing !== null ? 'Update' : 'Save'}</button>
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
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead> 
                </TableRow>
            </TableHeader>
            <TableBody>
                {admins.map((admins, index) => (
                <TableRow key={index}>
                    <TableCell>{admins.first_name} {admins.last_name}</TableCell>
                    <TableCell>{admins.email}</TableCell>
                    <TableCell>{admins.mobiNumber}</TableCell>
                    <TableCell>{admins.date_joined}</TableCell>
                    <TableCell>{admins.userRole}</TableCell>
                    <TableCell>
                      <ActionMenu sub={admins} handleEditAdmin={(admin) => { handleEditAdmin(admin); 
                      setShowModal(true);
                      }} handleDeleteAdmin={handleDeleteAdmin} />
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>

      <style>{`
        .admins-page {
        background: white;
        padding: 24px;
        // border-radius: 8px;
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
          border: px solid #111111;
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
          // #text-transform: uppercase;
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

        caption {
          margin-top: 1rem;
          font-size: 14px;
          color: #777;
          text-align: center;
        }

          @media (max-width: 1024px) {
            .modal {
              width: 70%;
            }

            .add-btn {
              padding: 8px 16px;
              font-size: 14px;
            }
          }

          @media (max-width: 768px) {
            .modal {
              width: 90%;
            }

            .table-container {
              overflow-x: auto;
            }

            table {
              width: 700px; /* make it scrollable on small screens */
            }

            .add-btn-container {
              justify-content: center;
            }

            .modal input {
              font-size: 14px;
            }

            .modal-actions {
              flex-direction: column;
              gap: 10px;
            }

            .modal-actions button {
              width: 100%;
            }

            .icon-buttons {
              flex-direction: column;
              gap: 6px;
            }
          }

          @media (max-width: 480px) {
            .add-btn {
              font-size: 12px;
              padding: 6px 12px;
            }

            .modal h2 {
              font-size: 16px;
            }

            .modal input {
              font-size: 12px;
            }

            .modal {
              padding: 1rem;
            }

            th,
            td {
              padding: 6px 10px;
              font-size: 12px;
            }
          }


      `}</style>
    </div>
 
);
}
