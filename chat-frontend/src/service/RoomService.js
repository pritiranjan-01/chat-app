import { httpClient } from "../config/AxiosHelper";

/** GET /room — fetch all rooms for the home page listing */
export const getRoomsApi = async () => {
  const response = await httpClient.get("/room");
  return response.data;
};

/** GET /room/{id} — fetch a single room by id */
export const getRoomApi = async (id) => {
  const response = await httpClient.get(`/room/${id}`);
  return response.data;
};

/** POST /room — create a new room (requires auth) */
export const createRoomApi = async (roomName, roomDescription, roomSize) => {
  const response = await httpClient.post("/room", { roomName, roomDescription, roomSize });
  return response.data;
};

/** POST /room/{id}/join — join a room (requires auth) */
export const joinRoomApi = async (id) => {
  const response = await httpClient.post(`/room/${id}/join`);
  return response.data;
};

/** DELETE /room/{id}/leave — leave a room (requires auth) */
export const leaveRoomApi = async (id) => {
  const response = await httpClient.delete(`/room/${id}/leave`);
  return response.data;
};

/** DELETE /room/{id} — delete an empty room */
export const deleteRoomApi = async (id) => {
  const response = await httpClient.delete(`/room/${id}`);
  return response.data;
};

/** GET /room/{id}/messages — paginated message history */
export const getMessagesApi = async (id, size = 50, page = 0) => {
  const response = await httpClient.get(
    `/room/${id}/messages?size=${size}&page=${page}`
  );
  return response.data;
};
