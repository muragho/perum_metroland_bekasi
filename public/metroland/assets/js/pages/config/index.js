var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

KTUtil.onDOMContentLoaded(function () {
    $("#menu_configure").addClass("active");
});
const CONFIG_API_URL = '/auth/api/v1/configs'
const btnPromotion = document.getElementById('btn-promotion');
const mdlBtnSavePromotion = document.getElementById('mdl-btn-save-promotion');
const mdlBtnCanclePromotion = document.getElementById('mdl-btn-cancle-promotion');
const btnSaveAbout = document.getElementById("btn-save-about");
const btnEditAksesIcon = document.getElementsByClassName("btn-edit-akses-icon");
const mdlBtnEditAksesIcon = document.getElementById("mdl-btn-edit-akses-icon");
const btnShowMdlAddAksesIcon = document.getElementById("btn-show-mdl-add-akses-icon");
const formMdlAddAksesIcon = document.getElementById("mdl-form-add-akses-icon");
const mdlBtnAddAksesIcon = document.getElementById("mdl-btn-add-akses-icon");
const btnCloseModal = document.getElementsByClassName("btn-close-modal");
const btnDeleteAksesIcon = document.getElementsByClassName("btn-delete-akses-icon");
const btnShowMdlAddFacilityIcon = document.getElementById("btn-show-mdl-add-facility-icon");
const mdlBtnAddFacilityIcon = document.getElementById("mdl-btn-add-facility-icon");
const mdlFormAddFacilityIcon = document.getElementById("mdl-form-add-facility-icon");
const mdlAddBtnCancleFacilityIcon = document.getElementById("mdl-add-btn-cancle-facility-icon");
const btnDeleteFasilityIcon = document.getElementsByClassName("btn-delete-fasility-icon");
const btnEditFacilityIcon = document.getElementsByClassName("btn-edit-facility-icon");
const mdlBtnEditFacilityIcon = document.getElementById("mdl-btn-edit-facility-icon");

var validator = FormValidation.formValidation(
    formMdlAddAksesIcon,
    {
        fields: {
            mdl_akses_icon_type: {
                validators: {
                    notEmpty: {
                        message: 'Parameter wajib diisi'
                    }
                }
            },
            
        },

        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5({
                rowSelector: '.fv-row',
                eleInvalidClass: '',
                eleValidClass: ''
            })
        }
    }
);

var validatorFacility = FormValidation.formValidation(
    mdlFormAddFacilityIcon,
    {
        fields: {
            mdl_facility_name: {
                validators: {
                    notEmpty: {
                        message: 'Parameter wajib diisi'
                    }
                }
            },
            
        },

        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5({
                rowSelector: '.fv-row',
                eleInvalidClass: '',
                eleValidClass: ''
            })
        }
    }
);

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

function formEditAksesIcon(){
    const akses_icon_id = $(this).data("akses_icon_id");
    const image = $(this).data("akses_icon");
    const akses_icon_type = $(this).data("akses_icon_type");


    $('#mdl_akses_icon_id').val(akses_icon_id);
    $('#mdl-akses-icon-type').val(akses_icon_type)

    if (image != '' || image != null) {
        $("#akses-icon").css("background-image", "url(/metroland/assets/img/" + image + ")");
    }

    $('#mdl-show-edit-akses-icon').modal("show");
}

function formEditFacilityIcon(){
    const facility_icon_id = $(this).data("facility_icon_id");
    const image = $(this).data("facility_image");
    const facility_name = $(this).data("facility_name");

    console.log("name ",facility_name)

    $('#mdl_edit_facility_icon_id').val(facility_icon_id);
    $('#mdl_edit_facility_name').val(facility_name)

    if (image != '' || image != null) {
        $("#edit-facility-icon").css("background-image", "url(/metroland/assets/img/" + image + ")");
    }

    $('#mdl-show-edit-facility-icon').modal("show");
}

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
});

btnShowMdlAddAksesIcon.addEventListener("click",function(e){
    e.preventDefault();
    $('#mdl-show-add-akses-icon').modal("show");
});

btnShowMdlAddFacilityIcon.addEventListener("click",function(e){
    e.preventDefault();

    $('#mdl-show-add-facility-icon').modal("show");
})

for (const element of btnEditAksesIcon) {
    element.addEventListener("click", formEditAksesIcon);
}

for (const element of btnEditFacilityIcon) {
    element.addEventListener("click", formEditFacilityIcon);
}


$("#start_date").daterangepicker({
    singleDatePicker: true,
    locale: {
        format: "DD-MM-YYYY"
    }
});

mdlBtnSavePromotion.addEventListener("click", function (e) {
    e.preventDefault();
    doEdit();
});

mdlBtnEditAksesIcon.addEventListener("click",function(e){
    e.preventDefault();

    doEditAksesIcon();
});

mdlBtnEditFacilityIcon.addEventListener("click",function(e){
    e.preventDefault();

    doEditFasilityIcon();
});



mdlBtnAddAksesIcon.addEventListener("click",function(e){
    e.preventDefault();

    if (validator) {
        validator.validate().then(function (status) {

            if (status == 'Valid') {
                doAddAksesIcon();
            }
        })
    }
})

mdlBtnAddFacilityIcon.addEventListener("click",function(e){
    e.preventDefault();

    if (validatorFacility) {
        validatorFacility.validate().then(function (status) {

            if (status == 'Valid') {
                doAddFacilityIcon();
            }
        })
    }
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

function doEditAksesIcon(){
    let id = $('#mdl_akses_icon_id').val();
    let type = $('#mdl-akses-icon-type').val();
    var img = $('#banner_akses_icon').prop('files')[0];

    var formData = new FormData();
    formData.append('type', type);
    formData.append('image', img);

    $.ajax({
        method: "PUT",
        url: `${CONFIG_API_URL}/akses-icon/${id}`,
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
                document.getElementById("mdl-btn-cancle-akses-icon").innerHTML = "Tutup";
                showSuccessAlert(`data berhasil diubah`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
}

function doEditFasilityIcon(){
    let id = $('#mdl_edit_facility_icon_id').val();
    let name = $('#mdl_edit_facility_name').val();
    var img = $('#edit_banner_facility_icon').prop('files')[0];

    var formData = new FormData();
    formData.append('name', name);
    formData.append('image', img);

    $.ajax({
        method: "PUT",
        url: `${CONFIG_API_URL}/facility-icon/${id}`,
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
                document.getElementById("mdl-edit-btn-cancle-facility-icon").innerHTML = "Tutup";
                showSuccessAlert(`data berhasil diubah`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
}

function doAddAksesIcon(){
    let type = $('#mdl-add-akses-icon-type').val();
    var img = $('#add_banner_akses_icon').prop('files')[0];

    var formData = new FormData();
    formData.append('type', type);
    formData.append('image', img);

    console.log("req",JSON.stringify(formData))

    $.ajax({
        method: "POST",
        url: `${CONFIG_API_URL}/akses-icon`,
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

function doAddFacilityIcon(){
    let name = $('#mdl_facility_name').val();
    var img = $('#add_banner_facility_icon').prop('files')[0];

    var formData = new FormData();
    formData.append('name', name);
    formData.append('image', img);

    console.log("req",JSON.stringify(formData))

    $.ajax({
        method: "POST",
        url: `${CONFIG_API_URL}/facility`,
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
                mdlAddBtnCancleFacilityIcon.innerHTML = "Tutup";
                showSuccessAlert(`data berhasil diubah`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
}

function closeModal(){
    location.reload();
}

function formDelAccessIcon(){
    let id = $(this).data('akses_icon_id');
    let type = $(this).data('akses_icon_type');

    Swal.fire({
        html: `Anda akan menghapus Akses dengan tipe <strong>${type}</strong>, klik <span class='text-danger'>Hapus</span> untuk melanjutkan atau Batal`,
        icon: "info",
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: "Hapus",
        cancelButtonText: 'Batal',
        customClass: {
            confirmButton: "btn btn-danger btn-sm",
            cancelButton: 'btn btn-secondary btn-sm'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: "DELETE",
                url: `${CONFIG_API_URL}/akses-icon/${id}`,
                headers: {
                    "CSRF-Token": token,
                },
            })
                .done((response) => {
                    if (response.success) {
                        const message = `Data Akses icon dengan tipe <strong>${type}</strong> berhasil dihapus.`
                        showSuccess(message)
                    } else {
                        const message = `Data gagal dihapus, mohon coba beberapa saat lagi atau hubungi administrator.`
                        showAlertErr(message)
                    }
                })
                .fail((jqXHR) => {
                    const message = `Data gagal dihapus, mohon coba beberapa saat lagi atau hubungi administrator.`
                    showAlertErr(message)
                });
        }
    });
}

function formDelFasilityIcon(){
    let id = $(this).data('facility_icon_id');
    let name = $(this).data('facility_name');

    Swal.fire({
        html: `Anda akan menghapus fasilitas <strong>${name}</strong>, klik <span class='text-danger'>Hapus</span> untuk melanjutkan atau Batal`,
        icon: "info",
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: "Hapus",
        cancelButtonText: 'Batal',
        customClass: {
            confirmButton: "btn btn-danger btn-sm",
            cancelButton: 'btn btn-secondary btn-sm'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: "DELETE",
                url: `${CONFIG_API_URL}/fasility-icon/${id}`,
                headers: {
                    "CSRF-Token": token,
                },
            })
                .done((response) => {
                    if (response.success) {
                        const message = `Data fasilitas <strong>${name}</strong> berhasil dihapus.`
                        showSuccess(message)
                    } else {
                        const message = `Data gagal dihapus, mohon coba beberapa saat lagi atau hubungi administrator.`
                        showAlertErr(message)
                    }
                })
                .fail((jqXHR) => {
                    const message = `Data gagal dihapus, mohon coba beberapa saat lagi atau hubungi administrator.`
                    showAlertErr(message)
                });
        }
    });
}

for(const element of btnCloseModal){
    element.addEventListener("click",closeModal)
}

for(const element of btnDeleteAksesIcon){
    element.addEventListener("click",formDelAccessIcon)
}

for(const element of btnDeleteFasilityIcon){
    element.addEventListener("click",formDelFasilityIcon)
}



function showSuccess(message) {
    Swal.fire({
        html: `${message}`,
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok",
        allowOutsideClick: false,
        customClass: {
            confirmButton: "btn btn-primary"
        }
    }).then((result) => {
        window.location.reload();
    })
}

function showAlertErr(body) {
    Swal.fire({
        html: body,
        icon: "error",
        buttonsStyling: false,
        allowOutsideClick: false,
        confirmButtonText: "Ok",
        customClass: {
            confirmButton: "btn btn-primary"
        }
    });
}