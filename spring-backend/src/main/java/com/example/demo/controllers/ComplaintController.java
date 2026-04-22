package com.example.demo.controllers;

import com.example.demo.models.Complaint;
import com.example.demo.models.ComplaintMapping;
import com.example.demo.models.Feedback;
import com.example.demo.repositories.ComplaintMappingRepository;
import com.example.demo.repositories.ComplaintRepository;
import com.example.demo.repositories.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ComplaintMappingRepository complaintMappingRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerComplaint(@RequestBody Complaint complaint) {
        complaintRepository.save(complaint);
        return ResponseEntity.ok("Complaint registered successfully");
    }

    @GetMapping("/track/{id}")
    public ResponseEntity<?> trackComplaint(@PathVariable String id) {
        Optional<Complaint> complaint = complaintRepository.findById(id);
        if (!complaint.isPresent()) {
            return ResponseEntity.status(404).body("Complaint not found");
        }

        Optional<ComplaintMapping> mapping = complaintMappingRepository.findByComplaintID(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("complaint", complaint.get());
        mapping.ifPresent(m -> response.put("mapping", m));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/feedback")
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback feedback) {
        feedbackRepository.save(feedback);
        return ResponseEntity.ok("Feedback submitted successfully");
    }
}
