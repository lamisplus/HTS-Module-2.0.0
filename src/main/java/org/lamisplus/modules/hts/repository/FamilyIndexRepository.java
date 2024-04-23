package org.lamisplus.modules.hts.repository;

import io.vavr.collection.Traversable;
import org.lamisplus.modules.hts.domain.entity.FamilyIndex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FamilyIndexRepository extends JpaRepository<FamilyIndex, Long> {
    Optional<FamilyIndex> findByIdAndArchived(Long id, int unArchived);

    @Query(value = "SELECT * FROM hts_family_index fi " +
            "JOIN hts_family_index_testing c ON c.uuid = fi.family_index_testing_uuid " +
            "WHERE fi.family_index_testing_uuid = :uuid AND fi.archived = :unArchived", nativeQuery = true)
    List<FamilyIndex> findByFamilyIndexTestingUuid(@Param("uuid") String uuid, @Param("unArchived") int unArchived);

    List<FamilyIndex> findByFamilyIndexTestingUuid(Long id);

   Optional <FamilyIndex> findByUuid(String uuid);
}
