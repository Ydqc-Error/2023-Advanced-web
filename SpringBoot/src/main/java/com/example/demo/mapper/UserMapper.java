package com.example.demo.mapper;

import com.example.demo.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

import static javax.swing.DropMode.INSERT;

@Mapper
public interface UserMapper {
    @Select("SELECT * FROM `user`")
    List<User> findAll();

    @Insert("INSERT INTO user(username,password,email) VALUES (#{username},#{password},#{email})")

    int insert(User user);

    @Update("update user set username=#{username},password=#{password},email=#{email} where id =#{id}")
    int update(User user);
}
