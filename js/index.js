// them san pham vao gio hang neu nguoi dung chua dang nhap thi luu vao local 
$(document).ready(function () {
    var products;
    let productList = $('#product-list');
    try {
        $.ajax({
            url: `${window.domain_backend}/product`,
            type: "GET",
            success: function (response) {
                console.log(response.data.data_result);
                products = response.data.data_result;
                // Lặp qua các sản phẩm và thêm vào HTML
                products.forEach(product => {
                    let formattedPrice = formatPrice(product.price);
                    let productHTML = `
                    <div class="col-md-6 col-lg-4 col-xl-3">
                        <div class="rounded position-relative fruite-item">
                            <div class="fruite-img">
                                <img src="${product.image}" class="img-fluid w-100 rounded-top" alt="" style="  height:300px">
                            </div>
                            <div class="text-white bg-secondary px-3 py-1 rounded position-absolute" style="top: 10px; left: 10px;">
                                Fruits
                            </div>
                            <div class="p-4 border border-secondary border-top-0 rounded-bottom">
                                <h4>${product.name}</h4>
                                <p>${product.description}</p>
                                <div class="d-flex justify-content-between flex-lg-wrap">
                                    <p class="text-dark fs-5 fw-bold mb-0">${formattedPrice} VND / kg</p>
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

    var token = getCookie('ga')
    $(document).on('click', '.clickable-addcart', function () {
        var productId = $(this).data('id');
        console.log(products);
        var product_data = products.find(item => item.id === productId);

        console.log(product_data);

        var product = {
            name: product_data.name,
            // description: $(this).closest('.fruite-item').find('p').first().text().trim(), // Đã kích hoạt lại nếu cần
            price: product_data.price,
            image: product_data.image,
            average_weight: product_data.average_weight,
            quantity: 1,
            product_id: productId
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
            alert(productId);
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

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}