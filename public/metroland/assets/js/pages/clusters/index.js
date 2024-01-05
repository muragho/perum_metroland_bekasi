var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

KTUtil.onDOMContentLoaded(function () {
    $("#menu_cluster").addClass("active");

    $('#mdl_edit_clusters_facility').select2({
        multiple: true,
        tags: false
    });
});
const CLUSTER_URL = '/auth/clusters'
const CLUSTER_API = '/auth/api/v1/clusters'
const btnEditCluster = document.getElementsByClassName("btn-edit-cluster");
const mdlFormAddCluster = document.getElementById("mdl-form-add-cluster");
const formMdlEditCluster = document.getElementById("mdl-form-edit-cluster");
const mdlBtnEditCluster = document.getElementById("mdl-btn-edit-cluster");
const btnAddCluster = document.getElementById("btn-add-cluster");
const mdlBtnAddCluster = document.getElementById("mdl-btn-add-cluster");
const mdlBtnCancelAddCluster = document.getElementById("mdl-btn-cancel-add-cluster");
const btnRemoveImgCluster = document.getElementsByClassName("btn-remove-img-cluster");
const btnClusterAccess = document.getElementsByClassName("btn-cluster-access");
const mdlBtnAddAccessRow = document.getElementById("mdl-btn-add-access-row");

var target;
var blockUI;

var validatorAdd = FormValidation.formValidation(
    mdlFormAddCluster,
    {
        fields: {
            cluster_name: {
                validators: {
                    notEmpty: {
                        message: 'Data wajib diisi'
                    }
                }
            },
            mdl_edit_description_cluster: {
                validators: {
                    notEmpty: {
                        message: 'Data wajib diisi'
                    }
                }
            },
            total_bedrooms: {
                validators: {
                    notEmpty: {
                        message: 'Data wajib diisi'
                    },
                    numeric: {
                        message: 'Nilai berupa angka'
                    },
                    between: {
                        max: 5,
                        min: 1,
                        message: 'value between 1 to 5'
                    }
                }
            },
            total_bathroom: {
                validators: {
                    notEmpty: {
                        message: 'Data wajib diisi'
                    },
                    numeric: {
                        message: 'Nilai berupa angka'
                    },
                    between: {
                        max: 5,
                        min: 1,
                        message: 'value between 1 to 5'
                    }
                }
            },
            total_garage: {
                validators: {
                    notEmpty: {
                        message: 'Data wajib diisi'
                    },
                    numeric: {
                        message: 'Nilai berupa angka'
                    },
                    between: {
                        max: 3,
                        min: 1,
                        message: 'value between 1 to 3'
                    }
                }
            },
            total_area: {
                validators: {
                    notEmpty: {
                        message: 'Data wajib diisi'
                    },
                    numeric: {
                        message: 'Nilai berupa angka'
                    },
                    between: {
                        max: 300,
                        min: 1,
                        message: 'value between 1 to 300'
                    }
                }
            },
            total_home: {
                validators: {
                    notEmpty: {
                        message: 'Data wajib diisi'
                    },
                    numeric: {
                        message: 'Nilai berupa angka'
                    },
                    between: {
                        max: 300,
                        min: 1,
                        message: 'value between 1 to 300'
                    }
                }
            },
            latitude: {
                validators: {
                    numeric: {
                        message: 'Nilai berupa angka'
                    }
                }
            },
            longitude: {
                validators: {
                    numeric: {
                        message: 'Nilai berupa angka'
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

var validator = FormValidation.formValidation(
    formMdlEditCluster,
    {
        fields: {
            cluster_name: {
                validators: {
                    notEmpty: {
                        message: 'parameters are required'
                    }
                }
            },
            mdl_edit_description_cluster: {
                validators: {
                    notEmpty: {
                        message: 'parameters are required'
                    }
                }
            },
            total_bedrooms: {
                validators: {
                    notEmpty: {
                        message: 'parameters are required'
                    },
                    numeric: {
                        message: 'number only'
                    },
                    between: {
                        max: 5,
                        min: 1,
                        message: 'value between 1 to 5'
                    }
                }
            },
            total_bathroom: {
                validators: {
                    notEmpty: {
                        message: 'parameters are required'
                    },
                    numeric: {
                        message: 'number only'
                    },
                    between: {
                        max: 5,
                        min: 1,
                        message: 'value between 1 to 5'
                    }
                }
            },
            total_garage: {
                validators: {
                    notEmpty: {
                        message: 'parameters are required'
                    },
                    numeric: {
                        message: 'number only'
                    },
                    between: {
                        max: 3,
                        min: 1,
                        message: 'value between 1 to 3'
                    }
                }
            },
            total_area: {
                validators: {
                    notEmpty: {
                        message: 'parameters are required'
                    },
                    numeric: {
                        message: 'number only'
                    },
                    between: {
                        max: 300,
                        min: 1,
                        message: 'value between 1 to 300'
                    }
                }
            },
            total_home: {
                validators: {
                    notEmpty: {
                        message: 'parameters are required'
                    },
                    numeric: {
                        message: 'number only'
                    },
                    between: {
                        max: 300,
                        min: 1,
                        message: 'value between 1 to 300'
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

mdlBtnAddCluster.addEventListener("click", function (e) {
    e.preventDefault();

    if (validatorAdd) {
        validatorAdd.validate().then(function (status) {
            console.log(status)
            if (status == 'Valid') {
                doAddCluster();
            }
        })
    }
})

btnAddCluster.addEventListener("click", function (e) {
    e.preventDefault();

    $('#mdl-add-cluster').modal('show');
})

function formEditCluster() {
    const id = $(this).data("cluster_id");
    const name = $(this).data("cluster_name");
    const description = $(this).data("cluster_description");
    const total_badroom = $(this).data("total_badroom");
    const total_bathroom = $(this).data("total_bathroom");
    const total_garage = $(this).data("total_garage");
    const area = $(this).data("total_area");
    const building_area = $(this).data("total_building_area");

    target = document.querySelector("#list-file-cluster");
    if (!blockUI) {
        blockUI = new KTBlockUI(target);
        blockUI.block();
    }

    $.ajax({
        method: "GET",
        url: `${CLUSTER_API}/images/${id}/cluster_id`,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {
            if (response.code == 200) {

                $('#mdl-edit-cluster-id').val(id);
                $('#mdl-edit-cluster-name').val(name);
                $('#mdl_edit_description_cluster').val(description);
                $('#mdl-edit-cluster-bedrooms').val(total_badroom);
                $('#mdl-edit-cluster-bathroom').val(total_bathroom);
                $('#mdl-edit-cluster-garage').val(total_garage);
                $('#mdl-edit-cluster-area').val(area);
                $('#mdl-edit-cluster-home').val(building_area);

                console.log("show images")
                addImageInput(response);


                $('#mdl-edit-cluster').modal('show');

            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });

};

function formAccessCluster() {
    const id = $(this).data("cluster_id");
    const name = $(this).data("cluster_name");

    $('#access_cluster_id').val(id);
    $('#form-cluster-name').html(name);

    getAccessByCluster(id)

    $('#mdl-access-cluster').modal('show');
};

for (const element of btnEditCluster) {
    element.addEventListener("click", formEditCluster);
}

for (const element of btnClusterAccess) {
    element.addEventListener("click", formAccessCluster);
}

function formRemoveImage() {
    const id = $(this).data("cluster_image_id");

    console.log("id : " + id);

    $.ajax({
        method: "DELETE",
        url: `${CLUSTER_API}/images/${id}`,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {
            if (response.code == 200) {

                showSuccessAlert(`Data berhasil disimpan`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });

};

for (const element of btnRemoveImgCluster) {
    element.addEventListener("click", formRemoveImage);
}

mdlBtnCancelAddCluster.addEventListener("click", function (e) {
    e.preventDefault();

    $('#mdl-add-cluster').modal('toggle');
    location.reload();
})

mdlBtnEditCluster.addEventListener("click", function (e) {
    e.preventDefault();
    if (validator) {
        validator.validate().then(function (status) {
            console.log(status)
            if (status == 'Valid') {
                doEdit();
            }
        })
    }
})

mdlBtnAddAccessRow.addEventListener("click", function (e) {
    e.preventDefault();

    var rowCount = $('#tbl-access tr').length;

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
                        <select class="form-select form-select-sm" id="access_icon" name="access_icon"
                            aria-label="Select example">
                            <option value="tol.png">Pintu Tol</option>
                            <option value="halte busway.png">Halte Busway</option>
                            <option value="stasiun.png">Stasiun</option>
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

})

$("#tbl-access").on("click", ".btn-remove-access-cluster", function () {

    var accessId = $(this).data('cluster_id');
    var type = $(this).data('type');

    if (type == 'new') {
        $(this).closest("tr").remove();
    } else {

        delAccessCluster(accessId);
        $(this).closest("tr").remove();
    }

});

$("#tbl-access").on("click", ".btn-save-access-cluster", function () {

    var title = $(this).closest("tr").find("input[name='accept_title']").val();
    var description = $(this).closest("tr").find("textarea").val();
    var icon = $(this).closest("tr").find("option:selected").val();

    var clusterId = $('#access_cluster_id').val();

    let data = {};
    data.title = title;
    data.description = description;
    data.image = icon;
    data.clusterId = clusterId;

    $.ajax({
        method: "POST",
        url: `${CLUSTER_API}/access`,
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

$('#q').maxlength({
    warningClass: "badge badge-warning",
    limitReachedClass: "badge badge-success"
});

function doAddCluster() {

    const name = $('#mdl-add-cluster-name').val();
    const description = $('#mdl_add_description_cluster').val();
    const total_badroom = $('#mdl-add-cluster-bedrooms').val();
    const total_bathroom = $('#mdl-add-cluster-bathroom').val();
    const total_garage = $('#mdl-add-cluster-garage').val();
    const area = $('#mdl-add-cluster-area').val();
    const building_area = $('#mdl-add-cluster-home').val();
    const latitude = $('#mdl-add-cluster-latitude').val();
    const longitude = $('#mdl-add-cluster-longitude').val();

    $.ajax({
        method: "POST",
        url: `${CLUSTER_URL}`,
        data: {
            name, description, total_badroom, total_bathroom, total_garage, area, building_area, latitude, longitude
        },
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {
            if (response.code == 200) {

                mdlBtnCancelAddCluster.innerHTML = "Tutup";

                showSuccessAlert(`Data berhasil disimpan`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
}

function doEdit() {

    const id = $('#mdl-edit-cluster-id').val();
    const name = $('#mdl-edit-cluster-name').val();
    const description = $('#mdl_edit_description_cluster').val();
    const total_badroom = $('#mdl-edit-cluster-bedrooms').val();
    const total_bathroom = $('#mdl-edit-cluster-bathroom').val();
    const total_garage = $('#mdl-edit-cluster-garage').val();
    const area = $('#mdl-edit-cluster-area').val();
    const building_area = $('#mdl-edit-cluster-home').val();
    const isEditImage = document.getElementById('btn-switch-block').checked
    var img1 = $('#logo_klaster_1').prop('files')[0];
    var img2 = $('#logo_klaster_2').prop('files')[0];
    var img3 = $('#logo_klaster_3').prop('files')[0];
    var img4 = $('#logo_klaster_4').prop('files')[0];
    var img5 = $('#logo_klaster_5').prop('files')[0];
    var facilities = $('#mdl_edit_clusters_facility').val();

    var formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('total_badroom', total_badroom);
    formData.append('total_bathroom', total_bathroom);
    formData.append('total_garage', total_garage);
    formData.append('area', area);
    formData.append('building_area', building_area);
    formData.append('isEditImage', isEditImage);
    formData.append('file', img1);
    formData.append('file', img2);
    formData.append('file', img3);
    formData.append('file', img4);
    formData.append('file', img5);
    formData.append('facilities', facilities);

    $.ajax({
        method: "PUT",
        url: `${CLUSTER_URL}/${id}`,
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
                $('#mdl-edit-cluster').modal('toggle');

                //replace with new data
                const id = response.data.id;
                $('#cluster_name_' + id).text(response.data.name)
                $('#cluster_description_' + id).text(response.data.description)
                $('#cluster_badroom_' + id).text(response.data.total_badroom)
                $('#cluster_bathroom_' + id).text(response.data.total_bathroom)
                $('#cluster_garage_' + id).text(response.data.total_garage)
                $('#cluster_area_' + id).text(response.data.area)
                $('#cluster_building_' + id).text(response.data.building_area)

                showSuccessAlert(`Data berhasil diubah`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });

}

function addImageInput(response) {

    $('#mdl_edit_clusters_facility').val(0).trigger('change');
    $("#img-1").css("background-image", "url()");
    $("#img-2").css("background-image", "url()");

    if (response.data.cluster_img.length > 0) {
        let idx = 1;
        response.data.cluster_img.forEach(element => {
            $("#img-" + idx).css("background-image", "url(/metroland/assets/img_cluster/" + element.image + ")");
            $('#btn-remove-cluster-' + idx).attr('data-cluster_image_id', element.id);
            idx++;
        });
    }

    let facilityIds = [];
    response.data.facilities.forEach(facility => {
        facilityIds.push(facility.id);
    });
    $("#mdl_edit_clusters_facility").val(facilityIds).trigger('change');
}

function getAccessByCluster(clusterId) {
    $.ajax({
        method: "GET",
        url: `${CLUSTER_API}/access/${clusterId}/cluster_id`,
        headers: {
            'CSRF-Token': token
        }
    })
        .done((response) => {

            $("#tbl-access tbody").empty();

            if (response.code == 200 && response.data.length > 0) {

                response.data.forEach(acc => {
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
                            <option value="tol.png">Pintu Tol</option>
                            <option value="halte busway.png">Halte Busway</option>
                            <option value="stasiun.png">Stasiun</option>
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

                    $('#access_icon_' + acc.id).val(acc.image).change();
                })
            }


        }).fail((error) => {
            showErrorAlert(error);
        });
}

function delAccessCluster(accessId) {
    $.ajax({
        method: "DELETE",
        url: `${CLUSTER_API}/access/${accessId}`,
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

$('#btn-switch-block').click(function () {

    if (this.checked) {
        blockUI.release();
    } else {
        blockUI.block();
    }
});