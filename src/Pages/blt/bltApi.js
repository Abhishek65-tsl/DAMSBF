import { api } from "../../Services/api";

export const fetchBLTDashboardMock = () => api.get("blt/dashboard");
export const fetchBLTSectionHealthMock = () => api.get("blt/section-health");
export const fetchBLTAlarmSummaryMock = () => api.get("blt/alarm-summary");
export const fetchBLTAlertDistributionMock = () => api.get("blt/alert-distribution");
export const fetchBLTMoComplianceMock = () => api.get("blt/mo-compliance");
export const fetchBLTGfcDetailsMock = () => api.get("blt/gfc-details");
export const fetchBLTTrendMock = (tagId) => api.get(`blt/trend/${tagId}`);

export const fetchChargingDashboardMock = () => api.get("blt/charging/dashboard");
export const fetchChargingHealthMock = () => api.get("blt/charging/health");
export const fetchChargingAlarmSummaryMock = () => api.get("blt/charging/alarm-summary");
export const fetchChargingAlertDistributionMock = () => api.get("blt/charging/alert-distribution");
export const fetchChargingMoComplianceMock = () => api.get("blt/charging/mo-compliance");
export const fetchChargingTrendMock = (tagId) => api.get(`blt/charging/trend/${tagId}`);

export const fetchCoolingDashboardMock = () => api.get("blt/cooling/dashboard");
export const fetchCoolingHealthMock = () => api.get("blt/cooling/health");
export const fetchCoolingAlarmSummaryMock = () => api.get("blt/cooling/alarm-summary");
export const fetchCoolingEquipmentAlertsMock = () => api.get("blt/cooling/alert-distribution");
export const fetchCoolingMoComplianceMock = () => api.get("blt/cooling/mo-compliance");
export const fetchCoolingTrendMock = (tagId) => api.get(`blt/cooling/trend/${tagId}`);

export const fetchValveDashboardMock = () => api.get("blt/valve/dashboard");
export const fetchValveHealthMock = () => api.get("blt/valve/health");
export const fetchValveAlarmSummaryMock = () => api.get("blt/valve/alarm-summary");
export const fetchValveAlertDistributionMock = () => api.get("blt/valve/alert-distribution");
export const fetchValveMoComplianceMock = () => api.get("blt/valve/mo-compliance");
export const fetchValveTrendMock = (tagId) => api.get(`blt/valve/trend/${tagId}`);

export const fetchHydraulicDashboardMock = () => api.get("blt/hydraulic/dashboard");
export const fetchHydraulicHealthMock = () => api.get("blt/hydraulic/health");
export const fetchHydraulicAlarmSummaryMock = () => api.get("blt/hydraulic/alarm-summary");
export const fetchHydraulicEquipmentAlertsMock = () => api.get("blt/hydraulic/alert-distribution");
export const fetchHydraulicMoComplianceMock = () => api.get("blt/hydraulic/mo-compliance");
export const fetchHydraulicTrendMock = (tagId) => api.get(`blt/hydraulic/trend/${tagId}`);
