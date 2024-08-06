function load_data_product_index() {
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
}

// them san pham vao gio hang neu nguoi dung chua dang nhap thi luu vao local 
$(document).ready(function () {
    var token = getCookie('ga')
    $(document).on('click', '.clickable-addcart', function () {
        var productId = $(this).data('id');
        var product = {
            name: $(this).closest('.fruite-item').find('h4').text(),
            // description: $(this).closest('.fruite-item').find('p').first().text(),
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


    load_data_product_index();
});