package org.lamisplus.modules.hts.domain.dto;

import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class FamilyIndexRequestDto {

    @NotBlank(message = "Family relationship is required")
    private String familyRelationship;

    @NotBlank(message = "Family index HIV status is required")
    private String familyIndexHivStatus;

    @NotNull(message = "Child number is required")
    private int childNumber;

    private String motherDead;

    private LocalDate yearMotherDead;

    private String UAN;

//    @NotBlank(message = "Family index testing UUID is required")
    private String familyIndexTestingUuid;

}
