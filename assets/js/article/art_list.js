$(function () {
    var layer = layui.layer
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data);

        const y = padZero(dt.getFullYear());
        const m = padZero(dt.getMonth() + 1);
        const d = padZero(dt.getDate());

        const hh = padZero(dt.getHours());
        const mm = padZero(dt.getMinutes());
        const ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补零的函数
    function padZero(data) {
        return data > 9 ? data : '0' + data;
    }

    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: ''  //文章的发布状态
    }

    initArtList();
    initCate();
    function initArtList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //使用模板引擎渲染文章数据
                var htmlStr = template('tpl-art', res);
                $('tbody').html(htmlStr);
                layer.msg('获取文章列表成功！')
                renderPage(res.total);
            }
        })
    }

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        // console.log('131232');
        initArtList();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 可以通过first的值，来判断是通过哪种方式触发分jump回调
        // 触发jump回调的两种方式
        // 1.点击页码的时候，会触发
        // 2.只要调用了laypage.render()方法，就会触发jump回调
        // 如果first的值为true，证明是方式二触发的
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            curr: q.pagenum,
            limits: [2, 4, 8, 16],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // 把最新的页码值赋值到q这个查询参数中;
                q.pagesize = obj.limit;
                q.pagenum = obj.curr;
                if (!first) {
                    initArtList();
                }
            }
        });
    }

    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id');
        let len = $('.btn-delete').length
        layer.confirm('确定删除该文章吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }

                    layer.msg('删除文章成功')
                    if (len == 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initArtList();
                }
            })
            layer.close(index);
        });
    })
})