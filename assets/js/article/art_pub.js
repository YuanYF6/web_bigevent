$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate();
    // 初始化富文本编辑器
    initEditor()

    // 初始化文章类别
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章类别失败')
                }

                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                //表单检测不到数据的变化  需要重新渲染
                form.render();
            }
        })
    }
    // 点击选择图片即点击了file文件选择框
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    $('#coverFile').on('change', function (e) {
        // 获取选择的文件
        var files = e.target.files
        if (files.length === 0) {
            return;
        }
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    var art_state = '已发布';
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 根据 form 表单创建 FormData 对象，会自动将表单数据填充到 FormData 对象中
        // FormData 对象的使用：
        // 1.用一些键值对来模拟一系列表单控件：即把form中所有表单元素的name与value组装成
        // 一个queryString
        var fd = new FormData($(this)[0]);
        // console.log(fd);
        fd.append('state', art_state)
        // fd.forEach((v, k) => {
        //     console.log(k, v);
        // })
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件加入fd
                fd.append('cover_img', blob);
                publisherArticle(fd);
            })
    })

    // 发布文章的方法，传入一个formData格式的数据
    function publisherArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,     // jQuery不要去处理发送的数据
            processData: false,     // jQuery不要去设置Content-Type请求头
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文字失败');
                }
                layer.msg('发布文章成功');
                // 发布成功后跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})