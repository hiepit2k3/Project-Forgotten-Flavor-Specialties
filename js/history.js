$(document).ready(function () {
  var token = getCookie("ga");
  var status = "all-orders";

  $('a[data-bs-toggle="tab"]').on("shown.bs.tab", function (e) {
    status = $(e.target).attr("href").substring(1);
    alert(status);
    call_api(status);
  });

  function call_api(status) {
    $.ajax({
      url: `${window.domain_backend}/order/history?status=${status}`,
      type: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (response) {
        console.log(response.data);
        load_data(response.data.order,response.data.order_detail)
      },
      error: function (xhr, status, error) {
        toastr.error("Không có dữ liệu!");
      },
    });
  }
  call_api(status);
});

function load_data(order, order_detail) {
  order.forEach(function (orders) {
    var order_details = order_detail.filter(
        (orderdetail) => orderdetail.order_id == orders.order_id
    );
    
    var order = `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex">
                    <div class="col-4 d-flex justify-content-center">
                        <div class="card-title">
                            <div class="row-6"><span>Mã đơn hàng</span></div>
                            <div class="row-6"><span>${orders.order_id}</span></div>
                        </div>
                    </div>
                    <div class="col-4 d-flex justify-content-center">
                        <div class="card-title">
                            <div class="row-6"><span>Ngày đặt hàng </span></div>
                                <div class="row-6"><span>${orders.order_date}</span></div>
                            </div>
                        </div>
                        <div class="col-4 d-flex justify-content-center">
                            <div class="card-title">
                                <div class="row-6 d-flex justify-content-center">
                                <span>Trạng thái </span>
                                </div>
                                    <div class="row-6"><span>${orders.status}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="card-body" id="${orders.order_id}">
        `;
    $('#all-orders').append(order);

    order_details.forEach(function (order_detail_new) {
        var order_detail_html = `
        <div class="container">
            <div class="row d-flex">
                <div class="d-flex col-2 justify-content-center align-items-center">
                    <img src="${order_detail_new.image}" style="height:40px;width40px">
                </div>
                <div class="d-flex col-7 justify-content-between">
                    <div class="row d-flex justify-content-center">
                        <div class="">
                            <div class="row-4">
                                <span class="text-primary fs-5">${order_detail_new.name}</span>
                            </div>
                            <div class="row-4">
                                <span>Số lượng: ${order_detail_new.quantity}</span>
                            </div>
                            <div class="row-4">
                                <span>Trọng lượng: 12</span>
                            </div>
                        </div>
                    </div>
                    <div class="row d-flex justify-content-center">
                        <div class="">
                            <div class="row-4">
                                <span class="text-primary fs-5">Phương thức thanh
                                    toán</span>
                            </div>
                            <div class="row-4">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        `;
        $(`#${order_detail_new.order_id}`).append(order_detail_html);
    });
  });
}
