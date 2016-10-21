package com.fispan.user;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user")
public class User implements Comparable<User>{
	private @Id  String id; //@GeneratedValue
	private String firstName;
	private String lastName;
	private Date dob;

	@SuppressWarnings("unused")
	private User() {}

	public User(String firstName, String lastName, Date dob) {
		this.setFirstName(firstName);
		this.setLastName(lastName);
		this.setDob(dob);
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public Date getDob() {
		return dob;
	}

	public void setDob(Date dob) {
		this.dob = dob;
	}

	@Override
	public int compareTo(User o) {
		String lastName = o.getLastName();
		if(lastName == null){
			lastName = "";
		}
		return lastName.compareTo(this.getLastName());
	}
	
	@Override
    public String toString() {
        return String.format(
                "User[id=%s, firstName='%s', lastName='%s']",
                id, firstName, lastName);
    }
}