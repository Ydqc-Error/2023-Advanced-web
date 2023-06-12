package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.mapper.UserMapper;
import com.example.demo.service.UserService;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;
@RestController
@CrossOrigin
@RequestMapping("user")
public class UserController {
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserService userService;
    @GetMapping
    public List<User> index() {
        return userMapper.findAll();
    }
    @CrossOrigin
    @PostMapping("/register")
    public Integer register(@RequestBody User user) {
        return userService.register(user);
    }
    @CrossOrigin
    @PostMapping("/login")
    public Integer login(@RequestBody User user) {
       return userService.login(user);
    }
}
