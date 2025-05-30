import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="admin-layout">
        <Sidebar />
        <div className="main-content">
                <Header />
            <div className="page-content">
                <Outlet />
            </div>
        </div>
        <style>
            {`
               html, body, #root {
                height: 100%;
                margin: 0;
                padding: 0;
                }
                .admin-layout {
                display: flex;
                height: 100vh;
                box-sizing: border-box;            
                }

                .main-content {
                display: flex;
                flex-direction: column;
                flex: 1;
                overflow: hidden;
                }

                .page-content {
                flex: 1;
                padding: 2rem;
                overflow: auto;
                background-color: #f4f4f4;
                }

                 @media (max-width: 768px) {
                .admin-layout {
                flex-direction: column;
                }

                .admin-layout > :first-child {
                display: none; /* Hide Sidebar */
                }

                .main-content {
                width: 100%;
                }

                .page-content {
                padding: 1rem;
                }
            }
            `}
        </style>
    </div>
  );
}
