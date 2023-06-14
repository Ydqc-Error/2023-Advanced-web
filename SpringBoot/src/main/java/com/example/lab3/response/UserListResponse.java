package com.example.lab3.response;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserListResponse {
    List<String> userList=new ArrayList<>();
}
