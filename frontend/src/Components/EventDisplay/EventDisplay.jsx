/* eslint-disable react/prop-types */
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./EventDisplay.css";
import { useNavigate } from "react-router-dom";

// Function to dynamically set colors based on tag and past/future status
const getEventStyle = (tag, isPastEvent) => {
  if (isPastEvent) {
    return {
      borderColor: "#dfddddcc", // Transparent white for past events
      backgroundColor: "#fff", // Default white background for future events

    };
  }

  switch (tag) {
    case "Professional":
      return {
        borderColor: "rgb(100, 200, 100)", // Greenish color
        backgroundColor: "#fff", // Default white background for future events
      };
    case "Others":
      return {
        borderColor: "rgb(255, 100, 100)", // Reddish color
        backgroundColor: "#fff", // Default white background for future events
      };
    case "Personal":
    default:
      return {
        borderColor: "rgb(132, 194, 235)", // Bluish color
        backgroundColor: "#fff", // Default white background for future events
      };
  }
};

// Function to calculate the number of days left
const calculateDaysLeft = (startDate) => {
  const eventDate = new Date(startDate).setHours(0, 0, 0, 0); // Remove time part for comparison
  const currentDate = new Date().setHours(0, 0, 0, 0); // Remove time part for comparison
  const timeDiff = eventDate - currentDate;

  if (timeDiff < 0) {
    return -1; // Event has already passed
  } else if (timeDiff === 0) {
    return 0; // Event is today
  }

  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysLeft;
};


const EventDisplay = ({
  event,
  title,
  desc,
  startDate,
  startTime,
  tag,
  onDelete,
  onEdit,
}) => {
  const formattedDate = new Date(startDate).toLocaleDateString(); // Format the date if needed
  const daysLeft = calculateDaysLeft(startDate);
  const isPastEvent = daysLeft === -1;

  const eventStyle = getEventStyle(tag, isPastEvent);

  const handleDelete = () => {
    if (event && event._id && onDelete) {
      onDelete(event._id);
    } else {
      console.error("Event or event ID is missing");
    }
  };

  return (
    <div className="event" style={eventStyle}>
      <div className="event-container">
        <div className="event-date-wrapper">
          <div className="tag">{tag || "Personal"}</div>
          <div className="event-date">{formattedDate}</div>
          <div className="event-time">{startTime || "All Day"}</div>
        </div>
        <div className="event-actions">
          <div className="event-title">{title}</div>
          <div className="edit-delete-buttons">
            <p className="edit-btn">
              <FaEdit onClick={() => onEdit(event)} />
            </p>
            <p className="delete-btn">
              <MdDelete onClick={handleDelete} />
            </p>
          </div>
        </div>
        <div className="desc-status">
          <div className="event-desc">{desc}</div>

          <div className="event-status">
            {isPastEvent ? (
              <span className="event-passed">Event Passed</span>
            ) : (
              <span>{daysLeft} days left</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDisplay;
