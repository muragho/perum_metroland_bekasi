const navbar = document.getElementsByTagName('nav')[0];
window.addEventListener('scroll', function () {

    if (window.scrollY > 1) {
        navbar.classList.replace('bg-transparent', 'nav-color');
    } else if (this.window.scrollY <= 0) {
        navbar.classList.replace('nav-color', 'bg-transparent')
    }
});

// window.dataLayer = window.dataLayer || [];
// function gtag() { dataLayer.push(arguments); }
// gtag('js', new Date());

// gtag('config', 'G-SZMNDH08HM');

// !function (f, b, e, v, n, t, s) {
//     if (f.fbq) return; n = f.fbq = function () {
//         n.callMethod ?
//         n.callMethod.apply(n, arguments) : n.queue.push(arguments)
//     };
//     if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
//     n.queue = []; t = b.createElement(e); t.async = !0;
//     t.src = v; s = b.getElementsByTagName(e)[0];
//     s.parentNode.insertBefore(t, s)
// }(window, document, 'script',
//     'https://connect.facebook.net/en_US/fbevents.js');
// fbq('init', '3179564425509596');
// fbq('track', 'PageView');