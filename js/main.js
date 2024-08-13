(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 2
            },
            1200: {
                items: 2
            }
        }
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });

    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });



    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });

    // Product loading
    $(document).ready(function () {
        // kiem tra login hay chua
        if (checklogin()) {
            $('#user-menu').show();
            $('#a-login').hide();
            $('#a-register').hide();
        } else {
            $('#user-menu').hide();
            $('#a-login').show();
            $('#a-register').show();
        }
        // check  số lượng sản phẩm trong giỏ hàng
        total_product_in_cart()
        // load product pages to the index.html
    });

})(jQuery);

function total_product_in_cart() {
    if (getCookie('ga') == null) {
        // Lấy dữ liệu từ localStorage
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            // Chuyển đổi dữ liệu từ JSON sang mảng JavaScript
            const cart = JSON.parse(cartData);

            // Đếm số lượng đối tượng trong giỏ hàng
            const numberOfItems = cart.length;
            console.log(numberOfItems);
            $('#total-product-in-cart').text(numberOfItems)
        } else {
            $('#total-product-in-cart').text("0")
        }
    } else {
        var token = getCookie('ga')
        $.ajax({
            url: `${window.domain_backend}/cart/total-cart`,
            type: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (response) {
                let total = response.data.total_cart;
                $('#total-product-in-cart').text(total)
            }
        });
    }
}

function checklogin() {
    if (getCookie("ga") != null) {
        return true;
    } else {
        return false;
    }
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function checkLocal() {
    var token = getCookie('ga')
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartData != null) {
        $.ajax({
            url: `${window.domain_backend}/cart/add`,
            type: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(cartData),
            success: function (response) {
            },
            error: function (xhr, status, error) {
                toastr.error("Không có dữ liệu!");
            },
        });
    }
}
