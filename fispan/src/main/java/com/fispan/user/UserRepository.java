package com.fispan.user;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

public interface UserRepository extends MongoRepository<User, Long>{ 
	@Query("{$and: [ {$or : [ { $where: '?0 == null' } , { firstName : ?0 }]}, "
			+ "{$or : [ { $where: '?1 == null' } , { lastName : ?1 }]}, "
			+ "{$or : [ { $where: '?2 == null' } , { dob : ?2 }]} "
			+ "] }")
	List<User> findByFirstNameAndLastNameAndDobAllIgnoreCase(@Param("firstName") String firstName, 
														@Param("lastName") String lastName,
														@DateTimeFormat(iso=ISO.DATE)@Param("dob") Date dob);
}
