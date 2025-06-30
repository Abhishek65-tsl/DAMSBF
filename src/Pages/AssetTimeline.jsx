import React, { useState } from "react";
import { Dialog } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#8e9ae8", "#c49be7", "#ffcc99", "#ff9999"];

const AssetTimeline = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    type: "Maintenance",
    area: "",
    notes: "",
    date: "",
    media: null,
  });
  const [filterType, setFilterType] = useState("");
  const [modalData, setModalData] = useState(null);

  const handleEventChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media") {
      setNewEvent({ ...newEvent, media: files[0] });
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.date || !newEvent.area) return;
    const event = {
      ...newEvent,
      mediaURL: newEvent.media ? URL.createObjectURL(newEvent.media) : null,
    };
    setEvents([...events, event]);
    setNewEvent({ type: "Maintenance", area: "", notes: "", date: "", media: null });
  };

  const summaryData = ["Maintenance", "Upgrade", "Inspection", "Breakdown"]
    .map((type) => ({
      name: type,
      value: events.filter((e) => e.type === type).length,
    }))
    .filter((item) => item.value > 0);

  const filteredEvents = filterType
    ? events.filter((e) => e.type === filterType)
    : events;

  return (
    <div className="p-6 min-h-screen bg-[#0B1E3A] text-white">
      <h2 className="text-2xl font-bold mb-4">Asset Event Timeline</h2>

      {/* Entry + Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Add Event Form */}
        <div className="bg-[#E6E6FA] text-black p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Add Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" name="date" value={newEvent.date} onChange={handleEventChange} className="p-2 border rounded" required />
            <input type="text" name="area" placeholder="Area" value={newEvent.area} onChange={handleEventChange} className="p-2 border rounded" />
            <select name="type" value={newEvent.type} onChange={handleEventChange} className="p-2 border rounded">
              <option>Maintenance</option>
              <option>Upgrade</option>
              <option>Inspection</option>
              <option>Breakdown</option>
            </select>
            <input type="file" name="media" accept="image/*,video/*" onChange={handleEventChange} className="" />
          </div>
          <textarea name="notes" placeholder="Notes" value={newEvent.notes} onChange={handleEventChange} className="p-2 border rounded w-full mt-3"></textarea>
          <button onClick={handleAddEvent} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Event</button>
        </div>

        {/* Summary Chart */}
        <div className="bg-white text-black p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Event Summary</h3>
          {summaryData.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={summaryData} dataKey="value" nameKey="name" outerRadius={80}>
                  {summaryData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No data yet.</p>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2">Filter by type:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-black px-2 py-1 rounded"
        >
          <option value="">All</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Upgrade">Upgrade</option>
          <option value="Inspection">Inspection</option>
          <option value="Breakdown">Breakdown</option>
        </select>
      </div>

      {/* Timeline */}
      <div className="relative border-l-4 border-blue-400 pl-6 space-y-8">
        {filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date)).map((event, idx) => (
          <div key={idx} className="relative">
            <div className="absolute left-[-1.15rem] top-1 w-4 h-4 bg-blue-400 rounded-full"></div>
            <div
              className="bg-white text-black p-4 rounded shadow cursor-pointer hover:shadow-lg transition"
              onClick={() => setModalData(event)}
            >
              <div className="text-sm text-gray-500">{event.date}</div>
              <div className="font-semibold">{event.type} - {event.area}</div>
              {event.mediaURL && (
                <div className="mt-2">
                  {event.media?.type?.startsWith("image") ? (
                    <img src={event.mediaURL} alt="event" className="w-full max-h-52 object-cover rounded" />
                  ) : (
                    <video controls src={event.mediaURL} className="w-full max-h-52 object-cover rounded" />
                  )}
                </div>
              )}
              {event.notes && <p className="mt-2 text-sm">📝 {event.notes}</p>}
            </div>
          </div>
        ))}
        {filteredEvents.length === 0 && <p className="text-gray-400">No events added yet.</p>}
      </div>

      {/* Event Modal */}
      <Dialog open={!!modalData} onClose={() => setModalData(null)}>
        {modalData && (
          <div className="bg-white text-black p-6 w-[350px] sm:w-[500px]">
            <h3 className="text-lg font-bold mb-2">{modalData.type} in {modalData.area}</h3>
            <p className="text-sm text-gray-500">📅 {modalData.date}</p>
            {modalData.mediaURL && (
              <div className="mt-2">
                {modalData.media?.type?.startsWith("image") ? (
                  <img src={modalData.mediaURL} alt="event" className="w-full rounded" />
                ) : (
                  <video controls src={modalData.mediaURL} className="w-full rounded" />
                )}
              </div>
            )}
            <p className="mt-3 text-sm">📝 {modalData.notes || "No additional notes."}</p>
            <button
              onClick={() => setModalData(null)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default AssetTimeline;
