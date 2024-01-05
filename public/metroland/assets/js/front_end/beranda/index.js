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

const BERANDA_URL = '/beranda/api/v1'

function getPromo() {
    $.ajax({
        method: "GET",
        url: `${BERANDA_URL}/promo`,
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

const formKPR = document.getElementById('mdl-form-kpr');
// var validator = FormValidation.formValidation(
//     formKPR,
//     {
//         fields: {
//             inp_properti: {
//                 validators: {
//                     notEmpty: {
//                         message: 'Parameter wajib diisi'
//                     }
//                 }
//             },
//             inp_jangka_waktu: {
//                 validators: {
//                     notEmpty: {
//                         message: 'Parameter wajib diisi'
//                     },
//                     integer: {
//                         message: 'Bilangan bulat'
//                     },
//                     between: {
//                         min: 1,
//                         max: 25,
//                         message: ' nilai min 1 th, nilai max 25 th'
//                     }
//                 }
//             },
//             inp_bunga: {
//                 validators: {
//                     notEmpty: {
//                         message: 'Parameter wajib diisi'
//                     },
//                     numeric: {
//                         message: 'Input berupa angka'
//                     }
//                 }
//             }
//         },

//         plugins: {
//             trigger: new FormValidation.plugins.Trigger(),
//             bootstrap: new FormValidation.plugins.Bootstrap5({
//                 rowSelector: '.fv-row',
//                 eleInvalidClass: '',
//                 eleValidClass: ''
//             })
//         }
//     }
// );

$('#btn-hitung-kpr').click(function () {
    // if (validator) {
    //     validator.validate().then(function (status) {

    //         if (status == 'Valid') {
    //             doCalculateKPR();
    //         }
    //     })
    // }
    doCalculateKPR();

});

function doCalculateKPR() {
    var tenor = $('#inp_jangka_waktu').val();
    var bunga = $('#inp_bunga').val();
    var properti = $('#inp_properti').val().replaceAll(',', '');

    let data = {};
    data.tenor = tenor;
    data.bunga = bunga;
    data.properti = parseInt(properti);

    $.ajax({
        method: "POST",
        url: `${BERANDA_URL}/kpr`,
        data: data
    })
        .done((response) => {
            if (response.code == 200) {

                var total = response.data.angsuran;
                var totalFinal = setToCurrancy(total);
                $('#total-angsuran-kpr').html(totalFinal)

            }

        }).fail((error) => {
            console.log("ini error : " + error)
        });
}

function setToCurrancy(value) {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    });

    return formatter.format(value);
}