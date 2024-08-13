$(document).ready(function () {
  $("#login_form").on("submit", function (event) {
    event.preventDefault();

    var username = $("#username").val();
    var password = $("#password").val();
    try {
      $.ajax({
        url: `${window.domain_backend}/login`,
        type: "POST",
        contentType: "application/json", // Gửi dữ liệu dưới dạng JSON
        data: JSON.stringify({
          username: username,
          password: password,
        }),
        success: function (response) {
          console.log(response);
          if (response.status_code === 200) {
            toastr.success("Đăng nhập thành công!");
            setCookieMinutes("ga", response.data.access_token, 15);
            checkLocal()
            window.location.href = '/index';
            localStorage.removeItem("cart");
          }
        },
        error: function (xhr, status, error) {
          toastr.error("Tài khoản hoặc mật khẩu không đúng!");
        },
      });
    } catch (e) {
      toastr.error("Tài khoản hoặc mật khẩu không đúng!");
    }
  });



  function setCookieDays(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  // đăng ký tài khoản
  $("#form_register").on("submit", function (event) {
    event.preventDefault();
    var fullname = $("#fullname").val();
    var username = $("#username").val();
    var password = $("#password").val();
    var confirmpassword = $("#confirmpassword").val();

    console.log(username);

    if (password != confirmpassword) {
      toastr.error("Mật khẩu không trùng khớp!");
      return 0;
    }

    try {
      $.ajax({
        url: `${window.domain_backend}/register`,
        type: "POST",
        contentType: "application/json", // Gửi dữ liệu dưới dạng JSON
        data: JSON.stringify({
          username: username,
          fullname: fullname,
          password: password,
        }),
        success: function (response) {
          console.log(response);
          if (response.status_code === 201) {
            toastr.success("Đăng ký thành công!");
            window.location.href = '/index.html';
            checkLocal()
          }
        },
        error: function (xhr, status, error) {
          toastr.error("Đăng ký tài khoản thất bại!");
        },
      });
    } catch (e) {
      toastr.error("Đăng ký tài khoản thất bại!");
    }

    function getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
          return c.substring(nameEQ.length, c.length);
      }
      return null;
    }

    function checklogin() {
      if (getCookie("ga") != null) {
        console.log(`${window.domain_frontend}index.html`);
        // window.location.href = `${window.domain_frontend}index.html`
      } else {
        window.location.href = `${window.domain_frontend}/login.htm`;
      }
    }
    //
    // checklogin();
  });

  // hiển thị model địa chỉ nhận hàng
  $(".list-group-item-action").on("click", function () {
    var address = $(this).data("address");
    $("#selected-address span").text(address);
    $("#addressModal").modal("hide");
  });
});

// Function to set a cookie with an expiration time in minutes
function setCookieMinutes(name, value, minutes) {
  var expires = "";
  if (minutes) {
    var date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}