from datetime import datetime, timedelta
from typing import Dict, List

THRESHOLDS = {
    "temperature": {"warning": 80.0, "critical": 95.0},
    "pressure": {"warning": 130.0, "critical": 150.0},
    "vibration": {"warning": 12.0, "critical": 18.0},
    "spindleSpeed": {"warning": 5200.0, "critical": 6100.0},
    "currentConsumption": {"warning": 220.0, "critical": 280.0},
    "windSpeed": {"warning": 24.0, "critical": 32.0},
    "batteryDegradation": {"warning": 60.0, "critical": 80.0},
}

ANOMALY_DEFS = [
    ("Overheating", "Cooling Loop", "Increase coolant flow and inspect blocked channels."),
    ("Tool Damage Alert", "Spindle Tooling", "Inspect tool wear, flank damage, and imbalance."),
    ("Gearbox Failure", "Gearbox", "Check lubrication pressure and bearing alignment immediately."),
    ("Full System Issue", "System Core", "Switch to safe mode and execute full subsystem diagnostics."),
    ("Crack Detection", "Surface Integrity", "Placeholder vision classifier detected probable micro-crack; verify via NDT."),
]


def _severity(score: float) -> str:
    if score >= 85:
        return "Critical"
    if score >= 70:
        return "High"
    if score >= 50:
        return "Medium"
    return "Low"


def _status_from_health(health_score: int) -> str:
    if health_score >= 75:
        return "Healthy"
    if health_score >= 45:
        return "Warning"
    return "Critical"


def _sensor_risk(value: float, warning: float, critical: float) -> float:
    if value <= warning:
        return max(5.0, (value / max(warning, 1.0)) * 45.0)
    ratio = (value - warning) / max(critical - warning, 1.0)
    return min(100.0, 45.0 + ratio * 55.0)


def run_machine_health_inference(sensor_data: Dict[str, float]) -> Dict:
    now = datetime.utcnow()

    risks: List[float] = []
    for key, limit in THRESHOLDS.items():
        risks.append(_sensor_risk(float(sensor_data[key]), limit["warning"], limit["critical"]))

    aggregate_risk = sum(risks) / len(risks)
    health_score = int(max(0, min(100, round(100 - aggregate_risk))))
    current_status = _status_from_health(health_score)

    anomalies = []
    alerts = []

    for idx, (name, component, recommendation) in enumerate(ANOMALY_DEFS):
        signal = risks[idx % len(risks)]
        severity = _severity(signal)
        confidence = round(min(0.98, 0.62 + signal / 250), 2)
        message = f"{name} signal at {round(signal, 1)} risk index."
        ts = (now - timedelta(minutes=idx * 5)).isoformat() + "Z"

        anomaly = {
            "id": f"anomaly-{idx+1}",
            "type": name,
            "component": component,
            "severity": severity,
            "message": message,
            "confidence": confidence,
            "timestamp": ts,
        }
        anomalies.append(anomaly)

        alerts.append(
            {
                "id": f"alert-{idx+1}",
                "severity": severity,
                "component": component,
                "message": message,
                "recommendation": recommendation,
                "confidence": confidence,
                "timestamp": ts,
            }
        )

    predicted_failures = [
        {
            "component": "Spindle Assembly",
            "risk": round(min(99.0, aggregate_risk * 1.05), 1),
            "eta": "1h",
            "confidence": 0.87,
        },
        {
            "component": "Gearbox",
            "risk": round(min(98.0, aggregate_risk * 0.93), 1),
            "eta": "24h",
            "confidence": 0.84,
        },
        {
            "component": "Cooling Circuit",
            "risk": round(min(95.0, aggregate_risk * 0.82), 1),
            "eta": "7d",
            "confidence": 0.8,
        },
    ]

    recommendations = [
        "Increase cooling audit frequency for 24 hours.",
        "Run tool wear calibration before next production cycle.",
        "Check gearbox lubrication, torque ripple, and bearing condition.",
        "Keep crack detection under manual verification until vision feed is integrated.",
    ]

    return {
        "healthScore": health_score,
        "currentStatus": current_status,
        "anomalies": anomalies,
        "alerts": alerts,
        "predictedFailures": predicted_failures,
        "recommendations": recommendations,
        "lastUpdated": now.isoformat() + "Z",
    }
