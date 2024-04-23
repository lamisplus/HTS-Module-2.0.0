package org.lamisplus.modules.hts.domain.dto;


import lombok.Data;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class HtsClientReferralRequestDTO {
    private LocalDate dateVisit;
    @NotNull(message = "htsClientId is mandatory")
    private Long htsClientId;
    private String htsClientUuid;
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
    private String isDateOfBirthEstimated;
    private String receivingFacilityStateName;
    private String receivingFacilityLgaName;
    private String serviceNeeded;
    private String comments;

}
