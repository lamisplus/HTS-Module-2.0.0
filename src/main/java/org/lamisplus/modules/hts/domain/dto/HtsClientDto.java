package org.lamisplus.modules.hts.domain.dto;

import lombok.*;
import org.lamisplus.modules.base.domain.entities.ApplicationCodeSet;
import org.lamisplus.modules.base.domain.entities.User;
import org.lamisplus.modules.patient.domain.dto.PersonDto;
import org.lamisplus.modules.patient.domain.dto.PersonResponseDto;
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
    private  Long targetGroup;
    //private  ApplicationCodeSet targetGroupCodeSet;
    private  String clientCode;
    private  LocalDate dateVisit;
    private  Long referredFrom;
    //private  ApplicationCodeSet referredFromCodeSet;
    private  Long testingSetting;
    //private  ApplicationCodeSet testingSettingCodeSet;
    private  Boolean firstTimeVisit;
    private  Integer numChildren;
    private  Integer numWives;
    private  Long typeCounseling;
    //private  ApplicationCodeSet typeCounselingCodeSet;
    private  Boolean indexClient;
    private  Boolean previouslyTested;
    private  Long personId;
    private PersonResponseDto personResponseDto;
    private  Object extra;
    private Long pregnant;
    private Long breastFeeding;
    private Long relationWithIndexClient;
    private String capturedBy;

    /*private ApplicationCodeSet pregnantCodeSet;
    private ApplicationCodeSet breastFeedingCodeSet;
    private ApplicationCodeSet relationWithIndexClientCodeSet;*/

    //PRE TEST COUNSELING
    private  Object knowledgeAssessment;
    private  Object riskAssessment;
    private  Object tbScreening;
    private  Object stiScreening;

    //Request & Result Form
    private  Object test1;
    private  Object confirmatoryTest;
    private  Object tieBreakerTest;
    private String  hivTestResult;
    private Object syphilisTesting;
    private Object hepatitisBTesting;
}
