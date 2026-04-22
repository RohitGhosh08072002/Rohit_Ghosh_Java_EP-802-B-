package com.example.demo.controllers;

import com.example.demo.models.ComplaintMapping;
import com.example.demo.repositories.ComplaintMappingRepository;
import com.example.demo.repositories.ComplaintRepository;
import com.example.demo.repositories.FeedbackRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ComplaintMappingRepository complaintMappingRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData() {
        Map<String, Object> response = new HashMap<>();
        
        long totalComplaints = complaintRepository.count();
        long resolvedComplaints = complaintMappingRepository.count();
        
        response.put("complaints", complaintRepository.findAll());
        response.put("engineers", userRepository.findByRole("jeng"));
        response.put("feedbacks", feedbackRepository.findAll());
        response.put("stats_total", totalComplaints);
        response.put("stats_resolved", resolvedComplaints);
        response.put("stats_pending", Math.max(0, totalComplaints - resolvedComplaints));
        response.put("stats_successPercentage", totalComplaints > 0 ? (resolvedComplaints * 100 / totalComplaints) : 0);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/assign")
    public ResponseEntity<?> assignComplaint(@RequestBody ComplaintMapping mapping) {
        complaintMappingRepository.save(mapping);
        return ResponseEntity.ok("Complaint assigned to engineer successfully");
    }
}
