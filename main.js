//检查安卓版本
if(device.sdkInt < 24){
    alert("不支持的安卓版本" ,"仅支持Android 7.0及以上系统，root版已在开发中，可以在github上了解更多")
    exit()
}
//检查配置文件，执行初始化等操作
var storage = storages.create("JKhKDkDb")
if(!storage.contains('init')){
    alert('请注意' ,'在继续之前，请先确保已经给与悬浮窗权限并已经锁定后台以确保稳定运行')
    storage.put('init' ,0)
}
launch("com.net.zdsoft.netstudy.netstudy_v5_mobile_app")
toast("请稍等")
sleep(5000)//等待无限宝彻底启动
//检查无障碍服务是否启动
if(auto.service == null){
    alert("需要无障碍服务" ,"脚本运行需要无障碍服务，请选择“网课自动脚本”，开启无障碍服务，仅用于模拟点击，不用于其它用途，请放心使用")
    auto.waitFor()
    launch("com.net.zdsoft.netstudy.netstudy_v5_mobile_app")
}
//运行课后网app，通过包名启动
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
                    var b = id("rollcall_sliderblock_layout").findOne().bounds()
                    device.vibrate(1000)//振动提醒，一秒
                    swipe(b.centerX(), b.centerY(), b.centerX() + 1300, b.centerY(), 3750)//获取滑动组件位置，基于坐标滑动，时间3.75秒
                    toast('尝试签到完成')
                }
        }
    }
    sleep(2000)//死循环冷却
}
