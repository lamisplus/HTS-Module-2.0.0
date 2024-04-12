package org.lamisplus.modules.hts.domain.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ReferringOrganizationDTO {
    private LocalDate referralDate;
    private String firstName;
    private String middleName;
    private String lastName;
    private String hospitalNumber;
    private String countryId;
    private String stateId;
    private String province;
    private String address;
    private String landmark;
    private String phoneNumber;
    private String sexId;
    private LocalDate dob;
    private String age;
    private LocalDate dateOfBirth;
    private String hivStatus;
    private String referredFromFacility;
    private String nameOfPersonReferringClient;
    private String nameOfReferringFacility;
    private String addressOfReferringFacility;
    private String phoneNoOfReferringFacility;
    private String referredTo;
    private String nameOfContactPerson;
    private String nameOfReceivingFacility;
    private String addressOfReceivingFacility;
    private String phoneNoOfReceivingFacility;
    private boolean isDateOfBirthEstimated;
    private String serviceNeeded;
    private String comments;
}
