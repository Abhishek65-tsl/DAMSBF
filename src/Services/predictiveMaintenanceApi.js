const AI_API_BASE_URL = import.meta.env.VITE_AI_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${AI_API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Predictive maintenance API error: ${response.status}`);
  }

  return response.json();
}

export function fetchPredictiveMaintenanceSummary() {
  return request("/predictive-maintenance/summary");
}

export function fetchPredictiveMaintenanceSampleData(points = 30) {
  return request(`/predictive-maintenance/sample-data?points=${points}`);
}

export function predictMotorMaintenanceRisk({ torque, pressure, temperature }) {
  return request("/predictive-maintenance/predict", {
    method: "POST",
    body: JSON.stringify({ torque, pressure, temperature }),
  });
}
