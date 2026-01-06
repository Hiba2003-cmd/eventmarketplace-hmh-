const BASE_URL = 'http://localhost:8080/api/dashboard';

export const dashboardService = {
  async getOrganizationDashboard() {
    const response = await fetch(`${BASE_URL}/organization`);
    if (!response.ok) throw new Error("Failed to fetch events");
    return response.json();
  }
};
