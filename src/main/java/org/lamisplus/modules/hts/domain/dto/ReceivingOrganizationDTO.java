package org.lamisplus.modules.hts.domain.dto;

import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@Builder
public class ReceivingOrganizationDTO {
    @NotNull(message = "htsClientReferralId is mandatory")
    private final Long htsClientReferralId;
    private final Object receivingOrganizationDTO;

}
