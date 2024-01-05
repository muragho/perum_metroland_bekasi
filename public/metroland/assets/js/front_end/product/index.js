
const CLUSTER_API = '/api/v1/clusters'
var cluster = document.querySelector('meta[name="first_cluster"]').getAttribute('content');

$(document).ready(function () {
    setClusterFacility(cluster);
    AOS.init({
        disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
        startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
        initClassName: 'animasi', // class applied after initialization
        animatedClassName: 'animasi', // class applied on animation
        useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
        disableMutationObserver: false, // disables automatic mutations' detections (advanced)
        debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
        throttleDelay: 99,
    });
    checkforvideo();
});

var video = document.getElementById("my_video");
video.addEventListener('loadeddata', (e) => {
    if (video.readyState >= 3) {
        $('.spinner-grow').hide();
    }

});
function checkforvideo() {
    var b = setInterval(() => {
        if (video.readyState >= 3) {
            $('.spinner-grow').hide();
            clearInterval(b);
        }

    }, 500);
}

const btnTabCluster = document.getElementsByClassName("tab-cluster");


function formTabChangeCluster() {
    const clusterId = $(this).data("cluster_id");

    setClusterFacility(clusterId);

};

for (const element of btnTabCluster) {
    element.addEventListener("click", formTabChangeCluster);
}

function setClusterFacility(clusterId) {
    $.ajax({
        method: "GET",
        url: `${CLUSTER_API}/${clusterId}/facility`
    })
        .done((response) => {

            if (response.code == 200) {
                document.getElementById("facility-body").innerHTML = '';
                document.getElementById("access-body").innerHTML = '';

                let html = ``;
                response.data.facilities.forEach(element => {
                    html += `<div class="col-md-3 col-sm-6 mb-2">
                    <div class="card mx-auto">
                        <img src="/metroland/assets/img/${element.image}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${element.name}</h5>
                        </div>
                    </div>
                </div>`;
                });

                let htmlAccess = ``;
                response.data.access.forEach(element => {

                    htmlAccess += `<div class="col-md-4 col-sm-6">
                    <div class="symbol symbol-50px symbol-circle"><img class="symbol-label"
                            src="/metroland/assets/img/${element.image}"></div>
                    <h2>${element.title}</h2>
                    <p>${element.description}</p>
                </div>`;
                })

                document.getElementById("facility-body").innerHTML = html;
                document.getElementById("access-body").innerHTML = htmlAccess;
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
}

$('.pop').on('click', function () {
    $('.imagepreview').attr('src', $(this).find('img').attr('src'));
    $('#imagemodal').modal('show');
});
$(window).scroll(function () {
    if ($(window).scrollTop() > 10) {
        document.getElementById('btn_scroll_down').style.visibility = "hidden";
    } else {
        document.getElementById('btn_scroll_down').style.visibility = "visible";
    }
})