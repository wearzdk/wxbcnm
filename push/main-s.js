//检查配置文件，执行初始化等操作
var storage = storages.create("JKhKDkDb")
if(!storage.contains('init')){
    alert('请注意' ,'在继续之前，请先确保已经给与悬浮窗权限并已经锁定后台以确保稳定运行')
    storage.put('init' ,0)
}
var url = "http://wxb.webruix.cn/api.php"
var res = http.post(url,{"action":"getKey"})
var html = res.body.json()
if(html['state'] == 'ok'){
    alert('您的key','请记下您的key：' + html['key'])
}else{
    alert('错误',html['reason'])
}
launch("com.net.zdsoft.netstudy.netstudy_v5_mobile_app")
sleep(5000)
//检查无障碍服务是否启动
if(auto.service == null){
    alert("需要无障碍服务" ,"脚本运行需要无障碍服务，请选择“网课自动脚本”，开启无障碍服务，仅用于模拟点击，不用于其它用途，请放心使用")
    auto.waitFor()
    launch("com.net.zdsoft.netstudy.netstudy_v5_mobile_app")
}
//运行课后网app，通过包名启动
sleep(2000)
toast("脚本启动")
launch("com.net.zdsoft.netstudy.netstudy_v5_mobile_app")
launchApp("课后网")
for(;;){
    //判断界面是否为主界面
    if(currentActivity() == "net.zdsoft.netstudy.PhoneCenterActivity"){
        if(id("big_ll1").exists()){
            id("big_ll1").findOne(2000).click()
        }
    }
    //判断界面是否为课程界面
    if(currentActivity() == "net.zdsoft.netstudy.phone.business.famous.course.ui.activity.CourseActivity"){
        if(text("进入课堂").exists()){
            text("进入课堂").findOne(2000).click()
        }
    }
    // 判断界面是否为课堂界面
    if(currentActivity() == "vizpower.imeeting.MainActivity"){
        toast("准备自动签到")
        if(id("button_intofullscreen").exists()){
            id("button_intofullscreen").findOne(2000).click()
        }
        for(;;){
            if(currentActivity() !="vizpower.imeeting.MainActivity"){break;}//离开课堂界面跳出循环
                if(id("rollcall_sliderblock_layout").exists()){
                    var res = http.post(url,{'action':'subtime','key':html['key']})
                    var sut = res.body.json()
                    log(sut)
                    if(sut['state'] == 'ok'){
                        toast('请求发送成功')
                        sleep(500)
                    }else{
                        alert('错误',sut['reason'])
                    }
                }
        }
    }
    sleep(2000)//死循环冷却
} 