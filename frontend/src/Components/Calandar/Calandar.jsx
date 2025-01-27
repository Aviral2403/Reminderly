/* eslint-disable react/prop-types */
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoMdArrowRoundForward, IoMdClose } from "react-icons/io";
import "./Calandar.css";
import EventDisplay from "../EventDisplay/EventDisplay";
import { useState, useEffect } from "react";
import axios from "axios";
// import { useAuthStore } from "../../store/authStore";
import imageSrc from "../../assets/no-result.png";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Calandar = ({ user }) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [events, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventTimeHours, setEventTimeHours] = useState("");
  const [eventTimeMinutes, setEventTimeMinutes] = useState("");
  const [eventTag, setEventTag] = useState("Professional");

  // const { user } = useAuthStore();
  console.log(user);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const FirstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const today = currentDate.getDate();
  const currentIsToday =
    currentMonth === currentDate.getMonth() &&
    currentYear === currentDate.getFullYear();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const fetchUpcomingEvents = async () => {
    if (user?._id) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/events/user/${user._id}/upcoming`
        );
        const sortedEvents = response.data.sort((a, b) => {
          const dateA = new Date(a.startDate + " " + a.startTime);
          const dateB = new Date(b.startDate + " " + b.startTime);
          return dateA - dateB;
        });
        setEvents(sortedEvents.slice(0, 2)); // Set only the first 2 events
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    }
  };

  useEffect(() => {
    fetchUpcomingEvents(); // Fetch events initially when component mounts
  }, [user]);

  const handleDateClick = (dayNumber) => {
    const clickedDate = new Date(currentYear, currentMonth, dayNumber);

    // Create a date that has only the year, month, and day for comparison
    const todayWithoutTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (clickedDate >= todayWithoutTime) {
      setSelectedDate(clickedDate);
      setShowPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedDate(null);
    setEventTitle("");
    setEventDesc("");
    setEventTimeHours("");
    setEventTimeMinutes("");
    setEventTag("Professional");
  };

  const handleAddEvent = async () => {
    if (!eventTitle || !eventDesc || !eventTimeHours || !eventTimeMinutes) {
      alert("Please fill in all fields");
      return;
    }

    // Ensure selectedDate is set before using it
    if (!selectedDate) {
      alert("Please select a date for the event");
      return;
    }

    // Manually format the selected date as YYYY-MM-DD to avoid timezone issues
    const formattedDate = `${selectedDate.getFullYear()}-${(
      selectedDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")}`;

    const newEvent = {
      title: eventTitle,
      desc: eventDesc,
      startDate: formattedDate, // Use manually formatted date
      startTime: `${eventTimeHours}:${eventTimeMinutes}`,
      userId: user._id,
      tag: eventTag,
    };

    try {
      const response = await axios.post(
        `http://localhost:8000/api/events/create`,
        newEvent
      );
      alert("Event added successfully!");

      // Re-fetch the updated events list after adding a new event
      fetchUpcomingEvents();

      // Close the popup and reset fields
      handlePopupClose();
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:8000/api/events/${eventId}`);
        setEvents(events.filter((event) => event._id !== eventId));
        fetchUpcomingEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleAddEventClick = () => {
    toast.info("Click on any date to add event", {});
  };

  return (
    <div className="calander-app">
      <div className="calander">
        <h1 className="heading">Calandar</h1>
        <div className="navigate-date">
          <h2 className="month">{monthsOfYear[currentMonth]}</h2>
          <h2 className="year">{currentYear}</h2>
          <div className="buttons">
            <p onClick={handlePrevMonth}>
              <FaChevronLeft />
            </p>
            <p onClick={handleNextMonth}>
              <FaChevronRight />
            </p>
          </div>
        </div>
        <div className="weekdays">
          {daysOfWeek.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="days">
          {[...Array(FirstDayOfMonth).keys()].map((_, index) => (
            <span key={`empty-${index}`} />
          ))}

          {[...Array(daysInMonth).keys()].map((day) => {
            const dayNumber = day + 1;
            const isCurrentDay = currentIsToday && dayNumber === today;
            return (
              <span
                key={dayNumber}
                className={isCurrentDay ? "current-day" : ""}
                onClick={() => handleDateClick(dayNumber)}
              >
                {dayNumber}
              </span>
            );
          })}
        </div>
      </div>

      <div className="events">
        {showPopup && (
          <div className="event-popup">
            <div className="time-input">
              <div className="event-popup-time">Time</div>
              <input
                type="number"
                name="hours"
                min={0}
                max={24}
                value={eventTimeHours}
                onChange={(e) => setEventTimeHours(e.target.value)}
                placeholder="HH"
              />
              <input
                type="number"
                name="minutes"
                min={0}
                max={60}
                value={eventTimeMinutes}
                onChange={(e) => setEventTimeMinutes(e.target.value)}
                placeholder="MM"
              />
            </div>
            <textarea
              placeholder="Enter Event Title"
              className="popup-title"
              value={eventTitle}
              maxLength={50}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            <textarea
              placeholder="Enter Event Description"
              className="popup-desc"
              value={eventDesc}
              maxLength={150}
              onChange={(e) => setEventDesc(e.target.value)}
            />
            <select
              className="popup-tag"
              value={eventTag}
              onChange={(e) => setEventTag(e.target.value)}
            >
              <option value="Professional">Professional</option>
              <option value="Personal">Personal</option>
              <option value="Others">Others</option>
            </select>
            <button className="event-popup-btn" onClick={handleAddEvent}>
              Add Event
            </button>
            <button className="close-event-popup" onClick={handlePopupClose}>
              <IoMdClose />
            </button>
          </div>
        )}
        <h2 className="all-event-heading">
          <Link to={`/my-events/${user._id}`}>
            See All Events <IoMdArrowRoundForward />
          </Link>
        </h2>
        <h2 className="event-heading">
          Latest Upcoming Events !{" "}
        </h2>
        <div className="main-container">
          {events.length === 0 ? (
            <>
              <img src={imageSrc} alt="" />
              <p>You Have No Events!</p>
              <h3 className="add-event-btn" onClick={handleAddEventClick}>
                Click on any date to add event! {/* Add icon for the button */}
              </h3>
            </>
          ) : (
            events.map((event) => (
              <EventDisplay
                key={event._id}
                event={event}
                title={event.title}
                desc={event.desc}
                startDate={event.startDate}
                startTime={event.startTime}
                tag={event.tag}
                onDelete={handleDeleteEvent}
              />
            ))
          )}
          {events.length >= 2 && (
            <div className="all-events">
              <Link to={`/my-events/${user._id}`}>
                <div>
                  See All Events
                </div>
                <div className="arrow">
                    <IoMdArrowRoundForward />
                </div>    
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calandar;
