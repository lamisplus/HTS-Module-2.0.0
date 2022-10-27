package org.lamisplus.modules.hts.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.hts.domain.dto.RiskStratificationDto;
import org.lamisplus.modules.hts.domain.dto.RiskStratificationResponseDto;
import org.lamisplus.modules.hts.service.RiskStratificationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
//import org.testcontainers.shaded.okhttp3.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Api(tags = "RiskStratification API")
public class RiskStratificationController {
    private final RiskStratificationService riskStratificationService;
    private final String RISK_STRATIFICATION_URL_VERSION_ONE = "/api/v1/risk-stratification";

    @PostMapping(RISK_STRATIFICATION_URL_VERSION_ONE)
    @ResponseStatus(HttpStatus.CREATED)
    @ApiOperation("Add new data")
    public RiskStratificationResponseDto save(@RequestBody RiskStratificationDto riskStratificationDTO) {
        return riskStratificationService.save(riskStratificationDTO);
    }
}