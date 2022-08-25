package org.lamisplus.modules.hts.domain.dto;

import lombok.Data;
import javax.validation.constraints.NotNull;

@Data
public class HtsHivTestResultDto {
    @NotNull(message = "htsClientId is mandatory")
    private final Long htsClientId;
    @NotNull(message = "personId is mandatory")
    private  final Long personId;
    //HIV TEST RESULT
    @NotNull(message = "first test is mandatory")
    private  final Object test1;
    private  final Object confirmatoryTest;
    private  final Object tieBreakerTest;
    private final String  hivTestResult;
}
