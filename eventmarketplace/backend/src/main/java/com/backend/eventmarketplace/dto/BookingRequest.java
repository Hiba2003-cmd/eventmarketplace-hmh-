package com.backend.eventmarketplace.dto;

import com.backend.eventmarketplace.model.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private String eventId;
    private Integer numberOfSeats;
    private Payment.PaymentMethod paymentMethod;
}