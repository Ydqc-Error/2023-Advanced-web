package com.example.lab3.controller;

import com.example.lab3.mybatis.SqlSessionLoader;
import com.example.lab3.mybatis.po.User;
import com.example.lab3.request.UserLoginRequest;
import com.example.lab3.request.UserRegisterRequest;
import com.example.lab3.response.ErrorResponse;
import com.example.lab3.response.UserListResponse;
import com.example.lab3.response.UserLoginResponse;
import com.example.lab3.response.UserRegisterResponse;
import org.apache.ibatis.session.SqlSession;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/user")
public class UserController {
    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public @ResponseBody Object register(@RequestBody UserRegisterRequest request)
            throws IOException {
        SqlSession sqlSession = SqlSessionLoader.getSqlSession();
        User user = (User) sqlSession.selectOne("com.example.lab3.UserMapper.findUserByUsername",
                request.getUsername());
        if (user != null) {
            sqlSession.close();
            return new ErrorResponse("The username is already used");
        } else {
            sqlSession.insert("com.example.lab3.UserMapper.addUser",
            new User(request.getUsername(), request.getPassword(),
                    request.getEmail(), request.getFigure()));
            sqlSession.commit();
            sqlSession.close();
            return new UserRegisterResponse("Register Successfully!");
        }
    }
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody Object login(@RequestBody UserLoginRequest request)
            throws IOException {
        SqlSession sqlSession = SqlSessionLoader.getSqlSession();
        User user = sqlSession.selectOne("com.example.lab3.UserMapper.findUserByUsername",
                request.getUsername());
        if (user != null) {
            if(Objects.equals(user.getPassword(), request.getPassword())){
                sqlSession.close();
                return new UserLoginResponse(true,"Login Successfully!", user.getFigure());
            }
            sqlSession.close();
            return new UserLoginResponse(false,"password is false");
        } else {
            sqlSession.close();
            return new UserLoginResponse(false,"no this username");


        }
    }
    @RequestMapping(value = "/userList", method = RequestMethod.POST)
    public @ResponseBody Object getUserList()
            throws IOException {
        SqlSession sqlSession = SqlSessionLoader.getSqlSession();
        List<User> users = sqlSession.selectList("com.example.lab3.UserMapper.findAll");
        System.out.println(users);
        UserListResponse userList=new UserListResponse();
        for (User user:users
             ) {
            userList.getUserList().add(user.getUsername());
        }
        return userList;
    }
}

