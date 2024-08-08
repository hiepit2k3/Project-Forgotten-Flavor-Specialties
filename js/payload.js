$(document).ready(function () {
    // Sử dụng một hàm async bên trong ready function
    (async function () {
        const urlParams = new URLSearchParams(window.location.search);

        const vnp_TxnRef = urlParams.get('vnp_TxnRef');
        const vnp_Amount = urlParams.get('vnp_Amount');
        const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');
        var token = getCookie('ga');
        // Hàm kiểm tra mã đơn hàng tồn tại
        async function verifyTransaction(txnRef) {
            try {
                const response = await $.ajax({
                    url: `${window.domain_backend}/order/check-order/${txnRef}`, // Thay bằng endpoint kiểm tra của bạn
                    type: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
                return response.exists;
            } catch (error) {
                console.error("Error verifying transaction:", error);
                return false;
            }
        }

        // Kiểm tra mã đơn hàng
        const transactionExists = await verifyTransaction(vnp_TxnRef);

        if (transactionExists) {
            if (vnp_ResponseCode === '00') {
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
                $('#result-payment').append(payment_fail);
            }
            $('#txnRef').text(`Transaction Reference: ${vnp_TxnRef}`);
            $('#amount').text(`Amount: ${vnp_Amount}`);
        } else {
            alert("Mã đơn hàng không tồn tại.");
            window.location.href = '/'; // Chuyển hướng về trang chủ hoặc trang lỗi
        }
    })(); // Gọi hàm async ngay lập tức
});
