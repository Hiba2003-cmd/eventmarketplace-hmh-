package com.backend.eventmarketplace.service;


import com.backend.eventmarketplace.dto.BookingRequest;
import com.backend.eventmarketplace.dto.BookingResponse;
import com.backend.eventmarketplace.model.Booking;
import com.backend.eventmarketplace.model.Event;
import com.backend.eventmarketplace.model.Payment;
import com.backend.eventmarketplace.model.User;
import com.backend.eventmarketplace.repository.BookingRepository;
import com.backend.eventmarketplace.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final PaymentService paymentService;
    private final AuthService authService;
    private final EmailService emailService;

    public BookingService(BookingRepository bookingRepository,
                          EventRepository eventRepository,
                          PaymentService paymentService,
                          AuthService authService,
                          EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.paymentService = paymentService;
        this.authService = authService;
        this.emailService = emailService;
    }

    public BookingResponse createBooking(String userId, BookingRequest request) throws Exception {
        Event event = eventRepository.findById(request.getEventId());
        if (event == null || !Boolean.TRUE.equals(event.getBookingEnabled())) {
            throw new IllegalArgumentException("Event not available for booking");
        }

        int seats = request.getNumberOfSeats();
        if (seats <= 0) {
            throw new IllegalArgumentException("Invalid number of seats");
        }
        if (event.getAvailableSeats() < seats) {
            throw new IllegalStateException("Not enough seats available");
        }
        User user = authService.getUserById(userId);

        double totalPrice = event.getTicketPrice() * seats;

        Booking booking = new Booking();
        booking.setId(null);
        booking.setReferenceNumber(generateBookingReference());
        booking.setUserId(userId);
        booking.setEventId(event.getId());
        booking.setNumberOfSeats(seats);
        booking.setTotalPrice(totalPrice);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking.setBookingDate(Instant.now());
        booking.setCreatedAt(Instant.now());
        booking.setPaymentStatus(Booking.PaymentStatus.COMPLETED);
        booking.setEventTitle(event.getTitle());
        booking.setEventDateTime(event.getEventDateTime());
        booking.setEventLocation(event.getLocation());
        booking.setUserName(user.getName());
        booking.setUserEmail(user.getEmail());
        booking.setUserPhone(user.getPhoneNumber());
        booking = bookingRepository.save(booking);

        // Create a stub payment record (no real gateway)
        Payment payment = paymentService.createPayment(
                booking.getId(),
                userId,
                event.getId(),
                totalPrice,
                request.getPaymentMethod()
        );

        booking.setPaymentId(payment.getId());
        booking.setPaymentStatus(Booking.PaymentStatus.COMPLETED);
        booking = bookingRepository.save(booking);
        eventServiceUpdateEventStats(event, seats, totalPrice);

        BookingResponse response = new BookingResponse();
        response.setBooking(booking);
        response.setPayment(payment);
        response.setMessage("Booking successful");

        try {
            this.emailService.sendConfirmationEmail(user.getEmail(), user.getName(), booking.getReferenceNumber());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return response;
    }

    private void eventServiceUpdateEventStats(Event event, int seats, double revenue) throws ExecutionException, InterruptedException {
        int currentBookings = event.getTotalBookings() != null ? event.getTotalBookings() : 0;
        double currentRevenue = event.getTotalRevenue() != null ? event.getTotalRevenue() : 0.0;
        int currentAvailable = event.getAvailableSeats() != null ? event.getAvailableSeats() : event.getCapacity();

        event.setTotalBookings(currentBookings + seats);
        event.setTotalRevenue(currentRevenue + revenue);
        event.setAvailableSeats(currentAvailable - seats);
        event.setUpdatedAt(Instant.now());

        eventRepository.save(event);
    }

    public Booking getBookingById(String bookingId) throws ExecutionException, InterruptedException {
        return bookingRepository.findById(bookingId);
    }

    public List<Booking> getAllBookings() throws ExecutionException, InterruptedException {
        return bookingRepository.findAll();
    }

    public List<Booking> getUserUpcomingBookings(String userId) throws ExecutionException, InterruptedException {
        Instant now = Instant.now();
        return bookingRepository.findByUserId(userId).stream()
                .filter(b -> b.getEventDateTime() != null)
                .filter(b -> b.getEventDateTime().isAfter(now))
                .filter(b -> b.getStatus() != Booking.BookingStatus.CANCELED)
                .collect(Collectors.toList());
    }

    public List<Booking> getUserPastBookings(String userId) throws ExecutionException, InterruptedException {
            Instant now = Instant.now();
            return bookingRepository.findByUserId(userId).stream()
                    .filter(b -> b.getEventDateTime() != null)
                    .filter(b -> b.getEventDateTime().isBefore(now))
                    .filter(b -> b.getStatus() != Booking.BookingStatus.CANCELED)
                    .collect(Collectors.toList());
    }

    public Booking cancelBooking(String bookingId, String userId) throws Exception {
        Booking booking = bookingRepository.findById(bookingId);
        if (booking == null) {
            throw new IllegalArgumentException("Booking not found");
        }
        if (!booking.getUserId().equals(userId)) {
            throw new IllegalStateException("User not allowed to cancel this booking");
        }

        booking.setStatus(Booking.BookingStatus.CANCELED);
        booking.setPaymentStatus(Booking.PaymentStatus.REFUNDED);
        booking = bookingRepository.save(booking);

        return booking;
    }

    public String generateBookingReference() {
        return "BK-" + Year.now().getValue() + "-" +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}