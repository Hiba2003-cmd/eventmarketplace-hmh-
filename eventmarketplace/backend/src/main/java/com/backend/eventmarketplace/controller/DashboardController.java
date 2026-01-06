package com.backend.eventmarketplace.controller;

import com.backend.eventmarketplace.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/organization")
    public ResponseEntity<?> getOrganizationDashboard() throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(
                dashboardService.getOrganizationDashboard()
        );
    }
}