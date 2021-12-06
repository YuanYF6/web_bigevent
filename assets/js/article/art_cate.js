$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();



    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('请求文章列表失败！');
                }
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexadd = null;
    $('#btnaddCate').on('click', function () {
        indexadd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        })
    })

    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章失败！')
                }
                initArtCateList();
                layer.msg('添加文章成功！');
                layer.close(indexadd);
            }
        })

    })
    //修改文章,第一步，获取文章原来的数据
    var indexedit = null;
    $('tbody').on('click', '#btnEdit', function () {
        indexedit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新文章失败！')
                }

                layer.msg('更新文章成功！');
                initArtCateList();
                layer.close(indexedit);
            }
        })
    })
    // 删除文章
    $('tbody').on('click', '#btn-del', function (e) {
        var delid = $(this).attr('data-id');
        // console.log(delid);
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + delid,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功');
                    initArtCateList();
                    layer.close(index)
                }
            })
        })

    })
})