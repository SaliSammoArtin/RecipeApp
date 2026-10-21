package com.example.receptapp.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class RegisterResponse {
    private UUID id;
    private String username;
}
