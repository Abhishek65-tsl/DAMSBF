import { SENSOR_KEYS } from './constants';

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

export function validateSensorPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Payload must be an object'] };
  }

  const errors = [];

  for (const key of SENSOR_KEYS) {
    if (!isFiniteNumber(payload[key])) {
      errors.push(`Field "${key}" must be a finite number`);
    }
  }

  if (payload.timestamp && Number.isNaN(Date.parse(payload.timestamp))) {
    errors.push('Field "timestamp" must be a valid ISO date string');
  }

  return { valid: errors.length === 0, errors };
}
