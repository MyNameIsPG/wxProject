//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                            /*
                            * 小程序自带的登录
                            */
                            wx.login({
                                success: res => {
                                    //返回code
                                    var code = res
                                    console.log(code)
                                    /*
                                    * 小程序微信授权登陆
                                    */
                                    wx.request({
                                        url: this.globalData.path + 'xcxlogin/login.do', //仅为示例，并非真实的接口地址
                                        method: 'POST',
                                        dataType: 'json',
                                        data: {
                                            code: code.code,
                                            nickName: this.globalData.userInfo.nickName,
                                            gender: this.globalData.userInfo.gender,
                                            avatarUrl: this.globalData.userInfo.avatarUrl,
                                        },
                                        header: {
                                            //'content-type': 'application/json' // 默认值
                                            //'Content-Type': 'application/json; charset=utf-8'
                                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                        },
                                        success: function (res) {
                                            if(res.data.status==200){
                                                var app = getApp();
                                                app.globalData.globalUserId = res.data.data.user_id
                                                app.globalData.globalRole = res.data.data.role
                                                app.globalData.globalIsAuthentication = res.data.data.is_authentication
                                            }else {
                                                wx.showModal({
                                                    title: '温馨提示',
                                                    content: res.data.msg,
                                                    success: function (res) {
                                                        if (res.confirm) {
                                                            console.log('用户点击确定')
                                                        } else {
                                                            console.log('用户点击取消')
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: null,
        path: 'http://47.106.163.198:8081/wxbacksys/',
        globalRole: '',
        globalUserId: '',
        globalIsAuthentication: '',
    }
})


/*
  "pages/index/index",  首页
  "pages/list/list",     首页列表详情
  "pages/user/user",    管理中心
  "pages/MyVolunteer/MyVolunteer",   我的志愿队
  "pages/MyEvaluate/MyEvaluate",     我的志愿队评价
  "pages/MyActivity/MyActivity"      我参与的活动
  "pages/MyNews/MyNews", 我的消息
*/