$(document).ready(function () {
    (async function () {
        const urlParams = new URLSearchParams(window.location.search);
        // Hàm kiểm tra mã đơn hàng tồn tại
        var token = getCookie('ga');
        async function verifyTransaction(txnRef) {
            try {
                const response = await $.ajax({
                    url: `${window.domain_backend}/order/check-order/${txnRef}`, // Thay bằng endpoint kiểm tra của bạn
                    type: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                console.log(response);
                return response;
            } catch (error) {
                var payment_fail = `
                        <div class="container d-flex flex-column justify-content-center align-items-center" style="height: 100vh;">
                            <div class="text-center">
                                <div class="display-1 text-danger">
                                    <i class="bi bi-x-circle"></i>
                                </div>
                                <h1 class="mt-4">Thanh Toán Thất Bại!</h1>
                                <p class="lead">Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.</p>
                                <a href="/checkout" class="btn btn-primary mt-3">Thử lại</a>
                                <a href="/" class="btn btn-secondary mt-3">Quay lại trang chủ</a>
                            </div>
                        </div>`;
                $('#result-payment').empty();
                $('#result-payment').append(payment_fail);
            }
        }
        const data = await verifyTransaction(urlParams.get('code_order'))
        load_data_payment(data);
    })(); // Gọi hàm async ngay lập tức
});

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;';
}

function load_data_payment(data) {
    if (data.data.code_status == 0 || data.data.status_code == 1) {
        var payment_success = `
            <div class="container d-flex flex-column justify-content-center align-items-center"
                        style="height: 50vh;">
                <div class="text-center">
                    <div class="display-1 text-success">
                            <i class="bi bi-check-circle"></i>
                    </div>
                    <h1 class="mt-4">Thanh Toán Thành Công!</h1>
                    <p class="lead">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.</p>
                    <a href="/" class="btn btn-primary mt-3">Quay lại trang chủ</a>
                </div>
            </div>
            `;
        $('#result-payment').empty();
        $('#result-payment').append(payment_success);
    } else {
        var payment_fail = `
            <div class="container d-flex flex-column justify-content-center align-items-center" style="height: 100vh;">
                <div class="text-center">
                    <div class="display-1 text-danger">
                        <i class="bi bi-x-circle"></i>
                    </div>
                    <h1 class="mt-4">Thanh Toán Thất Bại!</h1>
                    <p class="lead">Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.</p>
                    <a href="/checkout" class="btn btn-primary mt-3">Thử lại</a>
                    <a href="/" class="btn btn-secondary mt-3">Quay lại trang chủ</a>
                </div>
            </div>
            `;
        $('#result-payment').empty();
        $('#result-payment').append(payment_fail);
    }
}