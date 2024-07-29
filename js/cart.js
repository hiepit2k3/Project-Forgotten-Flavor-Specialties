$(document).ready(function () {
    var data_cart ;
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
                    <p>Color: ${product.color}</p>
                    <p>Size: ${product.size}</p>
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
                        // toastr.success('Cập nhật giỏ hàng thành công');
                        // renderCart();
                    }
                },
                error: function (xhr, status, error) {
                    toastr.error('Có lỗi xảy ra khi cập nhật giỏ hàng');
                }
            });
        } else {
            // var cart = JSON.parse(localStorage.getItem('cart')) || [];
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
                        console.log("data sau khi xoa voi api",data_cart);
                        toastr.success('Xóa sản phẩm thành công');
                        // renderCart();
                    }
                },
                error: function (xhr, status, error) {
                    toastr.error('Có lỗi xảy ra khi xóa sản phẩm');
                }
            });
        } else {
            toastr.error('Có lỗi xảy ra khi xóa sản phẩm');
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
        if (index === -1) {
            data_cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(data_cart));
            console.log("data sau khi xoa voi js",data_cart);
        }
        total_product_in_cart()
        // load_data_cart(data_cart)
    }

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

    function payment_and_order(cart){
        let amount = $('#total-price').text();
        // Lấy giá trị của ô radio đã chọn
        let payment_method_id = $('input[name="paymentMethod"]:checked').val();
        console.log(amount);
        console.log(payment_method_id);
    }

    $(document).on('click', '#send_order', function () {
        payment_and_order(data_cart);
    });

    renderCart();
});
