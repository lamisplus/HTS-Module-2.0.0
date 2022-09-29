package org.lamisplus.modules.hts.domain.dto;

import lombok.*;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class IndexElicitationDto {
    /*@NotNull(message = "htsClientId is mandatory")
    private Long htsClientId;
    @NotNull(message = "personId is mandatory")
    private  final Long personId;
    @NotNull(message = "Index Notification Services - Elicitation is mandatory")
    private  final Object indexNotificationServicesElicitation;*/

    @NotNull(message = "htsClientId is mandatory")
    private Long htsClientId;
    private LocalDate dob;
    private Boolean isDateOfBirthEstimated;
    private Long sex;
    private String address;
    private String lastName;
    private String firstName;
    private String middleName;
    private String phoneNumber;
    private String altPhoneNumber;
    private String hangOutSpots;
    private Long physicalHurt;
    private Long threatenToHurt;
    private Long notificationMethod;
    private Long partnerTestedPositive;
    private Long relationshipToIndexClient;
    private Long sexuallyUncomfortable;
    private Boolean currentlyLiveWithPartner;
    private LocalDate datePartnerCameForTesting;
}
