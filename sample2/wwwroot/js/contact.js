$(document).ready(function () {
    var baseUrl = $("#baseurl").val();

    //Save
    $("#ButtonSave").click(function (e) {
      
        var PostData = {
            FirstName: $("#fname").val(),
            LastName: $("#lname").val(),
            PhoneNumber: $("#phonenumber").val(),
            Email: $("#email").val(),
            Qualification: $("#qualification").val()
        }

        $.ajax({
            type: "POST",
            url: "/Contact/SaveContactUs",
            data: PostData,
            success: function (result) {
                if (result.Item1 !== "") {
                    if (result.Item1 == 2)
                        swal("", response.Item2, "warning").then((value) => {
                        });
                    else if (response.Item1 == 1) {
                        swal("", response.Item2, "success").then((value) => {
                        });
                    }

                }
            },
            error: function (response) {
            }
        });
    });
});