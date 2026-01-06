package com.backend.eventmarketplace.service;

import com.backend.eventmarketplace.model.Event;
import com.backend.eventmarketplace.repository.EventRepository;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event createEvent(Event event) throws ExecutionException, InterruptedException {
        event.setId(null);
        event.setStatus(Event.EventStatus.ACTIVE);
        event.setCreatedAt(Instant.now());
        event.setUpdatedAt(Instant.now());
        event.setAvailableSeats(event.getCapacity());
        event.setTotalBookings(0);
        event.setTotalRevenue(0.0);
        event.setBookingEnabled(event.getBookingEnabled());
        return eventRepository.save(event);
    }

    public Event updateEvent(String eventId, Event updated) throws ExecutionException, InterruptedException {
        Event existing = eventRepository.findById(eventId);
        if (existing == null) {
            throw new IllegalArgumentException("Event not found");
        }

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setEventDateTime(updated.getEventDateTime());
        existing.setLocation(updated.getLocation());
        existing.setCity(updated.getCity());
        existing.setTicketPrice(updated.getTicketPrice());
        existing.setCapacity(updated.getCapacity());
        existing.setAvailableSeats(updated.getAvailableSeats());
        existing.setEventType(updated.getEventType());
        existing.setImageUrls(updated.getImageUrls());
        existing.setSupplierNotes(updated.getSupplierNotes());
        existing.setBookingEnabled(updated.getBookingEnabled());
        existing.setStatus(updated.getStatus());
        existing.setUpdatedAt(Instant.now());

        return eventRepository.save(existing);
    }

    public void deleteEvent(String eventId) throws ExecutionException, InterruptedException {
        eventRepository.deleteById(eventId);
    }

    public Event getEventById(String eventId) throws ExecutionException, InterruptedException {
        return eventRepository.findById(eventId);
    }

    public List<Event> getAllEvents() throws ExecutionException, InterruptedException {
        return eventRepository.findAll();
    }

    public Event toggleBookingEnabled(String eventId) throws ExecutionException, InterruptedException {
        Event event = eventRepository.findById(eventId);
        if (event == null) {
            throw new IllegalArgumentException("Event not found");
        }
        boolean current = Boolean.TRUE.equals(event.getBookingEnabled());
        event.setBookingEnabled(!current);
        event.setUpdatedAt(Instant.now());
        return eventRepository.save(event);
    }

}