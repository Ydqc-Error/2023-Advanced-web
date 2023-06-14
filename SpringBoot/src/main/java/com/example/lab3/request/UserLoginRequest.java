package com.example.lab3.request;

import lombok.Data;

@Data
public class UserLoginRequest {
    private String username;
    private String password;
    private String model;
}
