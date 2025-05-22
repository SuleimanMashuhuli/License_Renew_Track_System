import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/ABC1.png" alt="Logo" className="sidebar-logo" />
      </div>

      <hr />
      
      <div className="sidebar-content">
        <div className="sidebar-link">
          <Link to="dashboard"><i className="fa fa-home" aria-hidden="true"></i>&nbsp; Dashboard</Link>
        </div>
        <div className="sidebar-link">
          <Link to="subscription"><i className="fa fa-file-text" aria-hidden="true"></i>&nbsp; Subscriptions</Link>
        </div>
        <div className="sidebar-link">
          <Link to="employees"><i className="fa-solid fa-user-group"></i>&nbsp; Employees</Link>
        </div>
        <div className="sidebar-link">
          <Link to="admins/manage"><i className="fa-solid fa-user-gear" aria-hidden="true"></i>&nbsp; Admins</Link>
        </div>
        <div className="sidebar-link">
          <Link to="renewing"><i className="fa fa-refresh" aria-hidden="true"></i>&nbsp; Renewals</Link>
        </div>
        <div className="sidebar-link dropdown">
          <div className="dropdown-header">
            <i className="fas fa-tasks" aria-hidden="true"></i>&nbsp; Activities
            &nbsp;
            <i className="fas fa-caret-right arrow-icon" aria-hidden="true"></i>
          </div>
          <div className="dropdown-content">
            <Link to="reports">Reports</Link>
            <Link to="admins/logs">Logs</Link>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-link">
          <Link to="help"><i className="far fa-question-circle" aria-hidden="true" />&nbsp; Get help</Link>
        </div>
        <div className="sidebar-link">
          <Link to="settings"><i className="fa fa-cog fa-fw" aria-hidden="true" />&nbsp; Settings</Link>
        </div>
      </div>

      <style>
        {`
          .sidebar {
            width: 20rem;
            background-color: #FFF;
            color: hsl(224.4, 64.3%, 32.9%);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: auto;
            overflow: hidden;
            border-right: 1px solid #ccc;
            background-color: hsl(220 13% 91%);
          }

          .sidebar-header,
          .sidebar-footer {
            padding: 1rem;
          }

          .sidebar-header { 
            position: relative; 
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100px;
            border-bottom: none; 
          }

          .sidebar-header::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 90%; 
            border-bottom: 1px solid hsl(226.2 57% 21%);
          }
          .sidebar-logo {
            height: 70px;
            max-width: 100%;
            object-fit: contain;
          }
          .sidebar-content {
            flex: 1;
            padding: 1rem;
            
          }

          .sidebar-link {
            position: relative;
            // background-color: #FFF;
            padding: 0.55rem 1rem;
            margin-bottom: 1rem;
            border-radius: 6px;
            transition: box-shadow 0.3s, transform 0.2s;
          }

          .sidebar-link:hover {
            box-shadow: 0 0 10px rgba(0, 102, 204, 0.6);
            transform: translateY(-2px);
          }

          .sidebar-link a, .dropdown-header {
            color: hsl(224.4, 64.3%, 32.9%);
            text-decoration: none;
            font-weight: 500;
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .sidebar-content a:hover {
            text-decoration: none;
          }
            .sidebar-link a i {
              width: 24px;
              text-align: center;
              font-size: 18px;
              min-width: 24px;
            }

          .sidebar-footer {
            font-weight: 500;
            color: hsl(224.4, 64.3%, 32.9%);
            height: auto;
          }

          
          .dropdown {
            position: relative;
              font-size: 18px;
               font-weight: 500;
          }

          .dropbtn {
            background-color: transparent;
            border: none;
            color: #333;
            font-size: 1rem;
            padding: 0.75rem 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          
          }

          .arrow-icon {
            transition: transform 0.3s ease;
          }

          .dropdown-content {
            display: none;
            flex-direction: column;
            position: absolute;
            right: 10%;
            top: 100%;
            background-color: inherit;
            min-width: 160px;
            z-index: 1;
          }

          .dropdown-content a {
          margin-top: 15px;
            color: inherit;
            padding: 5px 16px;
            text-decoration: none;
            display: block;
          }

          .dropdown-content a:hover {
             box-shadow: 0 0 10px rgba(0, 102, 204, 0.6);
            transform: translateY(-2px);
             border-radius: 6px;
          }
          .dropdown:hover .dropdown-content {
            display: flex;
          }
          .dropdown:hover .arrow-icon {
            transform: rotate(90deg);
          }
        `}
      </style>
    </div>
  );
}
