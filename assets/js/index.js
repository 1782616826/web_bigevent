$(function () {
    getUserInfo() //调用函数获取基本信息
    var layer = layui.layer;
    $('#btn').on('click', function () {
        //提示用户是否退出
        layer.confirm('确认退出登录吗?', { icon: 3, title: '提示' }, function (index) {
            //清空本地token
            localStorage.removeItem('token');
            //跳转回登录页
            location.href = 'login.html'
            //关闭confirm 询问框
            layer.close(index)
        });

    })
})
//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: 'http://api-breakingnews-web.itheima.net/my/userinfo',
        //headers 就是请求配置对象
        headers: {
            Authorization: localStorage.getItem('token') || '',
        },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //渲染用户头像
            randerAvater(res.data);
        },
        //无论成功失败都回调complete
        complete: function (res) {
            // console.log('执行了 compltte');
            console.log(res);
            //在copmlete 可以使用responseJSON  拿到相应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //清空token
                localStorage.removeItem('token');
                //强制返回登录页面
                location.href = "login.html"
        }}
    })
}
//渲染用户头像
function randerAvater(user) {
    //获取用户名
    var name = user.nickname || user.username;
    //渲染名字
    console.log(123);

    $('#welcone').html('欢迎&nbsp;&nbsp;' + name)
    //按需渲染用户头像
    if (user.user_pic !== null) {
        //如果有头像就显示
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 没有头像  就显示字符头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
}