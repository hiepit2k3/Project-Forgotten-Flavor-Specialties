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
        let productList = $('#product-list');
        try {
            $.ajax({
                url: `${window.domain_backend}/product`,
                type: "GET",
                success: function (response) {
                    console.log(response.data.data_result);
                    let products = response.data.data_result;
                    // Lặp qua các sản phẩm và thêm vào HTML
                    products.forEach(product => {
                        let productHTML = `
                        <div class="col-md-6 col-lg-4 col-xl-3">
                            <div class="rounded position-relative fruite-item">
                                <div class="fruite-img">
                                    <img src="${product.image}" class="img-fluid w-100 rounded-top" alt="">
                                </div>
                                <div class="text-white bg-secondary px-3 py-1 rounded position-absolute" style="top: 10px; left: 10px;">
                                    Fruits
                                </div>
                                <div class="p-4 border border-secondary border-top-0 rounded-bottom">
                                    <h4>${product.name}</h4>
                                    <p>${product.description}</p>
                                    <div class="d-flex justify-content-between flex-lg-wrap">
                                        <p class="text-dark fs-5 fw-bold mb-0">$${product.price} / kg</p>
                                        <button data-id="${product.id}" class="clickable-addcart btn border border-secondary rounded-pill px-3 text-primary">
    <i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
</button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                        // Thêm sản phẩm vào danh sách
                        productList.append(productHTML);
                    });
                },
                error: function (xhr, status, error) {
                    toastr.error("Không có dữ liệu!");
                },
            });
        } catch (e) {
            toastr.error("Máy chủ bị lỗi!");
        }
    });

    // them san pham vao gio hang neu nguoi dung chua dang nhap thi luu vao local 
    $(document).ready(function () {
        var token = getCookie('ga')
        $(document).on('click', '.clickable-addcart', function () {
            var productId = $(this).data('id');
            var product = {
                name: $(this).closest('.fruite-item').find('h4').text(),
                description: $(this).closest('.fruite-item').find('p').first().text(),
                price: $(this).closest('.fruite-item').find('.fs-5').text().replace('$', '').replace(' / kg', ''),
                image: $(this).closest('.fruite-item').find('img').attr('src'),
                quantity: 1,
                product_id: productId,
            };
            if (getCookie('ga') == null) {
                // Lấy giỏ hàng hiện tại từ Local Storage
                var cart = JSON.parse(localStorage.getItem('cart')) || [];

                // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
                var existingProduct = cart.find(item => item.product_id == productId);

                if (existingProduct) {
                    // Nếu sản phẩm đã tồn tại, tăng quantity lên 1
                    existingProduct.quantity += 1;
                } else {
                    // Nếu sản phẩm chưa tồn tại, thêm sản phẩm vào giỏ hàng
                    cart.push(product);
                }

                // Lưu giỏ hàng mới vào Local Storage
                localStorage.setItem('cart', JSON.stringify(cart));
                total_product_in_cart();
                toastr.success("Thêm sản phẩm vào giỏ hàng thành công")
            } else {
                $.ajax({
                    url: `${window.domain_backend}/cart/add`,
                    type: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(product),
                    success: function (response) {
                        total_product_in_cart()
                        toastr.success("Thêm sản phẩm vào giỏ hàng thành công")
                    },
                    error: function (xhr, status, error) {
                        toastr.error("Không có dữ liệu!");
                    },
                });
            }
        });
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
