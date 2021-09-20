$(function(){
    var layer = layui.layer
      // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

//   为上传文件添加点击事件
$('#btnChoose').on('click',function(){
$('#file').click();
})
//文件绑定change事件
$('#file').on('change',function(e){
    var filelist =e.target.files
    if(filelist.lenth ===0){
        return layer.msg('请选择照片');
    } 
    // 拿到用户文件
    var file = e.target.files[0];
    // 将文件转换为路径
    var imgURL = URL.createObjectURL(file)
    // 重新初始化为裁剪区域
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', imgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
    
})
$('#btnUpload').on('click',function(){
  //要拿到用户裁剪之后的头像，
  var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
  // 调用接口长传服务器
  $.ajax({
    mothod:'POST',
    url:'http://api-breakingnews-web.itheima.net/my/update/avatar',
    headers: {
      Authorization: localStorage.getItem('token') || '',
  },
  data:{
    avater:dataURL},
  success:function(res){
    if(res.status !== 0){
     return layer.msg('更改失败')
    }
    layer.msg('更新成功')
    window.parent.getUserInfo();
  }
  })
})
})