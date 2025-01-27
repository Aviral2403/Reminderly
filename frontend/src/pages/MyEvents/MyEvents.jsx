import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import "./MyEvents.css";
import EventDisplay from "../../Components/EventDisplay/EventDisplay";
import EditEventForm from "../../Components/EditEventForm/EditEventForm";
import imageSrc from "../../assets/no-result.png";

const MyEvents = () => {
  const { user } = useAuthStore();
  const userId = user ? user._id : null;
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null); // Store the event being edited
  const editFormRef = useRef(null); // Reference to the edit form

  const fetchEvents = async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/events/user/${userId}`
        );
        const sortedEvents = sortEventsByDate(response.data);
        setEvents(sortedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  const sortEventsByDate = (events) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Ensure we're only comparing the date part, ignoring the time

    const futureEvents = events.filter(
      (event) => new Date(event.startDate).setHours(0, 0, 0, 0) >= currentDate
    );

    const pastEvents = events.filter(
      (event) => new Date(event.startDate).setHours(0, 0, 0, 0) < currentDate
    );

    // Sort future events by proximity to the current date
    futureEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    // Sort past events by most recent first (optional, depending on your use case)
    pastEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    return [...futureEvents, ...pastEvents]; // Future events first, followed by past events
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:8000/api/events/${eventId}`);
        setEvents(events.filter((event) => event._id !== eventId));
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleUpdateEvent = async (eventId, updatedEvent) => {
    try {
      await axios.put(
        `http://localhost:8000/api/events/${eventId}`,
        updatedEvent
      );
      setEvents(
        events.map((event) => (event._id === eventId ? updatedEvent : event))
      );
      fetchEvents();
      setEditingEvent(null); // Close edit mode after saving changes
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const startEditing = (event) => {
    setEditingEvent(event);
    editFormRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to the form
  };

  return (
    <div className="my-events">
      <h1>Your Events</h1>
      {events.length === 0 ? (
        <div className="no-events">
          <img src={imageSrc} alt="" />
          <p>No events found.</p>
        </div>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <EventDisplay
              key={event._id}
              event={event}
              title={event.title}
              desc={event.desc}
              startDate={event.startDate}
              startTime={event.startTime}
              tag={event.tag}
              onDelete={handleDeleteEvent}
              onEdit={() => startEditing(event)}
            />
          ))}
        </div>
      )}
      {events.length >= 1 && (
        <div className="message">No More Events To Display!</div>
      )}
      {editingEvent && (
        <div ref={editFormRef} className="edit-form-container">
          <EditEventForm
            event={editingEvent}
            onUpdate={handleUpdateEvent}
            onCancel={() => setEditingEvent(null)}
          />
        </div>
      )}
    </div>
  );
};

export default MyEvents;
