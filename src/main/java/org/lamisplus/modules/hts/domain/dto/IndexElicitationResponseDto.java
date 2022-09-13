package org.lamisplus.modules.hts.domain.dto;

import lombok.*;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class IndexElicitationResponseDto {
    @NotNull(message = "htsClientId is mandatory")
    private Long htsClientId;
    private Long id;
    private LocalDate dob;
    private Boolean isDateOfBirthEstimated;
    private Long sex;
    private String address;
    private String lastName;
    private String firstName;
    private String middleName;
    private String phoneNumber;
    private String altPhoneNumber;
    private Long hangOutSpots;
    private Boolean physicalHurt;
    private Boolean threatenToHurt;
    private Long notificationMethod;
    private Boolean partnerTestedPositive;
    private Long relativeToIndexClient;
    private Boolean sexuallyUncomfortable;
    private Boolean currentlyLiveWithPartner;
    private LocalDate datePartnerCameForTesting;
}
