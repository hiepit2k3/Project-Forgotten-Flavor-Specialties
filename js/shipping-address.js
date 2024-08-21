var cities = document.getElementById("city");
var districts = document.getElementById("district");
var wards = document.getElementById("ward");
var state = document.getElementById("state");

var parameter = {
    url: "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json",
    method: "GET",
    responseType: "application/json"
};

// Sử dụng axios để lấy dữ liệu
axios(parameter)
    .then(function (result) {
        renderCity(result.data);
        renderState(result.data);
    })
    .catch(function (error) {
        console.error('Error fetching data:', error);
    });

function renderState(data) {
    state.innerHTML = '<option value="">Chọn Thành Phố</option>';
    data.forEach(function (city) {
        var option = new Option(city.Name, city.Id);
        state.add(option);
    });
}

function renderCity(data) {
    // Xóa các tùy chọn hiện tại trong trường city
    cities.innerHTML = '<option value="">Chọn Thành Phố</option>';

    data.forEach(function (city) {
        var option = new Option(city.Name, city.Id);
        cities.add(option);
    });

    // Khi người dùng chọn một thành phố
    cities.onchange = function () {
        districts.innerHTML = '<option value="">Chọn Quận/Huyện</option>';
        wards.innerHTML = '<option value="">Chọn Phường/Xã</option>';

        if (this.value !== "") {
            var selectedCity = data.find(n => n.Id === this.value);

            if (selectedCity && selectedCity.Districts) {
                selectedCity.Districts.forEach(function (district) {
                    var option = new Option(district.Name, district.Id);
                    districts.add(option);
                });
            }
        }
    };

    // Khi người dùng chọn một quận/huyện
    districts.onchange = function () {
        wards.innerHTML = '<option value="">Chọn Phường/Xã</option>';

        if (this.value !== "") {
            var selectedCity = data.find(n => n.Id === cities.value);
            if (selectedCity) {
                var selectedDistrict = selectedCity.Districts.find(n => n.Id === this.value);

                if (selectedDistrict && selectedDistrict.Wards) {
                    selectedDistrict.Wards.forEach(function (ward) {
                        var option = new Option(ward.Name, ward.Id);
                        wards.add(option);
                    });
                }
            }
        }
    };
}
