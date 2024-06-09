package org.lamisplus.modules.hts.domain.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.hts.domain.entity.Hivst;
import org.lamisplus.modules.patient.domain.dto.PersonDto;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class HivstDto implements Serializable {

    private Long id;
    private Long patientId;
    private PersonDto personObject;
    private LocalDate dateOfVisit;
    private String serviceDeliveryPoint;
    private String userType;
    private String serialNumber;
    private String clientCode;
    private String previouslyTestedWithin12Months;
    private String resultOfPreviouslyTestedWithin12Months;
    private String consentForFollowUpCalls;
    private String typeOfHivstKitReceived;
    private int numberOfHivstKitsReceived;
    private String nameOfTestKit;
    private String lotNumber;
    private LocalDate expiryDate;
    private List<String> testKitUsers;
    private String otherTestKitUserInfoAvailable;
    private List<HivstTestKitUserInfoDto> testKitUserDetails;
    private HivstPartBDto postTestAssessment;
    private HivstReferralInformationDto referralInformation;

    public static HivstDto fromEntity(Hivst hivst) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        return HivstDto.builder()
                .id(hivst.getId())
                .patientId(hivst.getPatientId())
                .dateOfVisit(hivst.getDateOfVisit())
                .serviceDeliveryPoint(hivst.getServiceDeliveryPoint())
                .userType(hivst.getUserType())
                .serialNumber(hivst.getSerialNumber())
                .clientCode(hivst.getClientCode())
                .previouslyTestedWithin12Months(hivst.getPreviouslyTestedWithin12Months())
                .resultOfPreviouslyTestedWithin12Months(hivst.getResultOfPreviouslyTestedWithin12Months())
                .consentForFollowUpCalls(hivst.getConsentForFollowUpCalls())
                .typeOfHivstKitReceived(hivst.getTypeOfHivstKitReceived())
                .numberOfHivstKitsReceived(hivst.getNumberOfHivstKitsReceived())
                .nameOfTestKit(hivst.getNameOfTestKit())
                .lotNumber(hivst.getLotNumber())
                .expiryDate(hivst.getExpiryDate())
                .testKitUsers(Arrays.asList(objectMapper.treeToValue(hivst.getTestKitUsers(), String[].class)))
                .otherTestKitUserInfoAvailable(hivst.getOtherTestKitUserInfoAvailable())
                .testKitUserDetails(Arrays.asList(objectMapper.treeToValue(hivst.getTestKitUserDetails(), HivstTestKitUserInfoDto[].class)))
                .postTestAssessment(objectMapper.treeToValue(hivst.getPostTestAssessment(), HivstPartBDto.class))
                .referralInformation(objectMapper.treeToValue(hivst.getReferralInformation(), HivstReferralInformationDto.class))
                .build();
    }

}
