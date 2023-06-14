package com.example.lab3.mybatis.po;

import lombok.Data;

@Data
public class User {
    private int userID;
    private String username;
    private String password;
    private String email;
    private String figure;
    public User(int userID, String username, String password, String email, String model) {
        this.userID = userID;
        this.username = username;
        this.password = password;
        this.email = email;
        this.figure =model;
    }
    public User(String username, String password, String email, String figure) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.figure = figure;
    }
}
