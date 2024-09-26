/* eslint-disable react/prop-types */
import { useState } from "react";

const EditEventForm = ({ event, onUpdate, onCancel }) => {
  const [updatedEvent, setUpdatedEvent] = useState(event);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "desc" && value.length > 150) {
      return;
    }
    setUpdatedEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (onUpdate) {
      await onUpdate(event._id, updatedEvent);
    }
  };

  return (
    <div className="edit-form">
      <div className="form-heading">Edit Your Event</div>
        <span>Title</span>
      <div className="form-input-text">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          maxLength={50}
          value={updatedEvent.title}
          onChange={handleEditChange}
        />
      </div>
      <span>Description</span>
      <div className="form-desc-text">
        <textarea
          name="desc"
          placeholder="Event Description"
          value={updatedEvent.desc}
          onChange={handleEditChange}
          maxLength={150}
        />
      </div>
      <div>Date</div>
      <div className="form-input-date">
        <input
          name="startDate"
          value={new Date(updatedEvent.startDate).toISOString().split("T")[0]}
          onChange={handleEditChange}
          type="date"
        />
      </div>
      <span>Time</span>
      <div className="form-input-time">
        <input
          type="time"
          name="startTime"
          value={updatedEvent.startTime}
          onChange={handleEditChange}
        />
      </div>
      <div>Category</div>
      <div className="form-input-tag">
        <select name="tag" value={updatedEvent.tag} onChange={handleEditChange}>
          <option value="Professional">Professional</option>
          <option value="Personal">Personal</option>
          <option value="Others">Others</option>
        </select>
      </div>
      <div className="form-buttons">
        <button onClick={handleUpdate}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EditEventForm;
