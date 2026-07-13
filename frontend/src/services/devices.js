import api from "./api";

export const getDevices = () => api.get("/devices");
export const getDevice = (id) => api.get(`/devices/${id}`);
export const addDevice = (data) => api.post("/devices", data);
export const updateDevice = (id, data) => api.put(`/devices/${id}`, data);
export const deleteDevice = (id) => api.delete(`/devices/${id}`);
export const searchDevices = (keyword) => api.get(`/search/${encodeURIComponent(keyword)}`);
