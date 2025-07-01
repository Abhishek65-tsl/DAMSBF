// src/components/AboutUs/WorkflowTools.jsx
import React from 'react';

const tools = ['GitHub', 'Trello', 'Figma', 'VS Code', 'Postman', 'MongoDB'];

export default function WorkflowTools() {
  return (
    <section className="text-center">
      <h2 className="text-xl font-semibold mb-3">Tools & Collaboration</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {tools.map((tool, idx) => (
          <span
            key={idx}
            className="px-4 py-2 bg-white border rounded-full shadow text-gray-700 font-medium"
          >
            {tool}
          </span>
        ))}
      </div>
    </section>
  );
}
