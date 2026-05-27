from ai.model.predictive_maintenance import PredictiveMaintenanceModel


def test_predictive_model_generates_correlation_matrix():
    model = PredictiveMaintenanceModel.create(n_samples=120, time_steps=20, seed=42)

    assert model.training_sample_count == 120
    assert len(model.correlation_matrix) == 3
    assert len(model.correlation_matrix[0]) == 3
    assert model.model is not None


def test_predictive_model_returns_expected_fields():
    model = PredictiveMaintenanceModel.create(n_samples=120, time_steps=20, seed=42)

    torque = [120 + (i * 0.4) for i in range(20)]
    pressure = [110 + (i * 0.35) for i in range(20)]
    temperature = [145 + (i * 0.55) for i in range(20)]

    result = model.predict(torque=torque, pressure=pressure, temperature=temperature)

    assert set(result.keys()) == {
        "predictedFailure",
        "failureProbability",
        "healthScore",
        "recommendedAction",
    }
    assert isinstance(result["predictedFailure"], bool)
    assert 0.0 <= result["failureProbability"] <= 1.0
    assert 0 <= result["healthScore"] <= 100
    assert isinstance(result["recommendedAction"], str)
