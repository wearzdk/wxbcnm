import os
import requests
import urllib.request
import playsound
import time

key = input('请输入key')
# 联网下载音效文件
if ~os.path.exists(os.getcwd() + '\\t.wav'):
    print('正在下载音效文件')
    urllib.request.urlretrieve('http://wxb.webruix.cn/t.wav', os.getcwd() + '\\t.wav')
url = 'http://wxb.webruix.cn/api.php?key=' + key
path = os.getcwd() + '\\t.wav'
count = 0
# 死循环
while 1 == 1:
    time.sleep(0.5)
    r = requests.get(url)
    html = r.json()
    if html['state'] == 'ok':
        print(time.strftime("%H:%M:%S", time.localtime()), '正在监听')
        if html['istime'] == 'y':
            playsound.playsound(path)
            print('签到时间！！！')
            count = count + 1

    else:
        print(time.strftime("%H:%M:%S", time.localtime()), html['reason'])
