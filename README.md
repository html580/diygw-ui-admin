## 🌈 DIYGW-UI-PHP

DIYGW-UI-PHP 是一款基于 thinkphp framework 和 element admin 开发而成的前后端分离系统。目的是结合现有 diygw-ui 打造一个后台 API 开发。

#### 💒 代码仓库

- <a target="_blank" href="https://gitee.com/diygw/diygw-ui-php">基于 thinkphp6 实现的 DIYGW-UI-PHP</a>

#### 💒 集成前端

- <a href="https://gitee.com/diygw/diygw-ui-admin" target="_blank">https://gitee.com/diygw/diygw-ui-admin</a>

#### 💒 在线可视化集成教程

- <a target="_blank" href="https://www.bilibili.com/video/BV1CP411V7TV?spm_id_from=333.999.0.0&vd_source=dc541827a3c20d8e063187146f12aa57">在线视频教程</a>

## ⚡ 功能

- [x] `用户管理` 后台用户管理
- [x] `部门管理` 配置公司的部门结构，支持树形结构
- [x] `岗位管理` 配置后台用户的职务
- [x] `菜单管理` 配置系统菜单，按钮等等
- [x] `角色管理` 配置用户担当的角色，分配权限
- [x] `数据字典` 管理后台表结构
- [x] `操作日志` 后台用户操作记录
- [x] `登录日志` 后台系统用户的登录记录

## 🌈 DIYGW 可视化工具介绍

DIY 官网可视化工具做好的可视化拖拽开发工具无须编程、零代码基础、所见即所得设计工具支持轻松在线可视化导出微信小程序、支付宝小程序、头条小程序、H5、WebApp、UNIAPP 等源码 支持组件库,高颜值,卡片,列表,轮播图,导航栏,按钮,标签,表单,单选,复选,下拉选择,多层选择,级联选择,开关,时间轴,模态框,步骤条,头像,进度条等
丰富的按钮点击事件供选择、自定义方法调用、支持 API 在线调试、数据动态绑定、For 循环数据绑定、IF 判断绑定等

DIY 官网可视化工具打造低代码可视化一键生成导出源码工具设计一次打通设计师+产品经理+技术开发团队必备低代码可视化工具。从想法到原型到源码，一步到位低代码生成源码工具

更多设计前往https://www.diygw.com 设计

> 运行环境要求 PHP8+

### ⚡ 后台安装

使用宝塔新建网站指到 public 目录，新建完成后，浏览器输入域名即会提示安装。

### ⚡ 使用介绍

用户自定义表后，比如用户自定义的表 user，你只需要在命令行输入 php think diygw:table sys@User，会自动创建创建表相关 Model、Controller 等类。
其中 sys 表示应用目录，user 表示某个表。如果想看更多命令请输出 php think 可以查看更多快速创建类命令。

### ⚡ 部分截图

![DIYGW可视化UNIAPP代码生成器](https://libs.diygw.com/upload/1/php0.png)
![DIYGW可视化支持轻松在线可视化导出微信小程序代码](https://libs.diygw.com/upload/1/php1.png)
![DIYGW可视化支持轻松在线可视化导出支付宝小程序代码](https://libs.diygw.com/upload/1/php2.png)
![DIYGW可视化头条小程序代码生成器](https://libs.diygw.com/upload/1/php3.png)
![DIYGW可视化H5代码生成器](https://libs.diygw.com/upload/1/php4.png)
![DIYGW可视化Element Plus代码生成器](https://libs.diygw.com/upload/1/php5.png)

## ⚡ 发布网站

1、生成 diygw-ui-admin 项目的代码，执行命令前修改开发.env.production 下的域名配置为你的域名
yarn build
生成完成后 找到 dist 目录下所有文件拷贝到 diygw-ui-php 项目下面

2、宝塔创建网站 ---对应域名 域名解析至这个网站  
记住创建的数据库用户名密码

3、上传代码把我们开发的 PHP 代码上传进去并解压出来
网站目录：
防跨站攻击(open_basedir)把勾去掉
修改宝塔网站的根目录指向解压文件的 public 目录下/www/wwwroot/你的域名/diygw-ui-php/public/admin 目录下
伪静态设置：
设置为 thinkphp 伪静态
SSL 证书配置：
设置其他证书

4、修改数据库：
/www/wwwroot/你的域名/diygw-ui-php/.env 文件修改为正式环境的数据库用户名密码
先从本地导出数据，然后在宝塔上管理数据库导入数据库

5、访问 你的域名/index.html 输入用户名密码即可访问
