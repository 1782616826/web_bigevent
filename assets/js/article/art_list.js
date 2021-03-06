$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage;

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }

  initTable()
  initCate()
  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        console.log(res);

        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 使用模板引擎渲染页面的数据
        layer.msg('获取成功')
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }
  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类失败');
        }
        //调用模板引擎渲染分类可选项
        var htmlStr = template('tpl-cate', res)
        $('[name =cate_id]').html(htmlStr)
        //通知layui重新渲染表单区域
        form.render()
      }

    })
  }
  //筛选表单 绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    //获取表单中获取的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name= state]').val()
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件重新筛选
    initTable()
  })
  //定义 渲染分页的方法
  function renderPage(a) {
    //调用layui方法对象
    laypage.render({
      elem: "pageBox", //分页id
      count: a, //总数据条数
      limit: q.pagesize,//每页显示条数
      curr: q.pagenum, //默认选中的分页
      layout:['count','limit','prev','page','next','skip'],
      limits:[2,4,6,8,10],
      //分页发生切换的时候触发jump回调
      //触发jump函数  1点击页码 
      //             2.只要调用了laypage.render 就会触发
      jump: function (obj,first) {
        // 可以通过判断first 来判断是那种回调 触发jump回调
        // 如果first 为ture 证明是第二种回调
        // 否则就是方式1触发
        // console.log(first);
        
        console.log(obj.curr);
        q.pagenum =obj.curr
        // 把最新的条目数赋值到q pagesize上
        q.pagesize = obj.linit;
        //根据最新的q获取 数据列表
    
        if(!first){
              initTable();
        }
      }
    })
  }
  //通过代理的方法来 为删除按钮绑定点击事件
  $('tbody').on('click','.btn-delete',function(){
    //获取删除按钮的个数
    var len = $('.btn-delete').length
    //获取文章id
    var id =$(this).attr('data-id')
   //询问用户是否删除
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
    $.ajax({
      method:'GET',
      url: '/my/article/delete/' + id,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('删除文章失败！')
        }
        layer.msg('删除文章成功')
        //当数据删除完成后 要判断当前页是否还有数据
        //如果当前页没有数据了，则让页面减1 之后
        //再调用initTable方法
if(len ===1){
  //如果页面上的删除个数等于1  证明删除完成后页面上就没有数据了
  //页码值 最小为1
q.pagenum= q.pagenum ===1 ? 1:q.pagenum-1
}
        initTable();
      }
    })
      
      layer.close(index);
    });
  })
})