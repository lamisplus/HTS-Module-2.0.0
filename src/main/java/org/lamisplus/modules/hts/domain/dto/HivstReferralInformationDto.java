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
public class HivstReferralInformationDto implements Serializable {
    private String referredForConfirmatoryHts;
    private String dateReferredForConfirmatoryHts;
    private String referredForPreventionServices;
    private String dateReferredForPreventionServices;

    public static HivstReferralInformationDto fromJson(String referredForConfirmatoryHts, String dateReferredForConfirmatoryHts, String referredForPreventionServices, String dateReferredForPreventionServices) {
        return HivstReferralInformationDto.builder()
                .referredForConfirmatoryHts(referredForConfirmatoryHts)
                .dateReferredForConfirmatoryHts(dateReferredForConfirmatoryHts)
                .referredForPreventionServices(referredForPreventionServices)
                .dateReferredForPreventionServices(dateReferredForPreventionServices)
                .build();
    }
}
