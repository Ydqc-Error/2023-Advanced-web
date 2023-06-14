package com.example.lab3.response;

public class UserRegisterResponse{
    private final String message;
    public UserRegisterResponse(String message) {
        this.message = message;
    }
    public String getMessage() {
        return message;
    }
}
