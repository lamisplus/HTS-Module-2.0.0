package org.lamisplus.modules.hts.domain.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class IndexNotificationServicesElicitationDto {
    @NotNull(message = "htsClientId is mandatory")
    private final Long htsClientId;
    @NotNull(message = "personId is mandatory")
    private  final Long personId;
    @NotNull(message = "Index Notification Services - Elicitation is mandatory")
    private  final Object indexNotificationServicesElicitation;
}
