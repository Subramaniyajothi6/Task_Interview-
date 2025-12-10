

$("#registerForm").on("submit", function (e) {
    e.preventDefault();

    const data = {
        name: $("#name").val(),
        email: $("#email").val(),
        password: $("#password").val()
    };

    $.ajax({
        url: "https://taskinterview-production.up.railway.app/api/auth/register",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (res) {
            if (res.success) {
                alert("Registration successful")
                window.location.href = "login.html"
            } else {
                alert(res.message || "Registration failed");
            }
        },
        error: function () {
            alert("Server Error");
        }
    });
});