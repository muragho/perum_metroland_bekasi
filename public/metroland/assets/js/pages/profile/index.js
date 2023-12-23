var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

const btnChangePassword = document.getElementById("btn-change-password");
const btnChangeProfile = document.getElementById("btn-change-profile");
const mdlBtnChangePassword = document.getElementById("mdl-btn-change-password");
const mdlFormChangePassword = document.getElementById("mdl-form-change-password");
const mdlFormChangeProfile = document.getElementById("mdl-form-change-profile");
const mdlBtnChangeProfile = document.getElementById("mdl-btn-change-profile");
const btnCancelChangeProfile = document.getElementById("btn-cancel-change-profile");

const USER_API_URL = `/metroland/auth/users/api/v1`;
var blockUI;

var showHidePwd = document.querySelector("#show_hide_pwd");
showHidePwd.addEventListener("click", function (e) {
    var x = document.getElementById("password_user");
    var show_eye = document.getElementById("show_eye");
    var hide_eye = document.getElementById("hide_eye");
    hide_eye.classList.remove("d-none");
    if (x.type === "password") {
        x.type = "text";
        show_eye.style.display = "none";
        hide_eye.style.display = "block";
    } else {
        x.type = "password";
        show_eye.style.display = "block";
        hide_eye.style.display = "none";
    }
});

var validator = FormValidation.formValidation(
    mdlFormChangePassword,
    {
        fields: {
            password_user: {
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

var validatorProfile = FormValidation.formValidation(
    mdlFormChangeProfile,
    {
        fields: {
            fullname: {
                validators: {
                    notEmpty: {
                        message: 'Parameter wajib diisi'
                    }
                }
            },
            username: {
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
            }
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

btnChangePassword.addEventListener("click", function (e) {
    e.preventDefault();
    var userId = $(this).data("user_id");
    $('#mdl-user-id').val(userId);

    $('#mdl-change-password').modal("show");
});

btnChangeProfile.addEventListener("click", function (e) {
    e.preventDefault();
    const id = $(this).data('user_id');
    const email = $(this).data('email');
    const address = $(this).data('address');
    const name = $(this).data('name');
    const fullname = $(this).data('fullname');
    const image = $(this).data('image');

    $('#mdl-change-profile-user-id').val(id);
    $('#mdl-edit-profile-fullname').val(fullname);
    $('#mdl-edit-profile-username').val(name);
    $('#mdl-edit-profile-email').val(email);
    $('#mdl-edit-profile-address').val(address);

    const imgProfile = image || image != null ? image : 'nopic.png';
    $("#foto_profil").css("background-image", "url(/metroland/assets/profile/" + imgProfile + ")");

    const target = document.querySelector("#foto_profile_container");

    if (!blockUI) {
        blockUI = new KTBlockUI(target);
        blockUI.block();
    }

    $('#mdl-change-profile').modal("show");
});

mdlBtnChangeProfile.addEventListener("click", function (e) {
    e.preventDefault();

    if (validatorProfile) {
        validatorProfile.validate().then(function (status) {

            if (status == 'Valid') {
                doEditProfile();
            }
        })
    }
})

$('#btn-switch-block').click(function () {

    if (this.checked) {
        blockUI.release();
    } else {
        blockUI.block();
    }
});

btnCancelChangeProfile.addEventListener("click", function (e) {
    e.preventDefault();

    location.reload();
})

mdlBtnChangePassword.addEventListener("click", function (e) {
    e.preventDefault();

    if (validator) {
        validator.validate().then(function (status) {

            if (status == 'Valid') {
                doChangePassword();
            }
        })
    }
});

function doChangePassword() {
    var userId = $('#mdl-user-id').val();
    var password = $('#password_user').val();

    $.ajax({
        method: "PUT",
        url: `${USER_API_URL}/user/${userId}/password`,
        data: { password },
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {
            if (response.code == 200) {
                showSuccessAlert(`Password berhasil diubah`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
}

function doEditProfile() {
    var id = $('#mdl-change-profile-user-id').val();
    var fullname = $('#mdl-edit-profile-fullname').val();
    var name = $('#mdl-edit-profile-username').val();
    var email = $('#mdl-edit-profile-email').val();
    var address = $('#mdl-edit-profile-address').val();
    const isEditImage = document.getElementById('btn-switch-block').checked;
    var img_profile = $('#foto_profile_edit').prop('files')[0];

    var formData = new FormData();
    formData.append('name', name);
    formData.append('fullname', fullname);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('isEdit', isEditImage);
    formData.append('file', img_profile);

    $.ajax({
        method: "PUT",
        url: `${USER_API_URL}/profile/${id}`,
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
                btnCancelChangeProfile.innerHTML = "Tutup";
                showSuccessAlert(`Data berhasil diubah`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });

}