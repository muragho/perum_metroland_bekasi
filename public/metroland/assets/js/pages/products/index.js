
var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

KTUtil.onDOMContentLoaded(function () {
    $("#menu_product").addClass("active");

    $('#mdl_clusters').select2({
        multiple: true,
        tags: false
    });
    $('#mdl_edit_clusters').select2({
        multiple: true,
        tags: false
    });
});

const PRODUCT_URL = '/auth/products';
const PRODUCT_API_URL = '/auth/api/v1/products';
const CLUSTER_API_URL = '/auth/api/v1/clusters';

const btnEditProduct = document.getElementsByClassName("btn-edit-product");
const formMdlAddProduct = document.getElementById("mdl-form-add-product");
const formMdlEditProduct = document.getElementById("mdl-form-edit-product");
const mdlBtnAddProduct = document.getElementById("mdl-btn-add-product");
const mdlBtnEditProduct = document.getElementById("mdl-btn-edit-product");
const btnAddProduct = document.getElementById("btn-add-product");
const mdlBtnCancleProduct = document.getElementById("mdl-btn-cancle-product");
const btnRemoveSitePlanProduct = document.getElementById("btn-remove-site-plan-product");
const btnRemoveImageCluster = document.getElementById("btn-remove-image-cluster");
const btnRemoveLogoProduct = document.getElementById("btn-remove-logo-product");
const btnDeleteCluster = document.getElementsByClassName("btn-delete-cluster");


var myEditorEdit;
var myEditorAdd;

ClassicEditor
    .create(document.querySelector('#mdl-edit-content-product'), {
        toolbar: ['heading', 'bold', 'italic', 'link', 'numberedList', 'bulletedList', 'undo', 'redo']
    })
    .then(editor => {
        myEditorEdit = editor;
    })
    .catch(error => {
        console.error(error);
    });

ClassicEditor
    .create(document.querySelector('#mdl-add-content-product'), {
        toolbar: ['heading', 'bold', 'italic', 'link', 'numberedList', 'bulletedList', 'undo', 'redo'],
    })
    .then(editor => {
        myEditorAdd = editor;
    })
    .catch(error => {
        console.error(error);
    });

btnAddProduct.addEventListener("click", function (e) {
    e.preventDefault();
    getClusters("add");
    $('#mdl-add-product').modal("show");
})

var validator = FormValidation.formValidation(
    formMdlEditProduct,
    {
        fields: {
            product_title: {
                validators: {
                    notEmpty: {
                        message: 'Parameter wajib diisi'
                    }
                }
            },
            mdl_edit_content_product: {
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

var validatorAddProduct = FormValidation.formValidation(
    formMdlAddProduct,
    {
        fields: {
            product_title: {
                validators: {
                    notEmpty: {
                        message: 'Parameter wajib diisi'
                    }
                }
            },
            mdl_add_content_product: {
                validators: {
                    notEmpty: {
                        message: 'Parameter wajib diisi'
                    }
                }
            },
            mdl_clusters: {
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

function formEditProduct() {
    const productId = $(this).data("product_id");
    const title = $(this).data("title");
    const content = $(this).data("content");

    $('#mdl-edit-product-id').val(productId);
    $('#mdl-edit-title-product').val(title);
    myEditorEdit.setData(content);

    getClusters("edit");
    selectedCluster(productId);

    $('#mdl-edit-product').modal('show');

};

function formDeleteCluster() {
    const product_id = $(this).data("product_id");
    const title = $(this).data("title");

    Swal.fire({
        html: `Anda akan menghapus Produk <strong>${title}</strong>, klik <span class='text-danger'>Hapus</span> untuk melanjutkan atau Batal`,
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
                url: `${PRODUCT_API_URL}/${product_id}`,
                headers: {
                    "CSRF-Token": token,
                },
            })
                .done((response) => {
                    if (response.success) {
                        const message = `Data produk <strong>${title}</strong> berhasil dihapus.`
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


for (const element of btnEditProduct) {
    element.addEventListener("click", formEditProduct);
}

for (const element of btnDeleteCluster) {
    element.addEventListener("click", formDeleteCluster);
}

mdlBtnAddProduct.addEventListener("click", function (e) {
    e.preventDefault();
    if (validatorAddProduct) {
        validatorAddProduct.validate().then(function (status) {

            if (status == 'Valid') {
                doAddProduct();
            }
        })
    }
})

mdlBtnEditProduct.addEventListener("click", function (e) {
    e.preventDefault();
    if (validator) {
        validator.validate().then(function (status) {

            if (status == 'Valid') {
                doEdit();
            }
        })
    }
})

mdlBtnCancleProduct.addEventListener("click", function (e) {
    e.preventDefault();
    $('#mdl-add-product').modal('toggle');
    location.reload();
})


btnRemoveSitePlanProduct.addEventListener("click", function (e) {
    e.preventDefault();
    const productId = $(this).data('produk_id');
    const TYPE = 'siteplan';

    $.ajax({
        method: "PUT",
        url: `${PRODUCT_API_URL}/${TYPE}/image/${productId}/product`,
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


});

btnRemoveLogoProduct.addEventListener("click", function (e) {
    e.preventDefault();

    const productId = $(this).data('produk_id');
    const TYPE = 'logo';

    $.ajax({
        method: "PUT",
        url: `${PRODUCT_API_URL}/${TYPE}/image/${productId}/product`,
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
})

btnRemoveImageCluster.addEventListener("click", function (e) {
    e.preventDefault();

    const productId = $(this).data('produk_id');
    const TYPE = 'banner';
    $.ajax({
        method: "PUT",
        url: `${PRODUCT_API_URL}/${TYPE}/image/${productId}/product`,
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
})

$('#q').maxlength({
    warningClass: "badge badge-warning",
    limitReachedClass: "badge badge-success"
});

function doAddProduct() {

    var title = $('#mdl-add-title-product').val();
    var description = myEditorAdd.getData();
    var logo = $('#logo_produk').prop('files')[0];
    var siteplan = $('#img_site_plan_add').prop('files')[0];
    var banner = $('#file_image_cluster_add').prop('files')[0];
    var clusters = $('#mdl_clusters').val();

    var formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', logo);
    formData.append('file_siteplan', siteplan);
    formData.append('file_banner', banner);
    formData.append('clusters', clusters);

    $.ajax({
        method: "POST",
        url: `${PRODUCT_API_URL}`,
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
                mdlBtnCancleProduct.innerHTML = "Tutup";
                showSuccessAlert(`data berhasil ditambahkan`);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
}

function doEdit() {

    let id = $('#mdl-edit-product-id').val();
    let title = $('#mdl-edit-title-product').val();
    let description = myEditorEdit.getData();
    var clusters = $('#mdl_edit_clusters').val();
    var img1 = $('#logo_produk_edit').prop('files')[0];
    var img2 = $('#img_site_plan_edit').prop('files')[0];
    var img3 = $('#image_cluster_edit').prop('files')[0];

    var formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('clusters', clusters);
    formData.append('file_logo', img1);
    formData.append('file_site_plan', img2);
    formData.append('file_banner', img3);

    $.ajax({
        method: "PUT",
        url: `${PRODUCT_API_URL}/${id}`,
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
                $('#mdl-edit-product').modal('toggle');
                showSuccessAlert(`data berhasil diubah`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });

}

function getClusters(modalType) {
    $.ajax({
        method: "GET",
        url: `${CLUSTER_API_URL}`,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {
            if (response.code == 200) {

                response.data.forEach(cluster => {

                    if (modalType == "add") {
                        $('#mdl_clusters').append($('<option>', {
                            value: cluster.id,
                            text: cluster.name
                        }));
                    } else {
                        $('#mdl_edit_clusters').append($('<option>', {
                            value: cluster.id,
                            text: cluster.name
                        }));
                    }

                });
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
}

function selectedCluster(productId) {
    $("#mdl_edit_clusters").empty();
    $.ajax({
        method: "GET",
        url: `${PRODUCT_API_URL}/cluster/${productId}/product`,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {
            $("#logo_site_plan").css("background-image", "url()");
            $("#logo_cluster").css("background-image", "url()");
            $("#image_cluster").css("background-image", "url()");

            if (response.code == 200) {

                if (response.data != null) {

                    let clusterIds = [];
                    response.data.clusters.forEach(cluster => {
                        clusterIds.push(cluster.id);
                    });
                    $("#mdl_edit_clusters").val(clusterIds).trigger('change');

                    //show logo & site plan
                    if (response.data.image != null) {
                        $("#logo_cluster").css("background-image", "url(/metroland/assets/img/" + response.data.image + ")");
                        $('#btn-remove-logo-product').attr('data-produk_id', productId);

                    }
                    if (response.data.image_site_plan != null) {
                        $("#logo_site_plan").css("background-image", "url(/metroland/assets/img_site_plan/" + response.data.image_site_plan + ")");
                        $('#btn-remove-site-plan-product').attr('data-produk_id', productId);
                    }

                    if (response.data.image_banner_1 != null) {
                        $("#image_cluster").css("background-image", "url(/metroland/assets/img_product/" + response.data.image_banner_1 + ")");
                        $('#btn-remove-image-cluster').attr('data-produk_id', productId);
                    }
                }
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
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