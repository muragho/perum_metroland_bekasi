$(document).ready(function () {

    AOS.init({
        disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
        startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
        initClassName: 'animasi', // class applied after initialization
        animatedClassName: 'animasi', // class applied on animation
        useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
        disableMutationObserver: false, // disables automatic mutations' detections (advanced)
        debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
        throttleDelay: 99,
    });
    getPromo();
});

const BERANDA_URL = '/metroland/beranda/api/v1/promo'

function getPromo() {
    $.ajax({
        method: "GET",
        url: `${BERANDA_URL}`,
    })
        .done((response) => {
            if (response.code == 200) {

                $("#img-promotion").attr("src", "/metroland/assets/promo/" + response.data.image);
                $("#mdl_promosi").modal("show");
            }

        }).fail((error) => {
            console.log("ini error : " + error)
        });
}

$('#btn-kpr').click(function () {
    $("#mdl_kpr").modal("show");
})

$('#btn-hitung-kpr').click(function () {
    var properti = $('#inp_properti').val();
    var waktu = $('#inp_jangka_waktu').val();
    var bunga = $('#inp_bunga').val();

    if (properti != '' && waktu != '' && bunga != '') {
        var properti_ = parseInt(properti.replaceAll(',', ''));
        var hasil = (bunga * waktu) / 100;
        var total = (hasil + properti_)
        console.log(hasil + ' | ' + total)
    }

})

$(function () {
    $("#inp_properti").keyup(function (e) {
        this.value = this.value.replace(/\D/g, '');
        $(this).val(format($(this).val()));
    });
});
var format = function (num) {
    var str = num.toString().replace("", ""), parts = false, output = [], i = 1, formatted = null;
    if (str.indexOf(".") > 0) {
        parts = str.split(".");
        str = parts[0];
    }
    str = str.split("").reverse();
    for (var j = 0, len = str.length; j < len; j++) {
        if (str[j] != ",") {
            output.push(str[j]);
            if (i % 3 == 0 && j < (len - 1)) {
                output.push(",");
            }
            i++;
        }
    }
    formatted = output.reverse().join("");
    return ("" + formatted + ((parts) ? "." + parts[1].substr(0, 2) : ""));
};