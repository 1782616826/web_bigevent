$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateLise()
    //获取文章初始的文章列表

    function initArtCateLise() {
        $.ajax({
            methot: 'get',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);

                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

            }
        })
    }
    //为添加按钮添加点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: $('#dialog-add').html()

        })
    })
    //通过事件代理的形式，为表单绑定事件

    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();// 阻止默认提交行为
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);

                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCateLise()
                layer.msg('新增分类成功')
                layer.close(indexAdd);
            }
        })
    })
    //通过事件代理的形式，为编辑按钮绑定事件
    var indexEdit = null;
    $('tbody').on('click', '#tn-edit', function () {
        //弹出修改框
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章类别',
            content: $('#dialog-edit').html()

        })
        var ids = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
          method: 'GET',
          url: '/my/article/cates/'+ids,
          success: function(res) {
            //   console.log(res);
              
            form.val('form-edit', res.data)

            }
        })

    })
    //为修改绑定事件
   // 通过代理的形式，为修改分类的表单绑定 submit 事件
   $('body').on('submit', '#form-edit', function(e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败！')
        }
        layer.msg('更新分类数据成功！')
        layer.close(indexEdit)
        initArtCateLise()
      }
    })
  })

  // 通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function() {
    var id = $(this).attr('data-id')
    // 提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
          layer.close(index)
          initArtCateLise()
        }
      })
    })
  })
})

