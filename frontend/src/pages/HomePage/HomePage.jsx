/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import './HomePage.css';

const HomePage = ({ user }) => {
  return (
    <div className="home-container">
      <div className="content-wrapper">
        <h1 className="main-heading">
          Save events , Set reminders , Plan efficiently!
        </h1>
        <div className="content-row">
          <div className="content-col">
            <h2 className="section-heading">Planning Made Easy!</h2>
            <p className="description">
              Reminderly is the best place to help you plan your moments, set reminders and make you efficient so that you never miss out in life.
            </p>
            <>
              {!user ? (
                <Link to="/signup" className="link">
                  <button className="primary-btn">Create Account</button>
                </Link>
              ) : (
                <Link to="/calander" className="link">
                  <button className="primary-btn">Let's get started</button>
                </Link>
              )}
            </>
          </div>
        </div>

        <div className="features-row">
          <div className="feature-col">
            <div className="feature-card">
              <h3 className="card-title">Inbuilt-calander</h3>
              <p className="card-description">
              The web app features a sleek, inbuilt calendar that visually organizes your events with a color-coded system, making it easy to manage different types of tasks at a glance. Each event type is assigned a unique color, allowing instant identification of upcoming engagements based on category. 
              </p>
            </div>
          </div>
          <div className="feature-col">
            <div className="feature-card">
              <h3 className="card-title">Smart Notification</h3>
              <p className="card-description">
              Users can set personalized reminders  and receive notifications via email, SMS, or push alerts. The app ensures users never miss an important event or deadline.
              </p>
            </div>
          </div>


          <div className="feature-col">
            <div className="feature-card">
              <h3 className="card-title">Never miss a moment</h3>
              <p className="card-description">
              Set a clear title for each event, making it straightforward to identify its purpose at a glance.  Add detailed descriptions to include important information such as location, participants, agenda, or notes. This feature enhances organization and helps users prepare adequately for each event.
              </p>
            </div>
          </div>
        </div>

        <h2 className="footer-heading">Be Smart| Be Efficient| Plan smarter. </h2>
      </div>
    </div>
  );
};

export default HomePage;
