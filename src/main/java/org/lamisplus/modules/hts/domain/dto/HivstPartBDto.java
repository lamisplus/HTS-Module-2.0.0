package org.lamisplus.modules.hts.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class HivstPartBDto implements Serializable {
    private String everUsedHivstKit;
    private String everUsedHivstKitForSelfOrOthers;
    private String otherHivstKitUserCategory;
    private String otherHivstKitUserCategoryText;
    private String resultOfHivstTest;
    private String accessConfirmatoryHts;
    private String referPreventionServices;
    private HivstReferralInformationDto referralInformation;

//    public static HivstPartBDto fromJson(String everUsedHivstKit, String everUsedHivstKitForSelfOrOthers, String otherHivstKitUserCategory, String otherHivstKitUserCategoryText, String resultOfHivstTest, String accessConfirmatoryHts, String referPreventionServices) {
//        return HivstPartBDto.builder()
//                .everUsedHivstKit(everUsedHivstKit)
//                .everUsedHivstKitForSelfOrOthers(everUsedHivstKitForSelfOrOthers)
//                .otherHivstKitUserCategory(otherHivstKitUserCategory)
//                .otherHivstKitUserCategoryText(otherHivstKitUserCategoryText)
//                .resultOfHivstTest(resultOfHivstTest)
//                .accessConfirmatoryHts(accessConfirmatoryHts)
//                .referPreventionServices(referPreventionServices)
//                .build();
//    }
}
