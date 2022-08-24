package org.lamisplus.modules.hts.domain.dto;

import lombok.*;
import org.lamisplus.modules.patient.domain.entity.Person;

import java.io.Serializable;
import java.time.LocalDate;

@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class HtsClientDto {
    private  Long id;
    private  Object targetGroup;
    private  String clientCode;
    private  LocalDate dateVisit;
    private  String referredFrom;
    private  Object testingSetting;
    private  Boolean firstTimeVisit;
    private  Integer numChildren;
    private  Integer numWives;
    private  Object typeCounseling;
    private  Boolean indexClient;
    private  Boolean previouslyTested;
    private  Long personId;
    private Person person;
    private  Object extra;

    //PRE TEST COUNSELING
    private  Object knowledgeAssessment;
    private  Object riskAssessment;
    private  Object tbScreening;
    private  Object stiScreening;

    //HIV TEST RESULT
    private  Object test1;
    private  Object confirmatoryTest;
    private  Object tieBreakerTest;
    private Long  hivTestResult;
}
