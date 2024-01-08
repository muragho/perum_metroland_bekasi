var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

KTUtil.onDOMContentLoaded(function () {
    $("#menu_carrier").addClass("active");

});

const CARRIER_API_URL = '/auth/api/v1/carriers'

const btnAddCarrier = document.getElementById("btn-add-carrier");
const mdlBtnSaveCarrier = document.getElementById("mdl-btn-save-carrier");
const mdlBtnCancelCarrier = document.getElementById("mdl-btn-cancel-carrier");
const btnEditCarrier = document.getElementsByClassName("btn-edit-carrier");
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

    var departmentId = $('#mdl_add_carrier_department option:selected').val();
    var description = myEditorAdd.getData();
    var carrier = $('#carrier_edit').prop('files')[0];
    var expDate = $('#exp_date_edit').val()

    var formData = new FormData();
    formData.append('departmentId', departmentId);
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
    var departmentId = $('#mdl_edit_carrier_department option:selected').val();
    var description = myEditorEdit.getData();
    var carrier = $('#carrier_edit').prop('files')[0];
    var expDate = $('#exp_date_edit').val();

    var formData = new FormData();
    formData.append('departmentId', departmentId);
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
    const department = $(this).data("department");
    const description = $(this).data("description");
    const banner = $(this).data("banner");
    const exp = $(this).data("exp");

    const date = new Date(exp);
    const tgl = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    console.log(carrierId)
    $('#mdl_carrier_id').val(carrierId);
    $('#mdl_edit_carrier_department').val(department).change();
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
        console.log('ada banner')
        $("#banner_carrier_edit").css("background-image", "url(/metroland/assets/img_carrier/" + banner + ")");
    } else {
        $("#banner_carrier_edit").css("background-image", "");
    }


    $('#mdl-edit-carrier').modal('show');

};


for (const element of btnEditCarrier) {
    element.addEventListener("click", formEditCarrier);
}