import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";
import { dashboardService } from "../services/dashboardService";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

export const OrganizerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getOrganizationDashboard();
      setDashboardData(res);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const statusBodyTemplate = (rowData) => {
    const severity = rowData.status === "CONFIRMED" ? "success" : "warning";
    return <Tag value={rowData.status} severity={severity} />;
  };

  const priceBodyTemplate = (rowData) => (
    <span className="font-semibold">${rowData.totalPrice.toFixed(2)}</span>
  );

  const dateBodyTemplate = (rowData) =>
    new Date(rowData.bookingDate).toLocaleDateString();

  if (loading || !dashboardData) {
    return (
      <div
        className="flex align-items-center justify-content-center"
        style={{ minHeight: "400px" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  const bookingsChartData = {
    labels: dashboardData.eventStats.map((e) => e.eventTitle),
    datasets: [
      {
        label: "Total Bookings",
        backgroundColor: "#42A5F5",
        data: dashboardData.eventStats.map((e) => e.totalBookings),
      },
    ],
  };

  const revenueChartData = {
    labels: dashboardData.eventStats.map((e) => e.eventTitle),
    datasets: [
      {
        label: "Revenue ($)",
        backgroundColor: "#9C27B0",
        data: dashboardData.eventStats.map((e) => e.totalRevenue),
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

      <div className="grid mb-4">
        <div className="col-12 md:col-6 lg:col-4">
          <Card className="bg-green-50">
            <div className="text-gray-600 text-sm">Total Bookings</div>
            <div className="text-3xl font-bold text-green-900">
              {dashboardData.totalBookings}
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-4">
          <Card className="bg-purple-50">
            <div className="text-gray-600 text-sm">Total Revenue</div>
            <div className="text-3xl font-bold text-purple-900">
              ${dashboardData.totalRevenue.toLocaleString()}
            </div>
          </Card>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-2">Bookings & Revenue</h2>
      <div className="grid mb-4">
        <div className="col-12 md:col-6 lg:col-6 mb-3">
          <Card>
            <h3 className="text-lg font-semibold mb-2">Bookings by Event</h3>
            <Chart
              type="bar"
              data={bookingsChartData}
              style={{ width: "100%", height: "250px" }}
            />
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-6 mb-3">
          <Card>
            <h3 className="text-lg font-semibold mb-2">Revenue by Event</h3>
            <Chart
              type="bar"
              data={revenueChartData}
              style={{ width: "100%", height: "250px" }}
            />
          </Card>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-4 mb-2">Recent Bookings</h2>
      <Card>
        <DataTable
          value={dashboardData.recentBookings}
          rows={5}
          emptyMessage="No recent bookings"
        >
          <Column
            field="eventTitle"
            header="Event"
            style={{ minWidth: "150px" }}
          />
          <Column field="userName" header="Customer" />
          <Column field="ticketCount" header="Tickets" />
          <Column body={priceBodyTemplate} header="Amount" />
          <Column body={statusBodyTemplate} header="Status" />
          <Column body={dateBodyTemplate} header="Date" />
        </DataTable>
      </Card>
    </div>
  );
};
