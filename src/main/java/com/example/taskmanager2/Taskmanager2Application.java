package com.example.taskmanager2;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@OpenAPIDefinition
@SpringBootApplication
public class Taskmanager2Application {

	public static void main(String[] args) {
		SpringApplication.run(Taskmanager2Application.class, args);
	}

}
