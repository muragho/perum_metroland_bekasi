
KTUtil.onDOMContentLoaded(function () {
    $("#menu_news").addClass("active");
});

const NEWS_API = "/auth/news"
var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
// var image = document.querySelector('meta[name="image"]').getAttribute('content');

const addNews = document.getElementById('btn-add-news');
const mdlBtnAddNews = document.getElementById('mdl-btn-add-news');
const btnEditNews = document.getElementsByClassName('btn-edit-news')
const btnRemoveThubnail = document.getElementById("btn-remove-thubnail");
const btnMdlEditNews = document.getElementById("btn-mdl-edit-news");
const btnCancelEditNews = document.getElementById("btn-cancel-edit-news");


addNews.addEventListener('click', function (e) {
    e.preventDefault();

    $('#mdl-add-news').modal('show');
});

var myEditor;
ClassicEditor
    .create(document.querySelector('#mdl_add_content_news'), {
        ckfinder: {
            uploadUrl: `/auth/news/upload`,
        }
    })
    .then(editor => {
        myEditor = editor;
    })
    .catch(error => {
        console.error(error);
    });

var myEditorEdit;
ClassicEditor
    .create(document.querySelector('#mdl_edit_content_news'), {
        ckfinder: {
            uploadUrl: `/auth/news/upload`,
        }
    })
    .then(editor => {
        myEditorEdit = editor;
    })
    .catch(error => {
        console.error(error);
    });

mdlBtnAddNews.addEventListener("click", function (e) {
    e.preventDefault();

    const x = myEditor.getData();
    console.log(x)
    $('#mdl-form-add-news').submit()
})

btnRemoveThubnail.addEventListener("click", function (e) {
    e.preventDefault();
    const id = $(this).data("news_id");
    console.log("id: " + id)

    $.ajax({
        method: "DELETE",
        url: `${NEWS_API}/api/v1/image_thubnail/${id}/news`,
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


})

btnCancelEditNews.addEventListener("click", function (e) {
    e.preventDefault();

    $('#mdl-edit-news').modal('toggle');

    location.reload();
})

function formEditNews() {
    $("#img-thubnail").css("background-image", "url()");

    const id = $(this).data("news_id");
    const title = $(this).data("title");
    const description = $(this).data("description");
    const thubnail = $(this).data("thubnail");

    if (thubnail != '' && thubnail != null) {
        $("#img-thubnail").css("background-image", "url(/metroland/assets/image_news_thubnail/" + thubnail + ")");
        $('#btn-remove-thubnail').attr('data-news_id', id);
    }

    $('#news_id').val(id);
    $('#mdl-edit-news-title').val(title);
    myEditorEdit.setData(description);

    $('#mdl-edit-news').modal('show');

};

for (const element of btnEditNews) {
    element.addEventListener("click", formEditNews);
}

btnMdlEditNews.addEventListener("click", function (e) {
    e.preventDefault();

    const id = $('#news_id').val();
    const title = $('#mdl-edit-news-title').val();
    const description = myEditorEdit.getData();
    var thubnail = $('#thubnail-edit').prop('files')[0];

    var formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', thubnail);

    $.ajax({
        method: "PUT",
        url: `${NEWS_API}/api/v1/${id}`,
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

                btnCancelEditNews.innerHTML = "Tutup";
                showSuccessAlert(`Data berhasil diubah`);
            } else {
                showErrorAlert(response.message);
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
})