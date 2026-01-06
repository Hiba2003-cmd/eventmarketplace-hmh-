const API_BASE_URL = "http://localhost:8080/api/events";

export const eventService = {
  async getAllEvents() {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch events");
    return response.json();
  },

  async getEventById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch event");
    return response.json();
  },

  async createEvent(eventData) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) throw new Error("Failed to create event");
    return response.json();
  },

  async updateEvent(id, eventData) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) throw new Error("Failed to update event");
    return response.json();
  },

  async toggleBooking(id) {
    const response = await fetch(`${API_BASE_URL}/${id}/toggle-booking`, {
      method: "PUT",
    });

    if (!response.ok) throw new Error("Failed to toggle booking");
    return response.json();
  },

  async deleteEvent(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete event");
    return response.text();
  },
};
