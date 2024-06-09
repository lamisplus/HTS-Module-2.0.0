package org.lamisplus.modules.hts.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.vladmihalcea.hibernate.type.array.IntArrayType;
import com.vladmihalcea.hibernate.type.array.StringArrayType;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;
import com.vladmihalcea.hibernate.type.json.JsonNodeStringType;
import com.vladmihalcea.hibernate.type.json.JsonStringType;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;
import org.hibernate.annotations.Where;
import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = false)
@Table(name = "hts_client_referral")
@Where(clause = "archived = 0")
@TypeDefs({
        @TypeDef(name = "string-array", typeClass = StringArrayType.class),
        @TypeDef(name = "int-array", typeClass = IntArrayType.class),
        @TypeDef(name = "json", typeClass = JsonStringType.class),
        @TypeDef(name = "jsonb", typeClass = JsonBinaryType.class),
        @TypeDef(name = "jsonb-node", typeClass = JsonNodeBinaryType.class),
        @TypeDef(name = "json-node", typeClass = JsonNodeStringType.class),
})
public class HtsClientReferral extends Audit implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "date_visit")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateVisit;

    @Column(name = "uuid", updatable = false)
    private String uuid;

    @Basic
    @Column(name = "hts_client_id")
    private Long htsClientId;

    @Basic
    @Column(name="hts_client_uuid")
    private String htsClientUuid;

    @Basic
    @Column(name = "archived")
    private int archived = 0;

    @ManyToOne
    @JoinColumn(name = "hts_client_uuid", referencedColumnName = "uuid", insertable = false, updatable = false)
    private HtsClient htsClient;

    @Basic
    @Column(name = "referred_from_facility")
    private String referredFromFacility;

    @Basic
    @Column(name = "name_of_person_referring_client")
    private String nameOfPersonReferringClient;
    @Basic
    @Column(name = "name_of_referring_facility")
    private String nameOfReferringFacility;
    @Basic
    @Column(name = "address_of_referring_facility")
    private String addressOfReferringFacility;
    @Basic
    @Column(name = "phone_no_of_referring_facility")
    private String phoneNoOfReferringFacility;
    @Basic
    @Column(name = "referred_to")
    private String referredTo;
    @Basic
    @Column(name = "name_of_contact_person")
    private String nameOfContactPerson;
    @Basic
    @Column(name = "name_of_reciving_facility")
    private String nameOfReceivingFacility;

    @Basic
    @Column(name="receiving_facility_state_name")
    private String receivingFacilityStateName;

    @Basic
    @Column(name="receiving_facility_lga_name")
    private String receivingFacilityLgaName;

    @Basic
    @Column(name = "address_of_receiving_facility")
    private String addressOfReceivingFacility;
    @Basic
    @Column(name = "phone_no_of_receiving_facility")
    private String phoneNoOfReceivingFacility;

    @Type(type = "jsonb")
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "service_needed", columnDefinition = "jsonb")
    private Object serviceNeeded;

    @Basic
    @Column(name = "comments")
    private String comments;

    // end of referral info

    @Type(type = "jsonb")
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "receiving_organization", columnDefinition = "jsonb")
    private Object receivingOrganization;

    @PrePersist
    public void setFields() {
        if (StringUtils.isEmpty(uuid)) {
            uuid = UUID.randomUUID().toString();
        }
    }

}
