import { NativeModules, Platform } from "react-native";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const getPackagerHost = () => {
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (!scriptURL) {
    return null;
  }

  const match = scriptURL.match(/^[a-z]+:\/\/([^/:]+)/i);
  return match?.[1] || null;
};

const resolveApiRoot = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return trimTrailingSlash(envUrl);
  }

  const host = getPackagerHost();
  if (host) {
    return `http://${host}:9090/api`;
  }

  if (Platform.OS === "android") {
    return "http://10.10.152.66:9090/api";
  }

  return "http://10.10.152.66:9090/api";
};

const API_ROOT = resolveApiRoot();

const parseJsonSafely = (rawText) => {
  if (!rawText) {
    return null;
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return null;
  }
};

const request = async (endpoint, method = "GET", body = null) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_ROOT}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal,
    });

    const rawText = await response.text();
    const data = parseJsonSafely(rawText);

    if (!response.ok) {
      throw new Error(
        data?.message || data?.error || rawText || "Request failed",
      );
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timeout");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

const loginInstructor = async (email, password) => {
  const response = await request("/auth/login", "POST", { email, password });

  if (response?.user?.role !== "instructor") {
    throw new Error("This account is not registered as an instructor");
  }

  return response;
};

const registerInstructor = (payload) =>
  request("/instructors/register", "POST", payload);

const getInstructorProfile = (userId) => request(`/instructors/user/${userId}`);

const getUserProfile = (userId) => request(`/profile/${userId}`);

const getBookingsByInstructorId = (instructorId) =>
  request(`/bookings/instructor/${instructorId}`);

const updateBookingStatus = (bookingId, status) =>
  request(`/bookings/${bookingId}/status`, "PATCH", { status });

const updateInstructorLocation = (userId, latitude, longitude) =>
  request(`/instructors/user/${userId}/location`, "PATCH", { latitude, longitude });

const updateInstructorSettings = (userId, payload) =>
  request(`/instructors/user/${userId}/settings`, "PATCH", payload);

const getNearbyInstructors = (latitude, longitude, radius = 5) =>
  request(`/map/nearby?lat=${latitude}&lon=${longitude}&radius=${radius}`);

const getInstructorReviews = (instructorId) =>
  request(`/reviews/instructor/${instructorId}`);

const attachLearnerDetails = async (bookings) => {
  const learnerIds = [...new Set(bookings.map((booking) => booking.userId))];
  const learners = await Promise.all(
    learnerIds.map(async (userId) => {
      try {
        const profile = await getUserProfile(userId);
        return [String(userId), profile];
      } catch {
        return [String(userId), null];
      }
    }),
  );

  const learnerMap = new Map(learners);

  return bookings.map((booking) => ({
    ...booking,
    learner: learnerMap.get(String(booking.userId)),
  }));
};

const getInstructorBookings = async (userId) => {
  const instructor = await getInstructorProfile(userId);
  const bookings = await getBookingsByInstructorId(instructor.id);
  const enrichedBookings = await attachLearnerDetails(bookings);
  const reviews = await getInstructorReviews(instructor.id);

  return {
    instructor,
    bookings: enrichedBookings,
    reviews,
  };
};

const API = {
  API_ROOT,
  getBookingsByInstructorId,
  getInstructorBookings,
  getInstructorProfile,
  getInstructorReviews,
  getNearbyInstructors,
  getUserProfile,
  loginInstructor,
  registerInstructor,
  updateBookingStatus,
  updateInstructorLocation,
  updateInstructorSettings,
};

export default API;
