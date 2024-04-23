package org.lamisplus.modules.hts.domain.dto;

import lombok.*;
import org.lamisplus.modules.hts.domain.entity.HtsClient;

import java.time.LocalDate;

@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class HtsClientReferralDTO {
    private Long id;
    private LocalDate dateVisit;
    private String htsClientUuid;
    private String uuid;
    private Long htsClientId;
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
    private String serviceNeeded;
    private String comments;
    private String receivingFacilityStateName;
    private String receivingFacilityLgaName;
    private Object receivingOrganization;
}
