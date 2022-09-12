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
    private Long isDateOfBirthEstimated;
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
