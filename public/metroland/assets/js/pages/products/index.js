
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
    $('#mdl_facility').select2({
        multiple: true,
        tags: false
    });
    $('#mdl_edit_facility').select2({
        multiple: true,
        tags: false
    });
});

const PRODUCT_URL = '/auth/products';
const PRODUCT_API_URL = '/auth/api/v1/products';
const CLUSTER_API_URL = '/auth/api/v1/clusters';
const FACILITY_API_URL = '/auth/api/v1/facilities';
const ACCESS_API_URL = '/auth/api/v1/accesses';

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
const btnProductAccess = document.getElementsByClassName("btn-product-access");
const mdlBtnAddAccessRow = document.getElementById("mdl-btn-add-access-row");


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
    getFacilities('add');
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
            mdl_facility: {
                validators: {
                    notEmpty: {
                        message: 'Parameter wajib diisi'
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

function formEditProduct() {
    const productId = $(this).data("product_id");
    const title = $(this).data("title");
    const content = $(this).data("content");

    $('#mdl-edit-product-id').val(productId);
    $('#mdl-edit-title-product').val(title);
    myEditorEdit.setData(content);

    getClusters("edit");
    getFacilities("edit");
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

for (const element of btnProductAccess) {
    element.addEventListener("click", formAccessProduct);
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
    var facilities = $('#mdl_facility').val();

    var formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', logo);
    formData.append('file_siteplan', siteplan);
    formData.append('file_banner', banner);
    formData.append('clusters', clusters);
    formData.append('facilities', facilities);

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
    var facilities = $('#mdl_edit_facility').val();
    var img1 = $('#logo_produk_edit').prop('files')[0];
    var img2 = $('#img_site_plan_edit').prop('files')[0];
    var img3 = $('#image_cluster_edit').prop('files')[0];

    var formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('clusters', clusters);
    formData.append('facilities', facilities);
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

mdlBtnAddAccessRow.addEventListener("click", function (e) {
    e.preventDefault();

    $.ajax({
        method: "GET",
        url: `${CLUSTER_API_URL}/access_icons`,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {

            var rowCount = $('#tbl-access tr').length;

            if (response.code == 200 && response.data.length > 0) {

                let html = `<tr id="row_new_${rowCount}">
                <td>
                    <input type="text" class="form-control form-control-sm" id="access_title"
                        name="accept_title" value="" />
                </td>
                <td>
                    <textarea type="text" class="form-control form-control-sm" id="access_description"
                        name="accept_description"></textarea>
                </td>
                <td>
                    <select class="form-select form-select-sm" id="access_icon_${rowCount}" name="access_icon"
                        aria-label="Select example">
                        
                    </select>
                </td>
                <td>
                    <button class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary btn-remove-access-cluster"
                        data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-type="new" data-cluster_id="${rowCount}">
                        <i class="bi bi-trash3 fs-4 text-danger"></i>
                    </button>
                    <button class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary btn-save-access-cluster"
                        data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" id="btn_save_access_${rowCount}">
                        <span class="svg-icon icon-size-5 svg-icon-light">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16">
<path d="M11 2H9v3h2z"/>
<path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
</svg>
                        </span>
                    </button>
                </td>
            </tr>`;

                $("#tbl-access tbody").append(html);

                var select = document.getElementById(`access_icon_${rowCount}`);

                response.data.forEach(dataIcon => {
                    var opt = document.createElement('option');
                    opt.value = dataIcon.id;
                    opt.innerHTML = dataIcon.type;
                    select.appendChild(opt);
                })

            }

        }).fail((error) => {
            showErrorAlert(error);
        });

})

$("#tbl-access").on("click", ".btn-remove-access-cluster", function () {

    var productId = $(this).data('cluster_id');
    var type = $(this).data('type');

    if (type == 'new') {
        $(this).closest("tr").remove();
    } else {

        delAccessCluster(productId);
        $(this).closest("tr").remove();
    }

});

$("#tbl-access").on("click", ".btn-save-access-cluster", function () {

    var title = $(this).closest("tr").find("input[name='accept_title']").val();
    var description = $(this).closest("tr").find("textarea").val();
    var icon = $(this).closest("tr").find("option:selected").val();

    var productId = $('#access_product_id').val();

    let data = {};
    data.title = title;
    data.description = description;
    data.accessIconId = icon;
    data.productId = productId;

    $.ajax({
        method: "POST",
        url: `${CLUSTER_API_URL}/access`,
        data: data,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {
            if (response.code == 200) {

                $(this).remove();

                showSuccessAlert(`Data berhasil disimpan`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });

});

function delAccessCluster(accessId) {
    $.ajax({
        method: "DELETE",
        url: `${CLUSTER_API_URL}/access/${accessId}`,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {
            if (response.code == 200) {

                showSuccessAlert(`Data berhasil dihapus`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
}

function formAccessProduct() {
    const id = $(this).data("product_id");

    $('#access_product_id').val(id);

    getAccessByProduct(id)

    $('#mdl-access-cluster').modal('show');
};

function getAccessByProduct(productId) {
    $.ajax({
        method: "GET",
        url: `${ACCESS_API_URL}/${productId}/product_id`,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {

            $("#tbl-access tbody").empty();

            if (response.code == 200 && response.data.access.length > 0) {
                console.log('response.data', response.data);
                response.data.access.forEach(acc => {
                    let html = `<tr id="row_${acc.id}">
                    <td>
                        <input type="text" class="form-control form-control-sm" id="access_title_${acc.id}"
                            name="accept_title" value="${acc.title}" />
                    </td>
                    <td>
                        <textarea type="text" class="form-control form-control-sm" id="access_description_${acc.id}"
                            name="accept_description">${acc.description}</textarea>
                    </td>
                    <td>
                        <select class="form-select form-select-sm" id="access_icon_${acc.id}" name="access_icon"
                            aria-label="Select example">
                            
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary btn-remove-access-cluster"
                            data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-cluster_id="${acc.id}" data-type="old">
                            <i class="bi bi bi-trash3 fs-4 text-danger"></i>
                        </button>
                        
                    </td>
                </tr>`;

                    $("#tbl-access tbody").append(html);

                    var select = document.getElementById(`access_icon_${acc.id}`);

                    response.data.accessIcons.forEach(dataIcon => {
                        var opt = document.createElement('option');
                        opt.value = dataIcon.id;
                        opt.innerHTML = dataIcon.type;
                        select.appendChild(opt);
                    })

                    if (acc.access_icon) $('#access_icon_' + acc.id).val(acc.access_icon.id).change();
                })
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

function getFacilities(modalType) {
    $.ajax({
        method: "GET",
        url: `${FACILITY_API_URL}`,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {
            if (response.code == 200) {

                response.data.forEach(facility => {
                    if (modalType == "add") {
                        $('#mdl_facility').append($('<option>', {
                            value: facility.id,
                            text: facility.name
                        }));
                    } else {
                        $('#mdl_edit_facility').append($('<option>', {
                            value: facility.id,
                            text: facility.name
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
    $("#mdl_edit_facility").empty();
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

                    let facilityIds = [];
                    response.data.facilities.forEach(facility => {
                        facilityIds.push(facility.id);
                    });
                    $("#mdl_edit_facility").val(facilityIds).trigger('change');

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