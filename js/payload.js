$(document).ready(function () {
    // Lấy các tham số query string từ URL hiện tại
    const urlParams = new URLSearchParams(window.location.search);

    // Lấy giá trị của các tham số
    const vnp_TxnRef = urlParams.get('vnp_TxnRef');
    const vnp_Amount = urlParams.get('vnp_Amount');
    const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');

    if (vnp_ResponseCode === '00') {
        alert("ok");
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
        `
        $('#result-payment').append(payment_success);
    }
    else {
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
        `
        $('#result-payment').append(payment_fail);
    }
    // Hiển thị các giá trị trên trang
    $('#txnRef').text(`Transaction Reference: ${vnp_TxnRef}`);
    $('#amount').text(`Amount: ${vnp_Amount}`);
});