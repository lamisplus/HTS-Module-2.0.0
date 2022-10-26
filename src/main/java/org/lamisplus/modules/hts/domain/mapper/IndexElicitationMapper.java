//package org.lamisplus.modules.hts.domain.mapper;
//
//import org.lamisplus.modules.hts.domain.entity.IndexElicitation;
//import org.lamisplus.modules.hts.domain.dto.IndexElicitationDto;
//import org.mapstruct.*;
//
//import java.util.List;
//
//@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
//public interface IndexElicitationMapper {
//    IndexElicitation indexNotificationServicesElicitationDtoToIndexNotificationServicesElicitation(IndexElicitationDto indexElicitationDto);
//
//    List<IndexElicitationDto> indexNotificationServicesElicitationsToIndexNotificationServicesElicitationDtos(List<IndexElicitation> indexElicitation);
//
//
//    IndexElicitationDto indexNotificationServicesElicitationToIndexNotificationServicesElicitationDto(IndexElicitation indexElicitation);
//
//    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//    IndexElicitation updateIndexNotificationServicesElicitationFromIndexNotificationServicesElicitationDto(IndexElicitationDto indexElicitationDto, @MappingTarget IndexElicitation indexElicitation);
//}
