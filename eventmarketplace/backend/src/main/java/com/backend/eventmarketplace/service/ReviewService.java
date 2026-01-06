package com.backend.eventmarketplace.service;


import com.backend.eventmarketplace.model.Review;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ReviewService {

    private UnsupportedOperationException notImplemented() {
        return new UnsupportedOperationException("Reviews are a Module 2 feature.");
    }

    public Review createReview(Review review) throws ExecutionException, InterruptedException {
        throw notImplemented();
    }

    public List<Review> getEventReviews(String eventId) throws ExecutionException, InterruptedException {
        throw notImplemented();
    }

    public List<Review> getSupplierReviews(String supplierId) throws ExecutionException, InterruptedException {
        throw notImplemented();
    }

    public Double getAverageRating(String entityId) throws ExecutionException, InterruptedException {
        throw notImplemented();
    }

    public void deleteReview(String reviewId) throws ExecutionException, InterruptedException {
        throw notImplemented();
    }
}
