var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

KTUtil.onDOMContentLoaded(function () {
    $("#menu_user").addClass("active");
});
const btnResetPwd = document.getElementsByClassName("btn-reset-pwd");

const USER_API_URL = `/metroland/auth/users/api/v1`

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
        url: `${USER_API_URL}/reset-password/${userId}`,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {
            if (response.code == 200) {
                showSuccessAlert(`data berhasil dihapus`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
}