package org.lamisplus.modules.hts.domain.entity;

import java.time.LocalDate;

public interface HivstPerson {
    Long getPersonId();
    String getFirstName();
    String getSurname();
    String getOtherName();
    String getHospitalNumber();
    Integer getAge();
    String getGender();
    LocalDate getDateOfBirth();
    String getClientCode();

    Integer getHivstId();

    Integer getHivstCount();
}
