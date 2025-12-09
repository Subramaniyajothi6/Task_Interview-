
$('#loginForm').on('submit',function(e){
    e.preventDefault();

    const data = {
        email : $('#email').val(),
        password : $('#password').val(),
    };

    $.ajax({
        url:'http://localhost:5000/api/auth/login',
        method:'POST',
        contentType:'application/json',
        data:JSON.stringify(data),
        success: function (res) {
            if (res.success) {
                localStorage.setItem('token',res.token);
                localStorage.setItem('userId',res.userId);
                alert("Login successful");
                window.location.href = "profile.html";
            } else {
                alert(res.message || "Login failed");
            }
        },
        error: function () {
            alert("Server Error");
        }
    })
})