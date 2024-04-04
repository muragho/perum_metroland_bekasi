var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

KTUtil.onDOMContentLoaded(function () {
    $("#menu_carrier").addClass("active");

});

const CARRIER_API_URL = '/auth/api/v1/carriers'

const btnAddCarrier = document.getElementById("btn-add-carrier");
const mdlBtnSaveCarrier = document.getElementById("mdl-btn-save-carrier");
const mdlBtnCancelCarrier = document.getElementById("mdl-btn-cancel-carrier");
const btnEditCarrier = document.getElementsByClassName("btn-edit-carrier");
const btnDeleteCarrier = document.getElementsByClassName("btn-delete-carrier");
const mdlBtnEditCarrier = document.getElementById("mdl-btn-edit-carrier");
const mdlBtnEditCancelCarrier = document.getElementById("mdl-btn-edit-cancel-carrier");


var myEditorAdd;
var myEditorEdit;

ClassicEditor
    .create(document.querySelector('#mdl_add_carrier_description'), {
        toolbar: ['heading', 'bold', 'italic', 'link', 'numberedList', 'bulletedList', 'undo', 'redo']
    })
    .then(editor => {
        myEditorAdd = editor;
    })
    .catch(error => {
        console.error(error);
    });
ClassicEditor
    .create(document.querySelector('#mdl_edit_carrier_description'), {
        toolbar: ['heading', 'bold', 'italic', 'link', 'numberedList', 'bulletedList', 'undo', 'redo']
    })
    .then(editor => {
        myEditorEdit = editor;
    })
    .catch(error => {
        console.error(error);
    });

btnAddCarrier.addEventListener("click", function (e) {
    e.preventDefault();

    $('#mdl-add-carrier').modal("show");
});

mdlBtnCancelCarrier.addEventListener("click", function (e) {
    e.preventDefault();
    location.reload();
})

mdlBtnSaveCarrier.addEventListener("click", function (e) {
    e.preventDefault();

    var department = $('#mdl_add_carrier_department').val();
    var description = myEditorAdd.getData();
    var carrier = $('#carrier').prop('files')[0];
    var expDate = $('#exp_date_edit').val()

    var formData = new FormData();
    formData.append('department_name', department);
    formData.append('description', description);
    formData.append('file', carrier);
    formData.append('expired', expDate);

    $.ajax({
        method: "POST",
        url: `${CARRIER_API_URL}`,
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
                mdlBtnCancelCarrier.innerHTML = "Tutup";
                showSuccessAlert(`data berhasil ditambahkan`);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
})

mdlBtnEditCarrier.addEventListener("click", function (e) {
    e.preventDefault();

    var carrierId = $('#mdl_carrier_id').val();
    var department = $('#mdl_edit_carrier_department').val();
    var description = myEditorEdit.getData();
    var carrier = $('#carrier_edit').prop('files')[0];
    var expDate = $('#exp_date_edit').val();

    var formData = new FormData();
    formData.append('department_name', department);
    formData.append('description', description);
    formData.append('file', carrier);
    formData.append('expired', expDate);

    $.ajax({
        method: "PUT",
        url: `${CARRIER_API_URL}/${carrierId}`,
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
                mdlBtnEditCancelCarrier.innerHTML = "Tutup";
                showSuccessAlert(`data berhasil diubah`);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
})

mdlBtnEditCancelCarrier.addEventListener("click", function (e) {
    e.preventDefault();

    $('#mdl-edit-carrier').modal('toggle');
    location.reload();
})

$("#exp_date").daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 2015,
    maxYear: parseInt(moment().format("YYYY"), 10),
    locale: {
        format: "YYYY-MM-DD"
    }
}
);

$("#exp_date_edit").daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 2015,
    maxYear: parseInt(moment().format("YYYY"), 10),
    locale: {
        format: "YYYY-MM-DD"
    }
}
);

function formEditCarrier() {
    const carrierId = $(this).data("carrier_id");
    const department = $(this).data("department_name");
    const description = $(this).data("description");
    const banner = $(this).data("banner");
    const exp = $(this).data("exp");

    const date = new Date(exp);
    const tgl = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    console.log(carrierId)
    $('#mdl_carrier_id').val(carrierId);
    $('#mdl_edit_carrier_department').val(department);
    $('#exp_date_edit').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 2015,
        startDate: tgl,
        locale: {
            format: "YYYY-MM-DD"
        }
    });
    myEditorEdit.setData(description);

    if (banner != '' && banner != null) {
        console.log('ada banner ',banner)
        $("#banner_carrier_edit").css("background-image", "url(/metroland/assets/img_carrier/" + banner + ")");
    } else {
        console.log('tidak ada banner')
        $("#banner_carrier_edit").css("background-image", "");
    }


    $('#mdl-edit-carrier').modal('show');

};

function formDeleteCarrier() {
    const carrierId = $(this).data("carrier_id");
    const department = $(this).data("department_name");
    const description = $(this).data("description");
    const banner = $(this).data("banner");
    const exp = $(this).data("exp");

    Swal.fire({
        html: `Anda akan menghapus karir untuk department <strong>${department}</strong>, klik <span class='text-danger'>Hapus</span> untuk melanjutkan atau Batal`,
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
                url: `${CARRIER_API_URL}/${carrierId}`,
                headers: {
                    "CSRF-Token": token,
                },
            })
                .done((response) => {
                    if (response.success) {
                        const message = `Data karir dengan department <strong>${department}</strong> berhasil dihapus.`
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

};


for (const element of btnEditCarrier) {
    element.addEventListener("click", formEditCarrier);
}

for (const element of btnDeleteCarrier) {
    element.addEventListener("click", formDeleteCarrier);
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