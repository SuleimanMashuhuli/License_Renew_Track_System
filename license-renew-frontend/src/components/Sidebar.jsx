import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/logO1.png" alt="Logo" className="sidebar-logo" />
      </div>

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
          <Link to="renewing"><i className="fa fa-refresh" aria-hidden="true"></i>&nbsp; Renewals</Link>
        </div>
        <div className="sidebar-link dropdown">
          <button className="dropbtn">
            <i className="fas fa-tasks" aria-hidden="true"></i>&nbsp; Activities
          </button>
          <div className="dropdown-content">
            <Link to="admins/manage">Manage Admins</Link>
            <Link to="admins/logs">View Logs</Link>
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
            width: 19rem;
            background-color: #FFF;
            color: hsl(224.4, 64.3%, 32.9%);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: auto;
            overflow: hidden;
            border-right: 0.1px solid hsl(224.4, 64.3%, 32.9%);
          }

          .sidebar-header,
          .sidebar-footer {
            padding: 1rem;
          }

          .sidebar-header {
            border-bottom: 1px solid;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100px;
          }

          .sidebar-logo {
            height: 100px;
            max-width: 100%;
            object-fit: contain;
          }

          .sidebar-content {
            flex: 1;
            padding: 1rem;
          }

          .sidebar-link {
            position: relative;
            background-color: #FFF;
            padding: 0.55rem 1rem;
            margin-bottom: 1rem;
            border-radius: 6px;
            transition: box-shadow 0.3s, transform 0.2s;
          }

          .sidebar-link:hover {
            box-shadow: 0 0 10px rgba(0, 102, 204, 0.6);
            transform: translateY(-2px);
          }

          .sidebar-link a {
            color: hsl(224.4, 64.3%, 32.9%);
            text-decoration: none;
            font-weight: 500;
            display: block;
          }

          .sidebar-content a:hover {
            text-decoration: none;
          }

          .sidebar-footer {
            font-weight: 500;
            color: hsl(224.4, 64.3%, 32.9%);
            height: auto;
          }

          
          .dropbtn {
            background: none;
            border: none;
            color: hsl(224.4, 64.3%, 32.9%);
            font-weight: 500;
            width: 100%;
            text-align: left;
            padding: 0;
            cursor: pointer;
            font-family: inherit;
            font-size: inherit;
          }

          .dropdown-content {
            display: none;
            position: absolute;
            left: 1rem;
            top: 100%;
            background-color: #FFF;
            box-shadow: 0 0 10px rgba(0, 102, 204, 0.15);
            z-index: 10;
            width: 90%;
            border-radius: 6px;
            margin-top: 0.25rem;
          }

          .dropdown-content a {
            display: block;
            padding: 0.5rem 1rem;
            text-decoration: none;
            color: hsl(224.4, 64.3%, 32.9%);
            border-radius: 4px;
          }

          .dropdown-content a:hover {
            background-color: #f0f4ff;
          }

          .dropdown:hover .dropdown-content {
            display: block;
          }
        `}
      </style>
    </div>
  );
}
