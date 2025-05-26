import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../components/Table.jsx';

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
        setFormData(prev => ({
          ...prev,
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          phone_number: response.data.phone_number || '',
          email: response.data.email || '',
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
  
    const token = sessionStorage.getItem('token');
    if (!token || !profile?.user?.id) return;
  
   
    const {
      first_name,
      last_name,
      phone_number,
      email,
      ...profileData
    } = formData;
  
    const dataToSend = {
      ...profileData,
      user: {
        first_name,
        last_name,
        phone_number,
        email,
      },
    };
  
    try {
      await axios.put(`http://127.0.0.1:8000/api/users/${profile.user.id}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const updatedProfile = await axios.get(`http://127.0.0.1:8000/api/users/${profile.user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setProfile(updatedProfile.data);
      setFormData({
        first_name: updatedProfile.data.user.first_name || '',
        last_name: updatedProfile.data.user.last_name || '',
        phone_number: updatedProfile.data.user.phone_number || '',
        email: updatedProfile.data.user.email || '',
      });
  
      setEditing(false);
      setMessage('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Update failed.');
    } finally {
      setSaving(false);
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found.</div>;

  const user = profile.user || {};


  return (
    <div className="container">
      <div class="name">{profile.first_name} {profile.last_name}</div>

      <div class="wrapper">

        <aside class="profile-sidebar">
            <img class="avatar" src="/Faceless businessman avatar_ Man in suit with blue tie.jpeg" alt="Avatar" />
            <a href="#" class="view-full">View Full Size</a>

            <div class="panel">
                <p class="section"><strong>Contact me</strong><br/>
                <a href="#">{profile.mobiNumber}</a><br/>
                <a href='#'>{profile.email}</a></p>

                <p class="section"><strong>Registered</strong><br/>
                <a href='#'>{profile.date_joined}</a></p>

                <p class="section"></p>

                <p class="section"><strong>Role</strong><br/><a href="#">{profile.userRole}</a></p>
            </div>
        </aside>


        <main class="content">
    

            <h2>About me</h2>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Organization</TableCell>
                  <TableCell>ABC Bank Ltd</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Industry</TableCell>
                  <TableCell>Banking</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Occupation</TableCell>
                  <TableCell>Banker</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Woodvale Grove, Westlands, Nairobi</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Department</TableCell>
                  <TableCell>Logistics</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Introduction</TableCell>
                  <TableCell>
                    Our system manages all licenses of ABC Bank Institution and helps
                    to remind on renewals upon their respective due dates. With the
                    help of ICT Department, Division of Software Development team that
                    tried to come up with this small system to help manage the renewal
                    issues. Thank you for being so supportive!
                    <br />
                    <br />
                    Senior Manager, Software Development
                    <br />
                    <a
                      href="https://contacts.google.com/person/c8581039976862175743"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Samuel Waithaka
                    </a>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Interests</TableCell>
                  <TableCell>Support</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div class="footer">You smile I'm happy</div>
        </main>
      </div>


      <style jsx>{`
        :root {
        --text: #333;
        --subtext: #777;
        --link: #0182c4;
        --border: #e5e5e5;
        --profile-sidebar-bg: #f7f8f9;
        --accent: #f57c00;
        font-family: "Helvetica Neue", Arial, sans-serif;
    }

        body{
            margin:0;
            padding:40px 20px;
            color:var(--text);
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
          .wrapper{
        max-width: 1040px;
        margin:0 auto;
        display:flex;
        gap:50px;
      }
    .profile-sidebar{
        width:300px;
        flex-shrink:0;
        text-align:center;
    }
    .content{
        flex:1;
    }

    .name{
        font-size:18px;
        font-weight:600;
        color:var(--accent);
        margin:0 0 30px;
        text-align:left;
    }
    .avatar{
        width:130px;
        height:130px;
        border-radius:50%;
        object-fit:cover;
        border:4px solid #fff;
        box-shadow:0 0 0 1px var(--border);
        display:block;
        margin:0 auto 10px;
    }
    .view-full{
        color:var(--link);
        font-size:13px;
        text-decoration:none;
    }
    .panel{
        background:var(--profile-sidebar-bg);
        border:1px solid var(--border);
        padding:18px 0 20px;
        margin-top:25px;
        font-size:13px;
        line-height:1.6;
        width: 100%;
    }
    .panel a{
        color:var(--link);
        text-decoration:none;
    }
    .panel .section{
        margin:0;
    }

    
    h2{
        font-size:20px;
        margin:0 0 18px;
        font-weight:600;
    }

    .blogs a{
        color:var(--link);
        font-size:14px;
        text-decoration:none;
        display:block;
        margin-bottom:4px;
    }
    
    table{
        width:100%;
        border-collapse:collapse;
        font-size:13px;
        margin-top:25px;
    }
    td{
        padding:8px 12px;
        vertical-align:top;
        text-align: justify;
    }
    td:first-child{
        width:140px;
        background:#fafafa;
        color:var(--subtext);
        border-right:1px solid var(--border);
    }
    tr:not(:last-child) td{
        border-bottom:1px solid var(--border);
    }

    .footer{
        margin:25px 0 0;
        font-size:13px;
        color:var(--subtext);
    }

     @media (max-width: 768px) {
    .wrapper {
      flex-direction: column;
      gap: 20px;
    }

    .profile-sidebar {
      width: 100%;
      order: 2;
    }

    .content {
      order: 1;
    }

    .avatar {
      width: 100px;
      height: 100px;
    }

    .name {
      font-size: 16px;
      text-align: center;
    }

    td:first-child {
      width: 120px;
    }

    table {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .avatar {
      width: 80px;
      height: 80px;
    }

    .panel {
      font-size: 12px;
      padding: 12px 0 15px;
    }

    h2 {
      font-size: 18px;
    }

    .name {
      font-size: 14px;
    }

    td {
      padding: 6px 8px;
    }

    td:first-child {
      width: 100px;
    }
  }
  
      `}</style>
    </div>
  );
};

export default ViewProfile;