package org.lamisplus.modules.hts.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.hts.domain.dto.HivstDto;
import org.lamisplus.modules.hts.service.HivstService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hivst")
@RequiredArgsConstructor
public class HivstController {
    @Autowired
    private HivstService hivstService;

    @PostMapping
    public List<HivstDto> saveHivst(@RequestBody HivstDto hivstDto) {
        return hivstService.saveHivst(hivstDto);
    }

    @GetMapping("/{id}")
    public HivstDto getHivstById(@PathVariable("id") Long id) {
        return hivstService.getHivstById(id);
    }

    @GetMapping
    public List<HivstDto> getHivstByPatientId(@RequestParam("patientId") Long patientId){
        return hivstService.getAllHivstByPatientId(patientId);
    }

    @PutMapping("/{id}")
    public HivstDto updateHivst(@RequestBody HivstDto hivstDto, Long id) {
        return hivstService.updateHivst(hivstDto, id);
    }

    @DeleteMapping("/{id}")
    public String deleteHivst(@PathVariable("id") Long id) {
        return hivstService.deleteHivst(id);
    }

}
