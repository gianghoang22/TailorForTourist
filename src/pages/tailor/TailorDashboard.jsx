import React from "react";
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  MoreVertical,
  Settings,
  Users,
  Video,
} from "lucide-react";
import "./TailorDashboard.scss";

const TailorDashboard = () => {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <img src="/dappr-logo.png" alt="Dappr Logo" />
        </div>
        <nav>
          <button>
            <Home />
          </button>
          <button>
            <LayoutDashboard />
          </button>
          <button>
            <FileText />
          </button>
          <button>
            <Video />
          </button>
          <button>
            <Users />
          </button>
          <button>
            <Calendar />
          </button>
        </nav>
        <div className="bottom-buttons">
          <button>
            <Settings />
          </button>
          <button>
            <LogOut />
          </button>
        </div>
      </aside>

      <main>
        <header>
          <h1>Good morning, James!</h1>
          <div className="header-actions">
            <button>
              <Calendar />
            </button>
            <button>
              <Bell />
            </button>
            <button className="avatar">
              <img src="/avatar.png" alt="James" />
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="metrics">
            <div className="metric-card">
              <div>
                <p>Your bank balance</p>
                <h3>$143,624</h3>
              </div>
              <button>
                <Info />
              </button>
            </div>
            <div className="metric-card">
              <div>
                <p>Uncategorized transactions</p>
                <h3>12</h3>
              </div>
              <button>
                <MoreVertical />
              </button>
            </div>
            <div className="metric-card">
              <div>
                <p>Employees working today</p>
                <h3>7</h3>
              </div>
              <button>
                <MoreVertical />
              </button>
            </div>
            <div className="metric-card">
              <div>
                <p>This week's card spending</p>
                <h3>$3,287.49</h3>
              </div>
              <button>
                <MoreVertical />
              </button>
            </div>
          </div>

          <div className="formation-status">
            <h3>Formation status</h3>
            <p>In progress</p>
            <div className="progress-bar">
              <div className="progress"></div>
            </div>
            <div className="status-details">
              <p>Estimated processing</p>
              <p>4-5 business days</p>
            </div>
            <button>View status</button>
          </div>

          <div className="dashboard-row">
            <div className="new-clients">
              <h3>New clients</h3>
              <div className="client-count">
                <span>54</span>
                <span className="percentage">+18.7%</span>
              </div>
            </div>
            <div className="revenue-chart">
              <div className="chart-header">
                <h3>Revenue</h3>
                <div className="chart-controls">
                  <button>
                    <ChevronLeft />
                  </button>
                  <button>
                    <ChevronRight />
                  </button>
                </div>
              </div>
              {/* Chart component would go here */}
            </div>
          </div>

          <div className="recent-emails">
            <h3>Recent emails</h3>
            <div className="email-list">
              <div className="email-item">
                <img src="/avatar1.png" alt="Hannah Morgan" />
                <div>
                  <p>Hannah Morgan</p>
                  <p>Meeting scheduled</p>
                </div>
                <span>1:24 PM</span>
              </div>
              {/* More email items... */}
            </div>
          </div>

          <div className="dashboard-row">
            <div className="todo-list">
              <h3>Your to-Do list</h3>
              <div className="todo-items">
                <div className="todo-item">
                  <div className="todo-icon">
                    <FileText />
                  </div>
                  <div>
                    <p>Run payroll</p>
                    <p>Mar 4 at 5:00 pm</p>
                  </div>
                </div>
                {/* More todo items... */}
              </div>
            </div>
            <div className="board-meeting">
              <h3>Board meeting</h3>
              <div className="meeting-time">
                <div className="status-dot"></div>
                <p>Feb 22 at 6:00 PM</p>
              </div>
              <p>
                You have been invited to attend a meeting of the Board
                Directors.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TailorDashboard;
