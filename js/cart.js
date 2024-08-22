$(document).ready(function () {
    var data_cart;
    var shipping_address;
    var data_shipping_to_api;
    function formatNumberWithDots(number) {
        let numStr = number.toString();
        let parts = numStr.split('.');
        let integerPart = parts[0];
        let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        let decimalPart = parts[1] ? '.' + parts[1] : '';
        return formattedInteger + decimalPart;
    }

    function renderCart() {
        var token = getCookie('ga');
        if (checklogin()) {
            try {
                $.ajax({
                    url: `${window.domain_backend}/cart`,
                    type: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    success: function (response) {
                        console.log(response);
                        if (response.status_code === 200) {
                            console.log(response.data);
                            data_cart = response.data;
                            $('#cart-items').empty();
                            load_data_cart(data_cart);
                            var totalPriceProduct = calculateTotal(data_cart);
                            var totalPrice = calculateTotal(data_cart) + 30000;
                            $('#total-price-product').text(formatNumberWithDots(totalPriceProduct) + ' VND');
                            $('#total-price').text(formatNumberWithDots(totalPrice) + ' VND');
                        }
                    },
                    error: function (xhr, status, error) {
                        $('#cart-items').append('<p>Giỏ hàng trống</p>');
                        return;
                    },
                });
            } catch (e) {
                toastr.error(e);
            }
        } else {
            data_cart = JSON.parse(localStorage.getItem('cart')) || [];
            $('#cart-items').empty();
            if (data_cart.length === 0) {
                $('#cart-items').append('<p>Giỏ hàng trống</p>');
                return;
            }
            load_data_cart(data_cart);
            var totalPriceProduct = calculateTotal(data_cart);
            var totalPrice = calculateTotal(data_cart) + 30000;
            $('#total-price-product').text(formatNumberWithDots(totalPriceProduct) + ' VND');
            $('#total-price').text(formatNumberWithDots(totalPrice) + ' VND');
        }
    }

    function data_shipping_address() {
        if (checklogin()) {
            var token = getCookie('ga');
            try {
                $.ajax({
                    url: `${window.domain_backend}/shipping-address`,
                    type: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    success: function (response) {
                        console.log(response);
                        if (response.status_code === 200) {
                            data_shipping_to_api = response.data;
                            load_data_shipping(data_shipping_to_api);
                        }
                    },
                    error: function (xhr, status, error) {
                        $('#item-shipping-address').append('<p>Giỏ hàng trống</p>');
                        return;
                    },
                });
            } catch (e) {
                toastr.error(e);
            }
        } else {
            $('#item-shipping-address').append('<p>Vui lòng đăng nhập trước</p>');
        }
    }

    function data_method_payment() {
        try {
            $.ajax({
                url: `${window.domain_backend}/payment`,
                type: "GET",
                success: function (response) {
                    console.log(response);
                    if (response.status_code === 200) {
                        console.log(response.data);
                        response.data.forEach(function (payment) {
                            var payment_data = `
                            <div class="form-check">
                                    <input class="form-check-input" type="radio" name="paymentMethod" id="creditCard"
                                        value="${payment.id}">
                                    <label class="form-check-label" for="creditCard">
                                        <img src="${payment.image}" alt="Payment method" class="img-fluid"
                                            style="max-height: 50px;">
                                        ${payment.name}
                                    </label>
                            </div>
                            `;
                            $('#payment-methods').append(payment_data);
                        })
                    }
                },
                error: function (xhr, status, error) {
                    $('#item-shipping-address').append('<p>Giỏ hàng trống</p>');
                    return;
                },
            });
        } catch (e) {
            toastr.error(e);
        }
    }

    function load_data_shipping(data) {
        data.forEach(function (shipping) {
            var shippingHtml = `<li id="${shipping.id}" class="list-group-item list-group-item-action" data-address="Số 123, Đường A, Quận B, Thành phố C">${shipping.street_address}, ${shipping.ward}, ${shipping.district}, ${shipping.city}</li>
        `;
            $('#item-shipping-address').append(shippingHtml);
        })
    }

    function load_data_cart(cart) {
        cart.forEach(function (product) {
            var productHtml = `
            <div class="row">
                <div class="col-lg-3 col-md-12 mb-4 mb-lg-0">
                    <div class="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                        <img src="${product.image}" class="w-100" alt="Product Image" />
                        <a href="#!">
                            <div class="mask" style="background-color: rgba(251, 251, 251, 0.2)"></div>
                        </a>
                    </div>
                </div>
                <div class="col-lg-5 col-md-6 mb-4 mb-lg-0">
                    <p><strong>${product.name}</strong></p>
                    <p><strong>Trọng lượng trung bình: ${product.average_weight} Kg</strong></p>
                    <button type="button" data-id="${product.product_id}" class="clickable-remove btn btn-primary btn-sm me-1 mb-2" data-mdb-tooltip-init title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button type="button" class="btn btn-danger btn-sm mb-2" data-mdb-tooltip-init title="Move to the wish list">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
                    <div class="d-flex mb-4 button-product" style="max-width: 300px;">
                        <button class="btn btn-primary px-3 me-2 step-down" data-id="${product.product_id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <div class="form-outline">
                            <input id="quantity-${product.product_id}" min="1" name="quantity" value="${product.quantity}" type="number" class="form-control quantity-input" data-id="${product.product_id}" />
                            <label class="form-label" for="quantity-${product.id}">Số Lượng</label>
                        </div>
                        <button class="btn btn-primary px-3 ms-2 step-up" data-id="${product.product_id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
            <hr class="my-4" />
        `;
            $('#cart-items').append(productHtml);
        });
    }



    function calculateTotal(cart) {
        let total = 0;
        cart.forEach(function (product) {
            total += product.price * product.quantity;
        });
        return total;
    }

    function updateCart(productId, newQuantity) {
        if (checklogin()) {
            var token = getCookie('ga');
            $.ajax({
                url: `${window.domain_backend}/cart/update/${productId}`,
                type: "PATCH",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    quantity: newQuantity
                }),
                success: function (response) {
                    if (response.status_code === 200) {

                        var totalPriceProduct = calculateTotal(data_cart);
                        var totalPrice = calculateTotal(data_cart) + 30000;
                        $('#total-price-product').text(formatNumberWithDots(totalPriceProduct) + ' VND');
                        $('#total-price').text(formatNumberWithDots(totalPrice) + ' VND');
                    }
                },
                error: function (xhr, status, error) {
                    toastr.error('Có lỗi xảy ra khi cập nhật giỏ hàng');
                }
            });
        } else {
            var product = data_cart.find(data => data.product_id === productId);
            if (product) {
                product.quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(data_cart));
                // renderCart();
            }
        }
    }


    function removeProduct(productId) {
        if (checklogin()) {
            var token = getCookie('ga');
            $.ajax({
                url: `${window.domain_backend}/cart/remove/${productId}`,
                type: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    product_id: productId
                }),
                success: function (response) {
                    if (response.status_code === 200) {
                        total_product_in_cart()
                        $('#cart-items').empty();
                        load_data_cart(data_cart);
                        toastr.success('Xóa sản phẩm thành công');
                    }
                },
                error: function (xhr, status, error) {
                    toastr.error('Có lỗi xảy ra khi xóa sản phẩm');
                }
            });
        }
    }

    function updateQuantityInCart(productId, newQuantity) {
        var product = data_cart.find(product => product.product_id == productId);
        if (product) {
            product.quantity = newQuantity;
        }
    }

    function removeProductById(id) {
        var index = data_cart.findIndex(product => product.product_id === id);
        if (index !== -1) {
            data_cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(data_cart));
            $('#cart-items').empty();
            load_data_cart(data_cart);
        }
        total_product_in_cart()
    }

    $(document).on('click', '.list-group-item-action', function () {
        let id = $(this).attr('id');
        shipping_address = data_shipping_to_api.find(item => item.id == id);
        console.log(shipping_address);
        $('#addressModal').modal('hide');
        $('#selected-address-text').text(`${shipping_address.street_address}, ${shipping_address.ward}, ${shipping_address.district}, ${shipping_address.city}`);
    });

    $(document).on('click', '.step-down', function () {
        var productId = $(this).data('id');
        var quantityInput = $(`input[data-id=${productId}]`);
        var newQuantity = parseInt(quantityInput.val()) - 1;
        if (newQuantity >= 1) {
            updateQuantityInCart(productId, newQuantity);
            var totalPriceProduct = calculateTotal(data_cart);
            var totalPrice = calculateTotal(data_cart) + 30000;
            $('#total-price-product').text(formatNumberWithDots(totalPriceProduct) + ' VND');
            $('#total-price').text(formatNumberWithDots(totalPrice) + ' VND');
            quantityInput.val(newQuantity);
            updateCart(productId, newQuantity);
        }
    });

    $(document).on('click', '.step-up', function () {
        var productId = $(this).data('id');
        var quantityInput = $(`input[data-id=${productId}]`);
        var newQuantity = parseInt(quantityInput.val()) + 1;
        updateQuantityInCart(productId, newQuantity);
        var totalPriceProduct = calculateTotal(data_cart);
        var totalPrice = calculateTotal(data_cart) + 30000;
        $('#total-price-product').text(formatNumberWithDots(totalPriceProduct) + ' VND');
        $('#total-price').text(formatNumberWithDots(totalPrice) + ' VND');
        quantityInput.val(newQuantity);
        updateCart(productId, newQuantity);
    });

    $(document).on('change', '.quantity-input', function () {
        var productId = $(this).data('id');
        var newQuantity = parseInt($(this).val());
        if (newQuantity >= 0) {
            updateCart(productId, newQuantity);
        }
    });

    $(document).on('click', '.clickable-remove', function () {
        var productId = $(this).data('id');
        removeProductById(productId)
        var totalPriceProduct = calculateTotal(data_cart);
        var totalPrice = calculateTotal(data_cart) + 30000;
        $('#total-price-product').text(formatNumberWithDots(totalPriceProduct) + ' VND');
        $('#total-price').text(formatNumberWithDots(totalPrice) + ' VND');
        removeProduct(productId);
    });

    function payment_and_order(cart) {
        let amount = calculateTotal(data_cart) + 30000;
        // Lấy giá trị của ô radio đã chọn
        let payment_method_id = $('input[name="paymentMethod"]:checked').val();
        if (typeof shipping_address === 'undefined') {
            $('#spinner').hide();
            $('#send_order').removeAttr('disabled').text('Thanh toán ngay');
            toastr.warning('Vui lòng chọn địa chỉ nhận hàng của bạn!');
            return 0;
        }
        let shipping_id = shipping_address.id
        let product_list = data_cart;
        if (typeof payment_method_id === 'undefined') {
            $('#spinner').hide();
            $('#send_order').removeAttr('disabled').text('Thanh toán ngay');
            toastr.warning('Vui lòng chọn phương thức thanh toán của bạn!');
            return 0;
        }
        var token = getCookie('ga');
        try {
            $.ajax({
                url: `${window.domain_backend}/generate_qr`,
                type: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    order: {
                        total_amount: amount,
                        shipping_address_id: shipping_id,
                        payment_method_id: payment_method_id,
                    },
                    order_details: product_list
                }),
                success: function (response) {
                    // console.log(response);
                    if (response.status_code === 200) {
                        window.location.href = response.data.payment_url;
                    }
                    else if (response.status_code === 201) {
                        window.location.href = response.data.url;
                    }
                },
                error: function (xhr, status, error) {
                    $('#spinner').hide();
                    $('#send_order').removeAttr('disabled').text('Thanh toán ngay');
                    $('#item-shipping-address').append('<p>Giỏ hàng trống</p>');
                    return;
                },
            });
        } catch (e) {
            toastr.error(e);
        }
    }

    $(document).on('click', '#send_order', function () {
        $('#spinner').show();
        $(this).prop('disabled', true).text('Đang xử lý...');
        payment_and_order(data_cart);
    });


    renderCart();
    data_shipping_address();
    data_method_payment();
});
