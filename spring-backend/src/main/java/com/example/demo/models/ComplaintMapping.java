package com.example.demo.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "complaintmappings")
public class ComplaintMapping {

    @Id
    private String id;
    private String complaintID;
    private String engineerName;

    public ComplaintMapping() {}

    public ComplaintMapping(String complaintID, String engineerName) {
        this.complaintID = complaintID;
        this.engineerName = engineerName;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getComplaintID() { return complaintID; }
    public void setComplaintID(String complaintID) { this.complaintID = complaintID; }
    public String getEngineerName() { return engineerName; }
    public void setEngineerName(String engineerName) { this.engineerName = engineerName; }
}
