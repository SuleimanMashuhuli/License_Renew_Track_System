import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../components/Table.jsx';


export default function DashboardHome() {
  const [totalSubscriptions, setTotalSubscriptions] = useState(null);
  const [totalEmployees, setTotalEmployees] = useState(null);
  const [activeLicenses, setActiveLicenses] = useState(null);
  const [expiredLicenses, setExpiredLicenses] = useState(null);
  const [expiringSoon, setExpiringSoon] = useState([]);


  useEffect(() => {
    fetchDashboardStats();
  }, []);
  
  const fetchDashboardStats = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
  
      const subsRes = await axios.get('http://127.0.0.1:8000/api/subscriptions/', { headers });
  
      setTotalSubscriptions(subsRes.data.length);
  
      const activeSubscriptions = subsRes.data.filter(sub => sub.status === 'active');
      const expiredSubscriptions = subsRes.data.filter(sub => sub.status === 'expired');

      console.log(activeSubscriptions, expiredSubscriptions);
  
      setActiveLicenses(activeSubscriptions.length);
      setExpiredLicenses(expiredSubscriptions.length);
      

      const today = new Date();
      const in30Days = new Date();
      in30Days.setDate(today.getDate() + 30);

      today.setHours(0, 0, 0, 0);
      in30Days.setHours(23, 59, 59, 999);

      console.log("Today:", today.toISOString());
      console.log("30 Days From Now:", in30Days.toISOString());
  
      const expiring = subsRes.data.filter(sub => {
        const [year, month, day] = sub.expiring_date.split('-').map(Number);
        const expDate = new Date(year, month - 1, day); 
        return expDate >= today && expDate <= in30Days;
      });
      
  
      setExpiringSoon(expiring);
  
      const uniqueOwners = new Set(
        subsRes.data.map(sub => `${sub.owner_first_name} ${sub.owner_last_name}`)
      );
      setTotalEmployees(uniqueOwners.size);
  
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };
  

  return (
    <div className="dashboard">
      <div className="dashboard-cards">
        <DashboardCard
          title="Total Subscriptions"
          content={totalSubscriptions}
          description="Number of subscriptions recorded"
        />
        <DashboardCard
          title="Total Employees"
          content={totalEmployees}
          description="Employees with subscriptions assigned"
        />
        <DashboardCard
          title="Active Licenses"
          content={activeLicenses}
          description="Currently active subscriptions"
        />
        <DashboardCard
          title="Expired Licenses"
          content={expiredLicenses}
          description="Subscriptions past their due date"
        />
      </div>


      <div className="dashboard-table" style={{ marginTop: '40px' }}>
        <Table>
          <TableCaption>A list of subscriptions expiring in the next 30 days.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Issuing Authority</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expiringSoon.map((sub, index) => (
              <TableRow key={index}>
                <TableCell>{sub.sub_name}</TableCell>
                <TableCell>{sub.sub_type}</TableCell>
                <TableCell>{sub.issuing_authority}</TableCell>
                <TableCell>{new Date(sub.expiring_date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">{sub.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>


      <style>{`
        .dashboard {
          display: flex;
          flex-direction: column;
          gap: 40px;
          padding: 24px;
        }

        .dashboard-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .card {
          background-color: hsl(224.4, 64.3%, 32.9%);
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          color: white;
        }

        .card-title {
          font-size: 16px;
          font-weight: 600;
        }

        .card-content {
          margin-top: 8px;
          font-size: 30px;
          font-weight: bold;
        }

        .card-description {
          margin-top: 12px;
          font-size: 13px;
          color: #cfd8dc;
        }

        .table-container {
          width: 100%;
          border: 1px solid #a3a3a3;
           border-right: 1px solid #a3a3a3;
          border-left: 1px solid #a3a3a3;
          border-top: 1px solid #a3a3a3;
         
          overflow: hidden;
          overflow-x: auto;
          margin-top: 2rem;
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
          #text-transform: uppercase;
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
          margin-top: 2rem;
          font-size: 14px;
          color: #777;
          text-align: center;
        }

      `}</style>
    </div>
  );
}

function DashboardCard({ title, content, description }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-content">{content}</p>
      <p className="card-description">{description}</p>
    </div>
  );
}