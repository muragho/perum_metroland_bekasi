$(document).ready(function () {
    $("#menu_karir").addClass("active");
});

$('.pop').on('click', function () {

    var img = $(this).data('banner_image');
    console.log(img)

    $('.imagepreview').attr('src', '/metroland/assets/img_carrier/' + img);
    $('#imagemodal').modal('show');
});