package com.example.demo.repositories;

import com.example.demo.models.ComplaintMapping;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ComplaintMappingRepository extends MongoRepository<ComplaintMapping, String> {
    List<ComplaintMapping> findByEngineerName(String engineerName);
    Optional<ComplaintMapping> findByComplaintID(String complaintID);
}
