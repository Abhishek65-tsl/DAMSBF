import React, { useState } from 'react';

const MediaGallery = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [filter, setFilter] = useState({ area: '', type: '', date: '' });

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type.startsWith('image') ? 'image' : 'video',
      area: 'Unknown Area',
      date: new Date().toISOString().split('T')[0],
      autoCaption: `Uploaded: ${file.name}`,
    }));
    setMediaItems([...mediaItems, ...newMedia]);
  };

  const filteredMedia = mediaItems.filter((item) => {
    return (
      (!filter.area || item.area === filter.area) &&
      (!filter.type || item.type === filter.type) &&
      (!filter.date || item.date === filter.date)
    );
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Media Gallery for Assets</h2>

      {/* Upload */}
      <div className="mb-4">
        <input type="file" accept="image/*,video/*" multiple onChange={handleUpload} />
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select onChange={(e) => setFilter({ ...filter, area: e.target.value })}>
          <option value="">All Areas</option>
          <option value="Unknown Area">Unknown Area</option>
        </select>
        <select onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
        <input
          type="date"
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredMedia.map((item, idx) => (
          <div key={idx} className="border rounded p-2 bg-white shadow">
            {item.type === 'image' ? (
              <img src={item.url} alt={item.name} className="w-full h-40 object-cover" />
            ) : (
              <video controls src={item.url} className="w-full h-40 object-cover" />
            )}
            <div className="mt-2 text-sm text-gray-700">{item.autoCaption}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaGallery;