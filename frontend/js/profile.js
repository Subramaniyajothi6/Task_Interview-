
if (!localStorage.getItem('token')) {
    alert("Please Login First");
    window.location.href = 'login.html';
}


$.ajax({
    url: 'http://localhost:5000/api/auth/profile',
    method: 'GET',
    headers: {
        'Authorization': localStorage.getItem('token')
    },
    success: function (res) {
        if (res.success) {
            $('#name').val(res.data.name);
            $('#age').val(res.data.age || '');
            $('#dob').val(res.data.dob || '');
            $('#contact').val(res.data.contact || '');
        }
        else {
            alert(res.message);
            window.location.href = 'login.html';
        }
    },
    error: function () {
        alert('Error In Fetching Profile')
    }
})



$("#profileForm").on("submit", function (e) {
    e.preventDefault();

    const data = {
        age: $("#age").val(),
        dob: $("#dob").val(),
        contact: $("#contact").val()
    };

    $.ajax({
        url: "http://localhost:5000/api/auth/profile",
        method: "PUT",
        headers: {
            "Authorization": localStorage.getItem("token"),
            "Content-Type": "application/json"
        },
        data: JSON.stringify(data),
        success: function (res) {
            if (res.success) {
                alert("Profile Updated");
            } else {
                alert(res.message || "Update failed")
            }
        },
        error: function () {
            alert("Server Error");
        }
    })
})

$('#logout').on('click',function (e){
    e.preventDefault();
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    alert('Logout Successful')
    window.location.href = 'login.html';
})