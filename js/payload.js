$(document).ready(function () {
    try {
        var queryString = getCookie('data');
        var params = queryString.split('&').reduce(function (acc, param) {
            var [key, value] = param.split('=');
            acc[key] = value;
            return acc;
        }, {});

        // Sử dụng một hàm async bên trong ready function
        (async function () {

            var token = getCookie('ga');
            // Hàm kiểm tra mã đơn hàng tồn tại
            async function verifyTransaction(txnRef) {
                try {
                    const response = await $.ajax({
                        url: `${window.domain_backend}/order/check-order/${txnRef}`, // Thay bằng endpoint kiểm tra của bạn
                        type: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    if (response.data === true) {
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error("Error verifying transaction:", error);
                    return false;
                }
            }
            // Kiểm tra mã đơn hàng
            const transactionExists = await verifyTransaction(params.code_order);
            if (transactionExists) {
                if (params.status_order === '00') {
                    var payment_success = `
                <div class="container d-flex flex-column justify-content-center align-items-center"
                            style="height: 50vh;">
                    <div class="text-center border border-success shadow p-4 rounded">
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
                    deleteCookie('data');
                } else {
                    var payment_fail = `
                    <div class="container d-flex flex-column justify-content-center align-items-center" style="height: 50vh;">
                        <div class="text-center border border-danger shadow p-4 rounded">
                            <div class="display-1 text-error">
                                <i class="bi bi-x-circle text-danger"></i>
                            </div>
                            <h1 class="mt-4">Thanh Toán Thất Bại!</h1>
                            <p class="lead">Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.</p>
                            <a href="/cart" class="btn btn-primary mt-3">Thử lại</a>
                            <a href="/" class="btn btn-secondary mt-3">Quay lại trang chủ</a>
                        </div>
                    </div>
                `;
                    $('#result-payment').empty();
                    $('#result-payment').append(payment_fail);
                    deleteCookie('data');
                }
                $('#txnRef').text(`Transaction Reference: ${params.code_order}`);
                $('#amount').text(`Amount: ${params.total_amount}`);
            }
        })(); // Gọi hàm async ngay lập tức
    } catch (err) {
        var html = `<div class="container d-flex flex-column justify-content-center align-items-center" style="height: 50vh;">
                        <div class="text-center border border-warning shadow p-4 rounded">
                            <div class="display-1 text-warning">
                                <i class="bi bi-exclamation-circle"></i>
                            </div>
                            <h1 class="mt-4">Thông Báo!</h1>
                            <p class="lead">Đơn hàng của bạn đã được thanh toán hoặc không tồn tại.</p>
                            <a href="/cart" class="btn btn-primary mt-3">Thử lại</a>
                            <a href="/" class="btn btn-secondary mt-3">Quay lại trang chủ</a>
                        </div>
                    </div>
        `;
        $('#result-payment').empty();
        $('#result-payment').append(html);
    }

});

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;';
}