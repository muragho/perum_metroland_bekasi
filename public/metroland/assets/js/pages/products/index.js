
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

const PRODUCT_URL = '/metroland/auth/products';
const PRODUCT_API_URL = '/metroland/auth/api/v1/products';
const CLUSTER_API_URL = '/metroland/auth/api/v1/clusters';

const btnEditProduct = document.getElementsByClassName("btn-edit-product");
const formMdlAddProduct = document.getElementById("mdl-form-add-product");
const formMdlEditProduct = document.getElementById("mdl-form-edit-product");
const mdlBtnAddProduct = document.getElementById("mdl-btn-add-product");
const mdlBtnEditProduct = document.getElementById("mdl-btn-edit-product");
const btnAddProduct = document.getElementById("btn-add-product");
const mdlBtnCancleProduct = document.getElementById("mdl-btn-cancle-product");
const btnRemoveSitePlanProduct = document.getElementById("btn-remove-site-plan-product");
const btnRemoveLogoProduct = document.getElementById("btn-remove-logo-product");

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
        toolbar: ['heading', 'bold', 'italic', 'link', 'numberedList', 'bulletedList', 'undo', 'redo']
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

for (const element of btnEditProduct) {
    element.addEventListener("click", formEditProduct);
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

$('#q').maxlength({
    warningClass: "badge badge-warning",
    limitReachedClass: "badge badge-success"
});

function doAddProduct() {

    var title = $('#mdl-add-title-product').val();
    var description = myEditorAdd.getData();
    var logo = $('#logo_produk').prop('files')[0];
    var clusters = $('#mdl_clusters').val();

    var formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', logo);
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

    var formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('clusters', clusters);
    formData.append('file_logo', img1);
    formData.append('file_site_plan', img2);

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
                }
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
}