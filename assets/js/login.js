$(function () {
    $('#login-a').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide();
    })
    $('#reg-a').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show();
    })

    var form = layui.form;
    var layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var val = $('.reg-box [name=password]').val();
            if (value !== val) {
                return '两次密码不一致！请重新输入'
            }
        }
    })

    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        var data = { username: $('.reg-box [name=username]').val(), password: $('.reg-box [name=password]').val() }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                // console.log(res.message);
                return layer.msg(res.message);
            }
            layer.msg('注册成功！请登录')
            $('#login-a').click();
        })

    })

    $('#form_login').submit(function (e) {
        e.preventDefault();
        var data = { username: $('.login-box [name=username]').val(), password: $('.login-box [name=password]').val() }
        $.post('/api/login', data, function (res) {
            if (res.status !== 0) {
                // return console.log(res.message);
                return layer.msg('登录失败！')
            }
            // console.log(res);
            layer.msg('登录成功！');
            localStorage.setItem('token', res.token);
            location.href = '/index.html';
        })
    })
})