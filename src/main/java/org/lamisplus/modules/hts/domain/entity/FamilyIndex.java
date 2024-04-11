package org.lamisplus.modules.hts.domain.entity;

import com.vladmihalcea.hibernate.type.array.IntArrayType;
import com.vladmihalcea.hibernate.type.array.StringArrayType;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;
import com.vladmihalcea.hibernate.type.json.JsonNodeStringType;
import com.vladmihalcea.hibernate.type.json.JsonStringType;
import liquibase.pro.packaged.C;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;
import org.hibernate.annotations.Where;
import org.lamisplus.modules.base.domain.entities.Audit;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = false)
@Table(name = "hts_family_index")
@Where(clause = "archived = 0")
@TypeDefs({
        @TypeDef(name = "string-array", typeClass = StringArrayType.class),
        @TypeDef(name = "int-array", typeClass = IntArrayType.class),
        @TypeDef(name = "json", typeClass = JsonStringType.class),
        @TypeDef(name = "jsonb", typeClass = JsonBinaryType.class),
        @TypeDef(name = "jsonb-node", typeClass = JsonNodeBinaryType.class),
        @TypeDef(name = "json-node", typeClass = JsonNodeStringType.class),
})
public class FamilyIndex extends Audit implements Serializable  {

    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "uuid", updatable = false)
    private String uuid;

    @Basic
    @Column(name="archived")
    private int archived=0;

    @Basic
    @Column(name = "family_relationship")
    private String familyRelationship;
    @Basic
    @Column(name = "family_index_hiv_status")
    private String familyIndexHivStatus;

    @Basic
    @Column(name = "child_number")
    private int childNumber;
    @Basic
    @Column(name = "mother_dead")

    private String motherDead;

    @Basic
    @Column(name = "year_mother_dead")
    private LocalDate yearMotherDead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_index_testing_id", referencedColumnName = "id")
    private FamilyIndexTesting familyIndexTesting;

    @Basic
    @Column(name = "family_index_testing_uuid")
    private String familyIndexTestingUuid;

    @PrePersist
    public void setFields(){
        if(StringUtils.isEmpty(uuid)){
            uuid = UUID.randomUUID().toString();
        }
    }

}
