//package org.lamisplus.modules.hts.domain.mapper;
//
//import org.lamisplus.modules.hts.domain.dto.HtsClientDto;
//import org.lamisplus.modules.hts.domain.dto.HtsClientRequestDto;
//import org.lamisplus.modules.hts.domain.entity.HtsClient;
//import org.lamisplus.modules.patient.domain.Patient;
//import org.mapstruct.*;
//
//@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
//public interface HtsClientMapper {
//    HtsClient htsClientRequestDtoToHtsClient(HtsClientRequestDto htsClientRequestDto);
//
//    HtsClientRequestDto htsClientToHtsClientRequestDto(HtsClient htsClient);
//    HtsClientDto htsClientToHtsClientDto(HtsClient htsClient);
//
//
//    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//    HtsClient updateHtsClientFromHtsClientRequestDto(HtsClientRequestDto htsClientRequestDto, @MappingTarget HtsClient htsClient);
//}
