package com.example.lab3.response;

import lombok.Data;

@Data
public class UserLoginResponse {
    private final String message;
    private final boolean state;
    private final String figure;
    public UserLoginResponse(boolean state, String message, String figure){
        this.message=message;
        this.state=state;
        this.figure = figure;
    }
    public UserLoginResponse(boolean state, String message){
        this.message=message;
        this.state=state;
        this.figure = "";
    }

}
