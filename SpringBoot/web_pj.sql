/*
 Navicat Premium Data Transfer

 Source Server         : web
 Source Server Type    : MySQL
 Source Server Version : 80028 (8.0.28)
 Source Host           : localhost:3306
 Source Schema         : web_pj

 Target Server Type    : MySQL
 Target Server Version : 80028 (8.0.28)
 File Encoding         : 65001

 Date: 12/06/2023 15:26:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户名',
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '密码',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', '666666', 'a@163.com');
INSERT INTO `user` VALUES (16, 'a', 'a', 'a');
INSERT INTO `user` VALUES (17, 'a', 'aa', 'a');
INSERT INTO `user` VALUES (18, 'a', 'a', 'a');
INSERT INTO `user` VALUES (19, 'a', 'a', 'a');
INSERT INTO `user` VALUES (20, 'a', 'a', 'a');
INSERT INTO `user` VALUES (21, 'a', 'aa', 'a');
INSERT INTO `user` VALUES (22, 'a', 'aa', 'a');
INSERT INTO `user` VALUES (23, 'a', 'aa', 'a');

SET FOREIGN_KEY_CHECKS = 1;
