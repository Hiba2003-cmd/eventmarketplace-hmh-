package com.backend.eventmarketplace.service;

import com.backend.eventmarketplace.dto.DashboardStats;
import com.backend.eventmarketplace.dto.EventStatsDTO;
import com.backend.eventmarketplace.model.Booking;
import com.backend.eventmarketplace.model.Event;
import com.backend.eventmarketplace.repository.BookingRepository;
import com.backend.eventmarketplace.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class DashboardService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;

    public DashboardService(BookingRepository bookingRepository, EventRepository eventRepository) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
    }

    public DashboardStats getOrganizationDashboard() throws ExecutionException, InterruptedException {
        List<Event> events = eventRepository.findAll();

        List<EventStatsDTO> eventStats = events.stream().map(event -> {
            int totalBookings = event.getTotalBookings() != null ? event.getTotalBookings() : 0;
            int totalCapacity = event.getCapacity() != null ? event.getCapacity() : 0;
            int availableSeats = totalCapacity - totalBookings;
            double totalRevenue = event.getTotalRevenue() != null ? event.getTotalRevenue() : 0.0;

            return new EventStatsDTO(
                    event.getId(),
                    event.getTitle(),
                    totalBookings,
                    totalCapacity,
                    availableSeats,
                    totalRevenue
            );
        }).toList();

        int overallBookings = eventStats.stream()
                .mapToInt(EventStatsDTO::getTotalBookings)
                .sum();

        double overallRevenue = eventStats.stream()
                .mapToDouble(EventStatsDTO::getTotalRevenue)
                .sum();

        List<Booking> recentBookings = events.stream()
                .flatMap(e -> {
                    try {
                        return bookingRepository.findByEventId(e.getId()).stream();
                    } catch (ExecutionException | InterruptedException ex) {
                        throw new RuntimeException(ex);
                    }
                })
                .sorted(Comparator.comparing(Booking::getBookingDate).reversed())
                .limit(10)
                .toList();

        return new DashboardStats(eventStats, overallBookings, overallRevenue, recentBookings);
    }

}