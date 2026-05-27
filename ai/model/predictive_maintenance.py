from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score


def _sigmoid(x: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-x))


def _build_features(series: np.ndarray) -> np.ndarray:
    torque = series[:, 0]
    pressure = series[:, 1]
    temperature = series[:, 2]

    torque_mean = float(np.mean(torque))
    pressure_mean = float(np.mean(pressure))
    temperature_mean = float(np.mean(temperature))

    torque_std = float(np.std(torque))
    pressure_std = float(np.std(pressure))
    temperature_std = float(np.std(temperature))

    torque_slope = float(torque[-1] - torque[0])
    pressure_slope = float(pressure[-1] - pressure[0])
    temperature_slope = float(temperature[-1] - temperature[0])

    corr_tp = float(np.corrcoef(torque, pressure)[0, 1])
    corr_tt = float(np.corrcoef(torque, temperature)[0, 1])
    corr_pt = float(np.corrcoef(pressure, temperature)[0, 1])

    return np.array(
        [
            torque_mean,
            pressure_mean,
            temperature_mean,
            torque_std,
            pressure_std,
            temperature_std,
            torque_slope,
            pressure_slope,
            temperature_slope,
            corr_tp,
            corr_tt,
            corr_pt,
        ],
        dtype=float,
    )


@dataclass
class PredictiveMaintenanceModel:
    model: LogisticRegression
    train_accuracy: float
    correlation_matrix: list[list[float]]
    training_sample_count: int

    @classmethod
    def create(cls, n_samples: int = 500, time_steps: int = 30, seed: int = 42) -> "PredictiveMaintenanceModel":
        rng = np.random.default_rng(seed)
        all_features: list[np.ndarray] = []
        labels: list[int] = []
        all_points: list[np.ndarray] = []

        for _ in range(n_samples):
            base_torque = rng.normal(120, 15)
            base_pressure = 0.65 * base_torque + 45 + rng.normal(0, 5)
            base_temperature = 0.45 * base_torque + 0.75 * base_pressure + 20 + rng.normal(0, 8)

            drift_torque = rng.normal(0.35, 0.2)
            drift_pressure = 0.55 * drift_torque + rng.normal(0.25, 0.15)
            drift_temperature = 0.65 * drift_torque + 0.5 * drift_pressure + rng.normal(0.2, 0.2)

            t = np.arange(time_steps, dtype=float)
            torque = base_torque + drift_torque * t + rng.normal(0, 2.5, size=time_steps)
            pressure = base_pressure + drift_pressure * t + 0.5 * (torque - np.mean(torque)) + rng.normal(0, 3.0, size=time_steps)
            temperature = base_temperature + drift_temperature * t + 0.25 * (torque - np.mean(torque)) + 0.35 * (
                pressure - np.mean(pressure)
            ) + rng.normal(0, 3.5, size=time_steps)

            sample_series = np.column_stack((torque, pressure, temperature))
            sample_features = _build_features(sample_series)

            stress_score = (
                0.03 * sample_features[0]
                + 0.02 * sample_features[1]
                + 0.04 * sample_features[2]
                + 0.35 * max(sample_features[8], 0)
                + 0.2 * max(sample_features[6], 0)
                + 0.2 * max(sample_features[7], 0)
                + 0.15 * max(sample_features[10], 0)
                + 0.15 * max(sample_features[11], 0)
                - 12.0
            )

            failure_probability = float(_sigmoid(np.array([stress_score]))[0])
            label = int(rng.random() < failure_probability)

            all_points.append(sample_series)
            all_features.append(sample_features)
            labels.append(label)

        X = np.vstack(all_features)
        y = np.array(labels, dtype=int)
        model = LogisticRegression(max_iter=1000, random_state=seed)
        model.fit(X, y)

        train_pred = model.predict(X)
        train_acc = float(accuracy_score(y, train_pred))

        flattened = np.vstack(all_points)
        corr = np.corrcoef(flattened, rowvar=False)

        return cls(
            model=model,
            train_accuracy=train_acc,
            correlation_matrix=[[float(v) for v in row] for row in corr],
            training_sample_count=n_samples,
        )

    def predict(self, torque: list[float], pressure: list[float], temperature: list[float]) -> dict[str, Any]:
        series = np.column_stack((np.array(torque, dtype=float), np.array(pressure, dtype=float), np.array(temperature, dtype=float)))
        features = _build_features(series).reshape(1, -1)

        failure_probability = float(self.model.predict_proba(features)[0, 1])
        predicted_label = int(failure_probability >= 0.5)
        health_score = int(round((1.0 - failure_probability) * 100))

        return {
            "predictedFailure": bool(predicted_label),
            "failureProbability": round(failure_probability, 4),
            "healthScore": health_score,
            "recommendedAction": (
                "Inspect motor cooling, seals, and load balancing in the next maintenance window."
                if predicted_label
                else "Continue standard monitoring and preventive schedule."
            ),
        }
