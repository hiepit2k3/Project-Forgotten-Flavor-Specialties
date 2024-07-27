$(document).ready(function () {
    function formatNumberWithDots(number) {
        let numStr = number.toString();
        let parts = numStr.split('.');
        let integerPart = parts[0];
        let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        let decimalPart = parts[1] ? '.' + parts[1] : '';
        return formattedInteger + decimalPart;
    }
    function renderCart() {
        var cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Xóa nội dung hiện tại của phần tử #cart-items
        $('#cart-items').empty();

        // Kiểm tra nếu giỏ hàng trống
        if (cart.length === 0) {
            $('#cart-items').append('<p>Giỏ hàng trống</p>');
            return;
        }

        // Duyệt qua giỏ hàng và thêm các mục sản phẩm vào HTML
        cart.forEach(function (product) {
            var productHtml = `
                <div class="row">
                    <div class="col-lg-3 col-md-12 mb-4 mb-lg-0">
                        <!-- Image -->
                        <div class="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                            <img src="${product.image}" class="w-100" alt="Product Image" />
                            <a href="#!">
                                <div class="mask" style="background-color: rgba(251, 251, 251, 0.2)"></div>
                            </a>
                        </div>
                        <!-- Image -->
                    </div>

                    <div class="col-lg-5 col-md-6 mb-4 mb-lg-0">
                        <!-- Data -->
                        <p><strong>${product.name}</strong></p>
                        <p>Color: ${product.color}</p>
                        <p>Size: ${product.size}</p>
                        <button type="button" data-id="${product.id}" class="clickable-remove btn btn-primary btn-sm me-1 mb-2" data-mdb-tooltip-init title="Remove item">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm mb-2" data-mdb-tooltip-init title="Move to the wish list">
                            <i class="fas fa-heart"></i>
                        </button>
                        <!-- Data -->
                    </div>

                    <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
                        <!-- Quantity -->
                        <div class="d-flex mb-4 button-product" style="max-width: 300px;">
                            <button class="btn btn-primary px-3 me-2 step-down" data-id="${product.id}">
                                <i class="fas fa-minus"></i>
                            </button>

                            <div class="form-outline">
                                <input id="quantity-${product.id}" min="0" name="quantity" value="${product.quantity}" type="number" class="form-control quantity-input" data-id="${product.id}" />
                                <label class="form-label" for="quantity-${product.id}">Số Lượng</label>
                            </div>

                            <button class="btn btn-primary px-3 ms-2 step-up" data-id="${product.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <!-- Quantity -->

                        <!-- Price -->
                        <p class="text-start text-md-center">
                           
                        </p>
                        <!-- Price -->
                    </div>
                </div>
                <hr class="my-4" />
            `;

            $('#cart-items').append(productHtml);
        });

        // Tính tổng tiền
        var totalPriceProduct = calculateTotal(cart);
        var totalPrice = calculateTotal(cart) + 30000;
        $('#total-price-product').text(formatNumberWithDots(totalPriceProduct) + ' VND');
        $('#total-price').text(formatNumberWithDots(totalPrice) + ' VND');

    }

    function calculateTotal(cart) {
        let total = 0;

        cart.forEach(function (product) {
            total += product.price * product.quantity;
        });

        return total;
    }

    function updateCart(productId, newQuantity) {
        var cart = JSON.parse(localStorage.getItem('cart')) || [];
        var product = cart.find(product => product.id === productId);

        if (product) {
            product.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Cập nhật tổng tiền
        var totalPriceProduct = calculateTotal(cart);
        var totalPrice = calculateTotal(cart) + 30000;
        $('#total-price-product').text(formatNumberWithDots(totalPriceProduct) + ' VND');
        $('#total-price').text(formatNumberWithDots(totalPrice) + ' VND');
    }

    $(document).on('click', '.step-down', function () {
        var productId = $(this).data('id');
        var quantityInput = $(`input[data-id=${productId}]`);
        var newQuantity = parseInt(quantityInput.val()) - 1;

        if (newQuantity >= 0) {
            quantityInput.val(newQuantity);
            updateCart(productId, newQuantity);
        }
    });

    $(document).on('click', '.step-up', function () {
        var productId = $(this).data('id');
        var quantityInput = $(`input[data-id=${productId}]`);
        var newQuantity = parseInt(quantityInput.val()) + 1;

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
        var cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Tìm chỉ mục của sản phẩm cần xóa
        var productIndex = cart.findIndex(product => product.id === productId);

        // Nếu sản phẩm được tìm thấy, xóa nó khỏi mảng giỏ hàng
        if (productIndex !== -1) {
            cart.splice(productIndex, 1);

            // Lưu lại giỏ hàng đã cập nhật vào Local Storage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Cập nhật giao diện người dùng
            renderCart();
        }
    });
    // Khởi tạo khi trang tải xong
    renderCart();
});
