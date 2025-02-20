import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

const API_URL = process.env.REACT_APP_API_URL;
const jwtLoginToken = localStorage.getItem("jwtLoginToken");

const PanelCalendar = () => {
  const [events, setEvents] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    endTime: "",
    description: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/event/get-events`, {
          headers: {
            Authorization: `Bearer ${jwtLoginToken}`,
          },
        });
        if (response.data.success) {
          const formattedEvents = response.data.data.map((event) => ({
            id: event._id,
            title: event.event_Title,
            start: new Date(event.start_Time).toISOString(),
            end: new Date(event.end_Time).toISOString(),
            description: event.event_Description,
          }));
          setEvents(formattedEvents);
        } else {
          console.error("Failed to fetch calendar events");
        }
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDateSelect = (selectInfo) => {
    setNewEvent({
      title: "",
      endTime: "",
      description: "",
    });
    setShowModal(true);
  };

  const handleAddEvent = async () => {
    const { title, endTime, description } = newEvent;
  
    if (!title || !endTime || !description) {
      alert("Please fill in all fields.");
      return;
    }
  
    // Get current UTC time and subtract 5 hours
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 5); 
    const formattedStartTime = startTime.toISOString();
  
    // Convert provided endTime to UTC, then subtract 5 hours
    const endUtcTime = new Date(endTime);
    endUtcTime.setHours(endUtcTime.getHours() + 5);
    const formattedEndTime = endUtcTime.toISOString();
  
    const eventToSave = {
      event_Title: title,
      start_Time: formattedStartTime, // UTC - 5 hours
      end_Time: formattedEndTime,    // UTC - 5 hours
      event_Description: description,
    };
  
    try {
      const response = await axios.post(`${API_URL}/event/add-event`, eventToSave, {
        headers: {
          Authorization: `Bearer ${jwtLoginToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.data.success) {
        const addedEvent = response.data.data;
        setEvents([
          ...events,
          {
            id: addedEvent._id,
            title: addedEvent.event_Title,
            start: addedEvent.start_Time, // Already adjusted to UTC - 5
            end: addedEvent.end_Time,     // Already adjusted to UTC - 5
            description: addedEvent.event_Description,
          },
        ]);
  
        // Reset form and close modal
        setNewEvent({
          title: "",
          endTime: "",
          description: "",
        });
        setShowModal(false);
      } else {
        console.error("Failed to add new event");
      }
    } catch (error) {
      console.error("Error adding new event:", error);
    }
  };
  

  const handleEventUpdate = async (eventId, updatedEventData) => {
    try {
      const response = await axios.put(
        `${API_URL}/event/update-event/${eventId}`,
        {
          event_Title: updatedEventData.title,
          start_Time: updatedEventData.startTime,
          end_Time: updatedEventData.endTime,
          event_Description: updatedEventData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtLoginToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  title: updatedEventData.title,
                  start: updatedEventData.startTime,
                  end: updatedEventData.endTime,
                  description: updatedEventData.description,
                }
              : event
          )
        );
        console.log("Event updated successfully!");
      } else {
        console.error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleEventDelete = async (eventId) => {
    try {
      const response = await axios.delete(`${API_URL}/event/delete-event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${jwtLoginToken}`,
        },
      });

      if (response.data.success) {
        setEvents(events.filter((event) => event.id !== eventId));
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div className="flex justify-between items-center">
        <span>{eventInfo.event.title}</span>
        <div className="flex space-x-2">
          <FontAwesomeIcon
            icon={faEdit}
            className="text-blue-500 cursor-pointer"
            onClick={() =>
              handleEventUpdate(eventInfo.event.id, {
                title: eventInfo.event.title,
                startTime: new Date(eventInfo.event.start).toISOString(),
                endTime: new Date(eventInfo.event.end).toISOString(),
                description: eventInfo.event.extendedProps.description,
              })
            }
          />
          <FontAwesomeIcon
            icon={faTrash}
            className="text-red-500 cursor-pointer"
            onClick={() => handleEventDelete(eventInfo.event.id)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-6xl mx-auto flex">
      <div className="flex-grow">
        <div className="text-center text-lg font-semibold text-gray-700 mb-4">
          Current Time: {currentTime.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          })}
        </div>

        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Event Calendar
        </h1>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          selectable={true}
          editable={true}
          select={handleDateSelect}
          eventContent={renderEventContent}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}
          height="auto"
        />
      </div>

      {showModal && (
        <div className="w-1/3 bg-white p-6 ml-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Add New Event</h2>
          <input
            type="text"
            placeholder="Event Title"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <input
            type="datetime-local"
            placeholder="End Time"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={newEvent.endTime}
            onChange={(e) =>
              setNewEvent({ ...newEvent, endTime: e.target.value })
            }
          />
          <textarea
            placeholder="Event Description"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 ${
                newEvent.title && newEvent.endTime && newEvent.description
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } rounded`}
              onClick={handleAddEvent}
              disabled={!newEvent.title || !newEvent.endTime || !newEvent.description}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelCalendar;