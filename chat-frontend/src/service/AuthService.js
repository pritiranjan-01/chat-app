import { httpClient } from "../config/AxiosHelper";

/** POST /user/login — returns { access_token } */
export const loginApi = async (email, password) => {
  const response = await httpClient.post("/user/login", { email, password });
  return response.data;
};

/** POST /user/register — multipart/form-data */
export const registerApi = async (formData) => {
  const response = await httpClient.post("/user/register", formData);
  return response.data;
};

/** GET /user/me — logged-in user's profile */
export const getMyProfileApi = async () => {
  const response = await httpClient.get("/user/me");
  return response.data;
};

/** GET /user/{id} — any user's public profile (requires auth) */
export const getUserApi = async (id) => {
  const response = await httpClient.get(`/user/${id}`);
  return response.data;
};

/** POST /user/me — update name and/or profile picture (multipart/form-data) */
export const updateProfileApi = async (formData) => {
  const response = await httpClient.post("/user/me", formData);
  return response.data;
};

/** POST /user/me/change-password — change the user's password */
export const changePasswordApi = async (oldPassword, newPassword) => {
  const response = await httpClient.post("/user/me/change-password", {
    oldPassword,
    newPassword,
  });
  return response.data;
};
