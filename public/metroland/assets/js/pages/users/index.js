var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

KTUtil.onDOMContentLoaded(function () {
    $("#menu_user").addClass("active");
});
const btnResetPwd = document.getElementsByClassName("btn-reset-pwd");
const btnAddUser = document.getElementById("btn-add-user");
const mdlFormAddUser = document.getElementById("mdl-form-add-user");
const mdlBtnSaveUser = document.getElementById("mdl-btn-save-user");
const mdlBtnCloseUser = document.getElementById("mdl-btn-close-user");

const USER_API_URL = `/metroland/auth/users/api/v1`

var validator = FormValidation.formValidation(
    mdlFormAddUser,
    {
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: 'Parameter wajib diisi'
                    }
                }
            },
            fullname: {
                validators: {
                    notEmpty: {
                        message: 'Parameter wajib diisi'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Parameter wajib diisi'
                    },
                    emailAddress: {
                        message: 'format email tidak sesuai'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'Parameter wajib diisi'
                    },
                    stringLength: {
                        min: 8,
                        max: 30,
                        message: 'min 8 , max 30'
                    },
                    regexp: {
                        regexp: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message: 'Password harus mengandung Angka dan huruf kecil'
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


btnAddUser.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("modal")
    $('#mdl-add-user').modal('show');
});

mdlBtnSaveUser.addEventListener("click", function (e) {
    e.preventDefault();
    if (validator) {
        validator.validate().then(function (status) {

            if (status == 'Valid') {
                doSave();
            }
        })
    }
});

mdlBtnCloseUser.addEventListener("click", function (e) {
    e.preventDefault();

    location.reload();
})

function formEditProduct() {
    const userId = $(this).data("user_id");
    const name = $(this).data("name");
    const email = $(this).data("email");

    Swal.fire({
        html: `Apakah anda yakin akan me-reset password dengan email <b>${email}</b>?`,
        icon: "info",
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: "Reset",
        cancelButtonText: "Batal",
        customClass: {
            confirmButton: "btn btn-sm btn-primary",
            cancelButton: "btn btn-sm btn-light",
        },
    }).then((result) => {
        if (result.isConfirmed) {
            doReset(userId);
        }
    });

};

for (const element of btnResetPwd) {
    element.addEventListener("click", formEditProduct);
}

function doReset(userId) {

    $.ajax({
        method: "PUT",
        url: `${USER_API_URL}/user/reset-password/${userId}`,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {
            if (response.code == 200) {
                Swal.fire({
                    html: `Password berhasil direset, password baru anda <b class="text-danger">${response.data.password}</b><br/><label>pastikan anda sudah menyimpan password anda sebelum menutup popup ini.</label>`,
                    icon: "success",
                    buttonsStyling: false,
                    showCancelButton: false,
                    confirmButtonText: "Tutup",
                    customClass: {
                        confirmButton: "btn btn-sm btn-light",
                    },
                })
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
}

function doSave() {

    var name = $('#username').val();
    var fullname = $('#fullname').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var address = $('#address').val();

    let data = {};
    data.name = name;
    data.fullname = fullname;
    data.email = email;
    data.password = password;
    data.address = address;

    $.ajax({
        method: "POST",
        url: `${USER_API_URL}/user`,
        data: data,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {
            if (response.code == 200) {
                showSuccessAlert(`data berhasil ditambahkan`);
                mdlBtnCloseUser.innerHTML = 'Tutup';
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
}