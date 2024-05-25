package org.lamisplus.modules.hts.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.patient.domain.dto.PersonDto;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

@Builder
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class HivstBasicUserInfoDto implements Serializable {
    private Long patientId;
    private String hospitalNumber;
    private String firstName;
    private String lastName;
    private String otherName;
    private String userCategory;
    private String clientCode;
    private String dateOfBirth;
    private String dateOfRegistration;
    private String age;
    private String sex;
    private String maritalStatus;
    private String typeOfHivst;

    public static PersonDto toPersonDto(HivstBasicUserInfoDto basicUserInfoDto) {
        return PersonDto.builder()
                .firstName(basicUserInfoDto.getFirstName())
                .surname(basicUserInfoDto.getLastName())
                .otherName(basicUserInfoDto.getOtherName())
                .dateOfBirth(LocalDate.parse(basicUserInfoDto.getDateOfBirth(), DateTimeFormatter.ISO_LOCAL_DATE))
                .dateOfRegistration(LocalDate.parse(basicUserInfoDto.getDateOfRegistration(), DateTimeFormatter.ISO_LOCAL_DATE))
                .identifier(new ArrayList<>())
//                .maritalStatusId(basicUserInfoDto.getClientCode())
                .build();
    }
}
