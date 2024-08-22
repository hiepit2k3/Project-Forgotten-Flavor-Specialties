// $(document).ready(function(){
//     var token = getCookie('ga');
//     var status = "all"

//     $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
//         var targetId = $(e.target).attr('href').substring(1);
//         var contentId = '#' + targetId + '-content';

//         $.ajax({
//             url: `${window.domain_backend}/order/history`,
//             type: "POST",
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             },
//             data: JSON.stringify(),
//             success: function (response) {
//             },
//             error: function (xhr, status, error) {
//                 toastr.error("Không có dữ liệu!");
//             },
//         });

//         // Thay đổi URL API theo nhu cầu của bạn
//         // var apiUrl = '/api/orders/' + targetId;

//         // // Gọi API
//         // $.ajax({
//         //     url: apiUrl,
//         //     method: 'GET',
//         //     success: function(data) {
//         //         // Cập nhật nội dung của tab
//         //         $(contentId).text(JSON.stringify(data, null, 2));
//         //     },
//         //     error: function() {
//         //         $(contentId).text('Error loading data');
//         //     }
//         // });
//     });
// });