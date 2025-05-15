import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/users/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/user/change-password/', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPasswordMessage('Password changed successfully!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      console.error(error);
      setPasswordMessage('Error changing password.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  const imageSrc = user.profile_picture
    ? `${user.profile_picture}?t=${new Date().getTime()}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}&background=random&color=fff&size=128`;

  return (
    <div className="container">
      <div className="left">
        <img src={imageSrc} alt="profile" className="profile-img" />
        <h2>{user.name}</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone_number}</p>
        <p><strong>Department:</strong> {user.department || 'N/A'}</p>
      </div>

      <div className="right">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>Current Password:</label>
            <input
              type="password"
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password:</label>
            <input
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              required
            />
          </div>
          <button type="submit">Change Password</button>
          {passwordMessage && <p className="message">{passwordMessage}</p>}
        </form>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: space-between;
          padding: 40px;
          gap: 40px;
          flex-wrap: nowrap;
        }

        .left, .right {
          flex: 1;
          min-width: 300px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: #fff;
        }

        .profile-img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 15px;
        }

        h2, h3 {
          margin-top: 0;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group input {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
        }

        button {
          padding: 10px 20px;
          background-color: #682773;
          color: white;
          border: none;
          cursor: pointer;
        }

        .message {
          margin-top: 10px;
          color: green;
        }

        @media (max-width: 768px) {
          .container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewProfile;
