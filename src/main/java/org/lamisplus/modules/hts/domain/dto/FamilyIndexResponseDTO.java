package org.lamisplus.modules.hts.domain.dto;

import lombok.*;

import java.time.LocalDate;

@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class FamilyIndexResponseDTO {
    private Long id;
    private String uuid;
    private String familyRelationship;
    private String familyIndexHivStatus;
    private int childNumber;
    private String motherDead;
    private String UAN;
    private LocalDate yearMotherDead;
    private String familyIndexTestingUuid;
}
