//每次调用$.get()  $.post()  $.ajax() 的时候，
// 会先调用这个函数
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    options.url = "http://api-breakingnews-web.itheima.net" + options.url;
    console.log(options.url);
})