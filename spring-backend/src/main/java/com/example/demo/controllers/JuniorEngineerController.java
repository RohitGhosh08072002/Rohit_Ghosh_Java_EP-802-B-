package com.example.demo.controllers;

import com.example.demo.models.Complaint;
import com.example.demo.models.ComplaintMapping;
import com.example.demo.repositories.ComplaintMappingRepository;
import com.example.demo.repositories.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jeng")
public class JuniorEngineerController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ComplaintMappingRepository complaintMappingRepository;

    @GetMapping("/dashboard/{engineerName}")
    public ResponseEntity<?> getDashboard(@PathVariable String engineerName) {
        List<ComplaintMapping> mappings = complaintMappingRepository.findByEngineerName(engineerName);
        List<String> complaintIDs = mappings.stream().map(ComplaintMapping::getComplaintID).collect(Collectors.toList());
        
        List<Complaint> assignedComplaints = (List<Complaint>) complaintRepository.findAllById(complaintIDs);
        
        long totalAssigned = assignedComplaints.size();
        long resolvedCount = assignedComplaints.stream().filter(c -> "Resolved".equals(c.getStatus())).count();
        
        Map<String, Object> response = new HashMap<>();
        response.put("complaints", assignedComplaints);
        response.put("stats_total", totalAssigned);
        response.put("stats_resolved", resolvedCount);
        response.put("stats_pending", totalAssigned - resolvedCount);
        response.put("stats_successPercentage", totalAssigned > 0 ? (resolvedCount * 100 / totalAssigned) : 0);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/resolve/{complaintID}")
    public ResponseEntity<?> resolveComplaint(@PathVariable String complaintID) {
        return complaintRepository.findById(complaintID).map(complaint -> {
            complaint.setStatus("Resolved");
            complaintRepository.save(complaint);
            return ResponseEntity.ok("Complaint marked as resolved");
        }).orElse(ResponseEntity.status(404).body("Complaint not found"));
    }
}
