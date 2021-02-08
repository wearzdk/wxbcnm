<?php

// 创建连接
function conn()
{
    // 数据库配置，连接
    $servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "123";
    // 创建连接
    $conn = new mysqli($servername, $username, $password, $dbname);
    // 检测连接
    if ($conn->connect_error) {
        die("连接失败: " . $conn->connect_error);
    } 
    return $conn;
}

// 错误输出方法
function error($reason){
    $put = array('state' => 'error', 'reason' => $reason);
    echo json_encode($put);
}
// 创建及验证密钥方法
function cheakKey($ips){
    $sql = "SELECT connkey, createtime FROM Keys_token WHERE ip = '$ips'";
    $result = conn()->query($sql);
    $times = time();
    $connkey = '';
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $connkey = $row['connkey'];
        }
        return $connkey;// 存在密钥，返回密钥
    }else{
        $connkey = (string)time() + (string)rand(8,20);// 不存在密钥，创建密钥
        $temp = time();
        $sql = "INSERT INTO Keys_token (connkey, createtime, ip, newtime) VALUES ($connkey, $temp, '$ips', 0)";
        echo $sql;
        echo conn()->query($sql);
        return $connkey;
    }
}
// 时间提交方法
function subTime($keys,$ip)
{
    // 校验密钥（其实应该单独写一个方法，但是懒得写了）
    $sql = "SELECT * FROM Keys_token WHERE connkey = $keys";
    $result = conn()->query($sql);
    $t = 0;
    $ips = '';
    while($row = $result->fetch_assoc()) {
        $t = $t + 1;
        $ips = $row['ip'];
    }
    if($ip == $ips){
        // 提交时间
        $temp = time();
        $sql = "UPDATE Keys_token SET newtime = $temp WHERE connkey = $keys";
        conn()->query($sql);
        $put = array('state' => 'ok');
        echo json_encode($put);
    }else {
        error('错误！key校验出错！');
    }
}

// 全局基础信息
$ip = $_SERVER['REMOTE_ADDR'];// 获取操作者ip信息
$method = $_SERVER['REQUEST_METHOD'];// 获取请求方式
if ($method == 'POST') {
    $action = $_POST['action'];
    // 判断操作指令
    if ($action == 'getKey') {
        $key = cheakKey($ip);
        $put = array('key' => $key, 'state' => 'ok');
        echo json_encode($put);
    }elseif($action == 'subtime'){
        if (isset($_POST['key'])) {
            subTime($_POST['key'],$ip);
        }else {
            error('必要参数丢失，需要key');
        }
    }else {
        error('未知操作');
    }
}elseif($method == 'GET'){
    if(isset($_GET['key'])){
        $key = $_GET['key'];
        $sql = "SELECT * FROM Keys_token WHERE connkey = $key";
        $result = conn()->query($sql);
        $t = 0;
        $ips = '';
        while($row = $result->fetch_assoc()) {
            $t = $t + 1;
            $ips = $row['ip'];
        }
        if($ip == $ips){
            // 获取储存的时间并比较
            $sql = "SELECT newtime FROM Keys_token WHERE connkey = $key";
            $result = conn()->query($sql);
            $nowtime = 0;
            while($row = $result->fetch_assoc()) {
                $newtime = $row['newtime'];
            }
            if(time() - (int)$newtime <= 20){
                $put = array('state' => 'ok','istime' => 'y');
                echo json_encode($put);
            }else {
                $put = array('state' => 'ok','istime' => 'n');
                echo json_encode($put);
            }
        }else {
            error('错误！key校验出错！');
        }
    }else {
        error('错误！必要参数丢失，需要key');
    }
}else {
    error('错误！非法请求方式！');
}

conn()->close();// 关闭数据库连接
?>