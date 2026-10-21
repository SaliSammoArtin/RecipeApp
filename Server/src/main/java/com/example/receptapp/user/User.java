package com.example.receptapp.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

@Entity(name = "users")
@NoArgsConstructor
@Getter
@Setter
public class User {

        @Id
        @GeneratedValue
        private UUID id;

        @Column(nullable = false, unique = true)
        private String username;

        @Column(nullable = false)
        private String passwordHash;
    }