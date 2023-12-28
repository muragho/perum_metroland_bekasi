var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

KTUtil.onDOMContentLoaded(function () {
    $("#menu_carrier").addClass("active");

});

const CARRIER_API_URL = '/metroland/auth/api/v1/carriers'

const btnAddCarrier = document.getElementById("btn-add-carrier");
const mdlBtnSaveCarrier = document.getElementById("mdl-btn-save-carrier");
const mdlBtnCancelCarrier = document.getElementById("mdl-btn-cancel-carrier");


var myEditorAdd;

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
    var carrier = $('#carrier').prop('files')[0];
    var expDate = $('#exp_date').val()

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