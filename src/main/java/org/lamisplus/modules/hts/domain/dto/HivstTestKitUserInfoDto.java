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
public class HivstTestKitUserInfoDto implements Serializable {
    private HivstBasicUserInfoDto basicUserInfo;
    private HivstPartBDto postTestAssessment;

}
