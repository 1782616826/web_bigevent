$(function(){
// 点击去注册账号
$('#link_reg').on('click',function(){
    $('.login-box').hide();
    $('.reg-box').show();
});

$('#link_login').on('click',function(){
    $('.login-box').show();
    $('.reg-box').hide();
});
var form = layui.form;
var layer = layui.layer
form.verify({
     
 //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
 pwd: [
   /^[\S]{6,12}$/
   ,'密码必须6到12位，且不能出现空格'
 ] ,
 repwd:function(value){
//通过行参 是确认密码框的内容
// 还有拿到密码矿中
// 进行一次判断
 var pwd =$('.reg-box [name=password]').val()
if(pwd !== value){
    return '两次密码不一样！'
}
 }
})
// 监听注册表单的提交
$('#form_reg').on('submit', function(e){
    e.preventDefault() //阻止默认提交
    console.log(123);
    var data ={username: $('#form_reg [name=username]').val(),
    password: $('#form_reg [name=password]').val()}
    $.post('http://api-breakingnews-web.itheima.net/api/reguser',data,function(res){
        console.log(res);
        
        if(res.status !== 0){
            return layer.msg(res.message)
            
        }
        layer.msg('注册成功，请登录')
        $('#link_login').click()
        
    })
});
//监听登录表单
 // 监听登录表单的提交事件
 $('#form_login').submit(function(e) {
    // 阻止默认提交行为
    e.preventDefault()
    $.ajax({
      url: 'http://api-breakingnews-web.itheima.net/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登录成功！')
        // 将登录成功得到的 token 字符串，保存到 localStorage 中
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = '/index.html'
      }
    })
  })
})
