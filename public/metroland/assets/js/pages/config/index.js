var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

KTUtil.onDOMContentLoaded(function () {
    $("#menu_configure").addClass("active");
});
const CONFIG_API_URL = '/auth/api/v1/configs'
const btnPromotion = document.getElementById('btn-promotion');
const mdlBtnSavePromotion = document.getElementById('mdl-btn-save-promotion');
const mdlBtnCanclePromotion = document.getElementById('mdl-btn-cancle-promotion');
const btnSaveAbout = document.getElementById("btn-save-about");

var myEditorEdit;
ClassicEditor
    .create(document.querySelector('#mdl_edit_content_about'), {
        ckfinder: {
            uploadUrl: `/auth/about/upload`,
        }
    })
    .then(editor => {
        myEditorEdit = editor;
    })
    .catch(error => {
        console.error(error);
    });

btnSaveAbout.addEventListener("click", function (e) {
    e.preventDefault();

    const id = $('#about_id').val() == '' ? 0 : $('#about_id').val();
    const description = myEditorEdit.getData();
    console.log(id)
    var formData = new FormData();
    formData.append('description', description);

    $.ajax({
        method: "PUT",
        url: `${CONFIG_API_URL}/about/${id}`,
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {
            if (response.code == 200) {

                showSuccessAlert(`Data berhasil diubah`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
})

btnPromotion.addEventListener("click", function (e) {
    e.preventDefault();

    $("#promotion").css("background-image", "url()");

    var id = $(this).data('promition_id');
    var startDate = $(this).data('start_date');
    var duration = $(this).data('duration');
    var image = $(this).data('image');
    var title = $(this).data('title');

    $('#mdl_promotion_id').val(id);
    $('#mdl-title-promotion').val(title)

    if (image != '' || image != null) {
        $("#promotion").css("background-image", "url(/metroland/assets/promo/" + image + ")");
    }

    var strDate = new Date(startDate);
    var endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);

    $("#start_date").daterangepicker({
        startDate: strDate,
        endDate: endDate,
        locale: {
            format: "DD-MM-YYYY"
        }
    });

    $('#mdl-show-promotion').modal("show");
});

mdlBtnCanclePromotion.addEventListener("click", function (e) {
    e.preventDefault();
    $('#mdl-show-promotion').modal('toggle');
    location.reload();
})

$("#start_date").daterangepicker({
    singleDatePicker: true,
    locale: {
        format: "DD-MM-YYYY"
    }
});

mdlBtnSavePromotion.addEventListener("click", function (e) {
    e.preventDefault();

    doEdit();
})

function doEdit() {

    let id = $('#mdl_promotion_id').val();
    let title = $('#mdl-title-promotion').val();
    let start = $('#start_date').data('daterangepicker').startDate;
    let end = $('#start_date').data('daterangepicker').endDate;

    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((end - start) / oneDay));

    var img = $('#banner_promotion').prop('files')[0];

    var formData = new FormData();
    formData.append('title', title);
    formData.append('start', start.format('YYYY-MM-DD'));
    formData.append('duration', diffDays);
    formData.append('image', img);

    $.ajax({
        method: "PUT",
        url: `${CONFIG_API_URL}/${id}`,
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {
            if (response.code == 200) {
                mdlBtnCanclePromotion.innerHTML = "Tutup";
                showSuccessAlert(`data berhasil diubah`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });

}