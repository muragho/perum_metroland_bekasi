
const CLUSTER_API = '/api/v1/clusters'
var cluster = document.querySelector('meta[name="first_cluster"]').getAttribute('content');
var productFacility = document.querySelector('meta[name="product_facility"]').getAttribute('content');
var productAccess = document.querySelector('meta[name="product_access"]').getAttribute('content');

$(document).ready(function () {
    setFacility(JSON.parse(productFacility));
    setAccess(JSON.parse(productAccess));
    setClusterFacility(cluster);
    // AOS.init({
    //     disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    //     startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
    //     initClassName: 'animasi', // class applied after initialization
    //     animatedClassName: 'animasi', // class applied on animation
    //     useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    //     disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    //     debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    //     throttleDelay: 99,
    // });
    checkforvideo();

});

// $(window).on('resize load', function () {
//     if ($(window).width() <= 922) {
//         console.log("remove class carousel-item")
//         const parent = document.getElementById('card-product-detail');
//         if (parent) {
//             const child = parent.querySelector('.carousel-item');
//             if (child) {
//                 child.classList.remove('carousel-item');
//             }
//         }

//     }
// });

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
    const lat = $(this).data("latitude");
    const long = $(this).data("longitude");
    console.log(lat)
    setClusterFacility(clusterId);
    // if (lat != '' && long != '') {
    //     reloadMap(-6.175403, 106.824584)
    // }
    // if ($(window).width() <= 922) {
    //     console.log("remove class carousel-item")
    //     const parent = document.getElementById('card-product-detail');
    //     if (parent) {
    //         const child = parent.querySelector('.carousel-item');
    //         if (child) {
    //             child.classList.remove('carousel-item');
    //         } else {
    //             console.log("child tidak ada")
    //         }
    //     } else {
    //         console.log("parent tidak ada")
    //     }
    // }

};

for (const element of btnTabCluster) {
    element.addEventListener("click", formTabChangeCluster);
}

function setFacility(facilities) {
    let html = '';

    facilities.forEach(element => {
        html += `
            <div class="col-md-3 col-sm-6 mb-2">
                    <div class="card mx-auto">
                        <a class="pop-zoom">
                            <img src="/metroland/assets/img/${element.image}" class="card-img-top">
                        </a>
                        <div class="card-body">
                            <h5 class="card-title">${element.name}</h5>
                        </div>
                    </div>
                </div>
        `;
    });

    document.getElementById("facility-body").innerHTML = html;
};

function setAccess(accesses) {
    let html = '';

    accesses.forEach(element => {
        if (element.access_icon != null) {
            html += `
                <div class="col-md-4 col-sm-6">
                    <div class="symbol symbol-50px symbol-circle"><img class="symbol-label"
                            src="/metroland/assets/img/${element.access_icon.icon}"></div>
                    <h2>${element.title}</h2>
                    <p>${element.description}</p>
                </div>
            `;
        };
    });

    document.getElementById("access-body").innerHTML = html;
};

function setClusterFacility(clusterId) {
    $.ajax({
        method: "GET",
        url: `${CLUSTER_API}/${clusterId}/facility`
    })
        .done((response) => {
            console.log("response : ", JSON.stringify(response))
            if (response.code == 200) {
                let clusterImages = '';
                response.data.cluster_images.forEach(element => {
                    clusterImages += `<div class="carousel-item carousel-item-mdl" id="img-${element.id}">
                    <div class="img-container1 pb-10">
                        <a class="pop pb-10">
                            <img src="/metroland/assets/img_cluster/${element.image}" class="img-product"
                                loading="lazy">
                        </a>
                    </div>
                </div>`
                })

                document.getElementById("clusterImage").innerHTML = clusterImages;


                $('.pop-facility').on('click', function () {
                    $('.imagepreview-facility').attr('src', $(this).find('img').attr('src'));
                    $('#imagemodal-facility').modal('show');
                });

                $('.pop-zoom').on('click', function () {
                    console.log("click")
                    $('.imagepreview-pa').attr('src', $(this).find('img').attr('src'));
                    $('#imagemodal-pa').modal('show');
                });
            }
        }).fail((error) => {
            showErrorAlert(error);
        });
}

$('.pop').on('click', function () {
    $(".carousel-item-mdl").removeClass("active");

    var id = $(this).find('img').attr('id');
    $("#img-" + id).addClass("active");
    $('.imagepreview').attr('src', $(this).find('img').attr('src'));
    $('#imagemodal').modal('show');
});

$('.pop-proyek-area').on('click', function () {
    console.log("click")
    $('.imagepreview-pa').attr('src', $(this).find('img').attr('src'));
    $('#imagemodal-pa').modal('show');
});

$(window).scroll(function () {
    if ($(window).scrollTop() > 10) {
        document.getElementById('btn_scroll_down').style.visibility = "hidden";
    } else {
        document.getElementById('btn_scroll_down').style.visibility = "visible";
    }
})

function reloadMap(lat, long) {
    var newLocation = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126934.52850657306!2d${lat}!3d${long}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698a4d1f38b353%3A0x69075bc2ab417320!2sKantor%20Pemasaran%20Victoria%20by%20METROLAND!5e0!3m2!1sid!2sid!4v1698081622789!5m2!1sid!2sid`;
    document.getElementById("mapView").src += newLocation;
    window.frames['mapView'].location.reload();
    // document.getElementById("mapView").reload(true);
}

// Get references to DOM elements
const zoomContainer = document.getElementById("zoomContainer"),
    zoomImage = document.getElementById("zoomImage"),
    boxes = document.querySelectorAll(".box"),
    zoomIn = document.getElementById("btn-zoom-in"),
    zoomOut = document.getElementById("btn-zoom-out");


let scl = 1.2;
let zoomRatio = 1

zoomOut.addEventListener("click", (e) => {

    console.log("out")
    if (scl <= 1.2) {
        zoomOut.disabled = true

    }
    zoomIn.disabled = false

    scl = scl - 0.2
    zoomImage.style.transform = `scale(${scl})`;
    zoomContainer.style.cursor = "zoom-out";
})

zoomIn.addEventListener("click", (e) => {
    zoomImage.style.transform = `scale(${scl})`;
    zoomImage.style.justifyContent = "left";
    zoomImage.style.transformOrigin = "top";

    // zoomContainer.style.height = "100vh";
    zoomContainer.style.display = "flex";
    zoomContainer.style.alignItems = "center";
    zoomContainer.style.justifyContent = "center";

    zoomContainer.style.cursor = "move";
    scl = scl + 0.2

    if (scl > 4) {
        zoomIn.disabled = true

    }
    zoomOut.disabled = false

    console.log(scl)
})




// Store original image source of the zoomContainer
let originalImageSrc = zoomImage.src;

// Add click event listeners to each box
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        // Swap image sources between clicked box and zoomContainer
        const clickedImage = box.querySelector("img");
        const tempImageSrc = clickedImage.src;

        clickedImage.src = originalImageSrc;
        zoomImage.src = tempImageSrc;

        originalImageSrc = zoomImage.src;
    });
});
