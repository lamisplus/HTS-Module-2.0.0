package org.lamisplus.modules.hts.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.hts.domain.dto.PersonalNotificationServiceRequestDTO;
import org.lamisplus.modules.hts.domain.dto.PersonalNotificationServiceResponseDTO;
import org.lamisplus.modules.hts.service.PNSService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/hts-personal-notification-service")
public class HtsPersonalNotificationServiceController {


     private final PNSService pnsServiceImplementation;

    @PostMapping
    public ResponseEntity<PersonalNotificationServiceResponseDTO> save(@Valid @RequestBody PersonalNotificationServiceRequestDTO req) {
        return ResponseEntity.ok(this.pnsServiceImplementation.save(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonalNotificationServiceResponseDTO> getPnsIndexClientPartnerById(@PathVariable Long id) {
        return ResponseEntity.ok(this.pnsServiceImplementation.getPnsIndexClientPartnerById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonalNotificationServiceResponseDTO> update(@PathVariable Long id, @Valid @RequestBody PersonalNotificationServiceResponseDTO res) {
        return ResponseEntity.ok(this.pnsServiceImplementation.update(id, res));
    }

    @GetMapping("/{id}/hts-client")
    public ResponseEntity<List<PersonalNotificationServiceResponseDTO>> getAllIndexClientByHtsClientId(@PathVariable Long id) {
        return ResponseEntity.ok(this.pnsServiceImplementation.getAllPnsIndexClientByHtsClient(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.pnsServiceImplementation.deletePnsIndexClientPartnerById(id));
    }
    @GetMapping("/get-partner-id")
    public ResponseEntity<String> generatePartnerId(@RequestParam Long htsClientId, @RequestParam String clientCode) {
        return ResponseEntity.ok(this.pnsServiceImplementation.generatePartnerId(htsClientId, clientCode));
    }


}
