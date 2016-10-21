package com.fispan.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

	@SuppressWarnings("unused")
	private final UserRepository repository;

	@Autowired
	public DatabaseLoader(UserRepository repository) {
		this.repository = repository;
	}

	@Override
	public void run(String... strings) throws Exception {
		/*this.repository.save(new User("John", "Do", new Date()));
		this.repository.save(new User("John", "Smith", new Date()));
		this.repository.save(new User("Sister", "Do", new Date()));
		
		// fetch all customers
		System.out.println("Users found with findAll():");
		System.out.println("-------------------------------");
		for (User user : repository.findAll()) {
			System.out.println(user);
		}*/
	}
}
