package com.backend.eventmarketplace.dto;

import com.backend.eventmarketplace.model.Booking;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private List<EventStatsDTO> eventStats;
    private Integer totalBookings;
    private Double totalRevenue;
    private List<Booking> recentBookings;
}