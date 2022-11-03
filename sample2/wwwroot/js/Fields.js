$(document).ready(function () {
    $('.multiselect').select2();
    var baseUrl = $("#baseurl").val();
    var fieldId = 0;
    $("#Addfieldbtn").attr('disabled', true);
    $("#BulkUploadbtn").attr('disabled', true);


    var avaliableSheets = [];


    $("#sheetname").autocomplete({
        source: avaliableSheets,
        minLength: 2,
    }).each(function () {
        $(this).autocomplete("widget").insertAfter($("#fieldmodal").parent());
    });;


    //grid columns
    var tablecolumns = [
        { "data": "sheetName" },
        {
            "data": "sheetName",
            "render": function (data, type, full, meta) {
                if (data != null && data != '') {
                    if ($.inArray(data.trim(), avaliableSheets) == -1) {
                        avaliableSheets.push(data.trim());
                    }
                }
                return data;
            },
        },
        { "data": "tableName" },
        { "data": "fieldName" },
        { "data": "modifiedDate" },
        { "data": "modifiedByName" },
        {
            "data": "isActive",
            "render": function (data, type, full, meta) {
                if (data == true) {
                    return "<span class='badge badge-success'>Active</span>";
                } else {
                    return "<span class='badge badge-danger'>Inactive</span>";
                }
            },

        },
        {
            "data": "fieldId",
            "render": function (data, type, full, meta) {
                return "<i class='tim-icons icon-pencil mr-3 font-16 edit-field cursor-pointer' fieldId=" + data + " title='Edit Field' /></i><i class='tim-icons icon-trash-simple font-16 delete-field cursor-pointer' fieldId=" + data + " title='Delete Field' /></i>"

            }
        }];

    //Grid 
    var FieldDataTableGrids = $("#fieldstable").DataTable({
        "oLanguage": {
            "sEmptyTable": "Data not available"
        },
        "ajax": {
            "url": baseUrl + "FieldManagement/GetFieldsList?CustomerId=" + $("#customerId").val(),
            "type": "GET",
            "dataSrc": function (json) {
                return json;
            }
        },
        "lengthChange": false,
        "order": [],
        "columns": tablecolumns,
        "columnDefs": [
            { "bSortable": false, "aTargets": [7] },
        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {
            $("td:first", nRow).html((this.fnPagingInfo().iPage * 10) + iDisplayIndex + 1);
            return nRow;
        },
    });

    //table search
    var table = $('#fieldstable').DataTable();
    $(document).on("keyup", ".searchfields", function () {
        table.search(this.value).draw();
    });

    //customer dropdown change event
    $("#customerId").change(function () {
        if ($("#customerId").val() == "" || $("#customerId").val() == undefined || $("#yearId").val() == "" || $("#yearId").val() == undefined) {
            $("#Addfieldbtn").attr('disabled', true);
            $("#BulkUploadbtn").attr('disabled', true);
        }
        else {
            $("#Addfieldbtn").attr('disabled', false);
            $("#BulkUploadbtn").attr('disabled', false);
        }
        FieldDataTableGrids.ajax.url(baseUrl + "FieldManagement/GetFieldsList?CustomerId=" + $("#customerId").val() + "&year=" + $("#yearId").val()).load();
    });

    $("#yearId").change(function () {
        if ($("#customerId").val() == "" || $("#customerId").val() == undefined || $("#yearId").val() == "" || $("#yearId").val() == undefined) {
            $("#Addfieldbtn").attr('disabled', true);
            $("#BulkUploadbtn").attr('disabled', true);
        }
        else {
            $("#Addfieldbtn").attr('disabled', false);
            $("#BulkUploadbtn").attr('disabled', false);
        }
        FieldDataTableGrids.ajax.url(baseUrl + "FieldManagement/GetFieldsList?CustomerId=" + $("#customerId").val() + "&year=" + $("#yearId").val()).load();
    });


    //Add Field
    $(document).on('click', "#Addfieldbtn", function () {
        $("#addField").modal('show');
        $("#addField .page-title").text("Add Field");
        $("#overlay").show();
        $("#btnSave").text("Save");
        ClearFields();
        $("#overlay").hide();
        ClearErrorFields();
    });
    function ClearErrorFields() {
        $("#addField").find(".mandatory").each(function () {
            $(this).removeClass("error");
        });
        $("#addField").find(".mandatoryext").each(function () {
            $(this).removeClass("error");
        });
    }
    //ClearFields
    function ClearFields() {
        fieldId = 0;
        $("#sheetname").val("");
        $("#tablename").val("");
        $("#fieldname").val("");
        $("#IsActive").prop("checked", true).trigger("change");
        $("#addField .error-message").hide();
    }

    function EmptyFieldValidation() {
        $("#fieldmodal").find(".mandatory").each(function () {
            if ($.trim($(this).val()).length == 0) {
                $(this).addClass("error");
            }
            else {
                $(this).removeClass("error");
            }
        });
        return $("#fieldmodal").find(".error").length == 0 ? true : false
    }

    //Edit Click event
    $(document).on('click', '.edit-field', function () {
        $("#overlay").show();
        $("#addField .page-title").text("Update Field");
        $("#fieldmodal .error-message").hide();
        ClearFields();
        fieldId = this.getAttribute("fieldId");
        var currentRow = $(this).closest("tr");
        $("#sheetname").val(currentRow.find("td:eq(1)").text());
        $("#tablename").val(currentRow.find("td:eq(2)").text());
        $("#fieldname").val(currentRow.find("td:eq(3)").text());
        var IsActive = currentRow.find("td:eq(6)").text() == "Active" ? true : false;
        $("#IsActive").prop("checked", IsActive).trigger("change");
        $("#overlay").hide();
        $("#btnSave").text("Update");
        $("#addField").modal('show');
    });

    //Save
    $(document).on('click', "#btnSave", function () {
        if (!EmptyFieldValidation()) {
            $("#addField .error-message").text('Please fill the required fields...');
            $("#addField .error-message").show();
            return false;
        }
        $("#overlay").show();
        var PostData = {
            FieldId: fieldId,
            CustomerId: $("#customerId").val(),
            SheetName: $("#sheetname").val(),
            TableName: $("#tablename").val(),
            FieldName: $("#fieldname").val(),
            IsActive: $("#IsActive").is(":checked"),
            YearId: $("#yearId").val(),
        }

        $.ajax({
            type: "POST",
            url: baseUrl + "FieldManagement/InsertUpdateFields",
            data: PostData,
            beforeSend: function () {
                $("#overlay").show();
            },
            complete: function () {
                $("#overlay").hide();
            },
            success: function (result) {
                var response = JSON.parse(result);
                $("#overlay").hide();
                if (response.Item1 !== "") {
                    if (response.Item1 == 2)
                        swal("", response.Item2, "warning").then((value) => {
                        });
                    else if (response.Item1 == 1) {
                        $("#addField").modal('hide');
                        ClearFields();
                        swal("", response.Item2, "success").then((value) => {
                            $(".modal-backdrop").remove()
                        });
                    }
                    else if (response.Item1 == 4)
                        swal({
                            title: response.Item2,
                            icon: "warning",
                            dangerMode: true,
                            buttons: ['NO', 'YES']
                        })
                            .then((willUpdate) => {
                                if (willUpdate) {
                                    ConfirmedStarFieldUpdate(PostData);
                                }
                            });

                    else if (response.Item1 == 3)
                        swal("", response.Item2, "error").then((value) => {
                        });
                    else if (response.Item1 == -1)
                        swal("", response.Item2, "error").then((value) => {
                        });
                    else
                        swal("", response.Item2, "error").then((value) => {
                        });
                }
                FieldDataTableGrids.ajax.reload();
                $("#overlay").hide();
            },
            error: function (response) {
                $("#overlay").hide();
                $("#addField").modal('hide');
                ClearFields();
            }
        });
    });

    function ConfirmedStarFieldUpdate(data) {
        $.ajax({
            type: "POST",
            url: baseUrl + "FieldManagement/UpdateStarFields",
            data: data,
            beforeSend: function () {
                $("#overlay").show();
            },
            complete: function () {
                $("#overlay").hide();
            },
            success: function (result) {
                var response = JSON.parse(result);
                $("#overlay").hide();
                if (response.Item1 !== "") {
                    if (response.Item1 == 1) {
                        $("#addField").modal('hide');
                        ClearFields();
                        swal("", response.Item2, "success").then((value) => {
                            $(".modal-backdrop").remove()
                        });
                    }
                    else if (response.Item1 == 3)
                        swal("", response.Item2, "error").then((value) => {
                        });

                    else
                        swal("", response.Item2, "error").then((value) => {
                        });
                }
                FieldDataTableGrids.ajax.reload();
                $("#overlay").hide();
            },
            error: function (response) {
                $("#overlay").hide();
                $("#addField").modal('hide');
                ClearFields();
            }
        });
    }


    //delete
    $(document).on('click', '.delete-field', function () {

        swal({
            text: "Do you want to delete the field?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    $("#overlay").show();
                    var PostData = {
                        FieldId: this.getAttribute("fieldId")
                    }
                    $.ajax({
                        type: "POST",
                        url: baseUrl + "FieldManagement/DeleteField",
                        data: PostData,
                        beforeSend: function () {
                            $("#overlay").show();
                        },
                        complete: function () {
                            $("#overlay").hide();
                        },
                        success: function (response) {
                            var result = response.result;
                            if (result.Item1 != "") {
                                if (result.item1 == 1)
                                    swal("", result.item2, "success").then((value) => {
                                        $(".modal-backdrop").remove()
                                    });
                                else if (result.item1 == 3)
                                    swal("", result.item2, "error").then((value) => {
                                        $(".modal-backdrop").remove()
                                    });
                            }
                            FieldDataTableGrids.ajax.reload();
                        }
                    });
                    $(".modal-backdrop").remove();
                }
            });
    });

    // Download Template
    $("#downloadfieldlist").click(function () {
        $.ajax({
            type: "GET",
            url: baseUrl + "FieldManagement/ValidateDownloadTemplate?customerId=" + $("#customerId").val() + "&yearId=" + $("#yearId").val(),
            beforeSend: function () {
                $("#overlay").show();
            },
            complete: function () {
                $("#overlay").hide();
            },
            success: function (response) {
                if (response.error != "") {
                    swal("", response.error, "warning").then((value) => {
                    });
                }
                else {
                    window.location.href = baseUrl + "FieldManagement/DownloadFieldExcelTemplate?customerId=" + $("#customerId").val() + "&customername=" + $("#customerId option:selected").text() + "&yearId=" + $("#yearId").val();
                }
            }
        });
    });


    $("#BulkUploadbtn").click(function () {
        $("#bulkuploadfile").val(null);
        $(".filename").text("");
        $(".filename").addClass("d-none");
    });

    $("#bulkuploadfile").change(function (e) {
        var files = e.target.files;
        if (files.length > 0) {
            var isValidFile = validateInputFileExtension(files[0]);
            if (!isValidFile) return;
            var filename = e.target.files[0].name;
            $(".filename").text(filename);
            $(".filename").removeClass("d-none");
            $('#uploadfile').trigger('click');
        }
    });

    $('#uploadfile').click(function () {
        if (window.FormData !== undefined) {
            var fileUpload = $("#bulkuploadfile").get(0);
            var files = fileUpload.files;
            if (files.length > 0) {
                var fileData = new FormData();
                fileData.append("filedata", files[0]);
                fileData.append('customerId', $("#customerId").val());
                fileData.append('yearId', $("#yearId").val());
                $.ajax({
                    url: baseUrl + "FieldManagement/BulkUploadFile",
                    type: "POST",
                    contentType: false,
                    processData: false,
                    data: fileData,
                    beforeSend: function () {
                        $("#overlay").show();
                    },
                    complete: function () {
                        $("#overlay").hide();
                    },
                    success: function (result) {
                        if (result.error == "") {
                            if (result.filename != "" && result.filename != undefined) {
                                const el = document.createElement('div')
                                el.innerHTML = '<p class="text-danger mb-4">Uploaded File has Exceptions. Please check and upload again.</p>';
                                swal({
                                    title: "Exception",
                                    content: el,
                                    closeOnClickOutside: false,
                                    button: false,
                                    timer: 3000
                                });
                                window.location = baseUrl + 'FieldManagement/DownloadFieldExceptionFile?filename=' + result.filename;
                            }
                            else
                                swal("", "Successfully updated", "success").then((value) => {
                                });

                            FieldDataTableGrids.ajax.reload();
                            $(".modal-backdrop").remove()
                            $("#uploadfields").modal('hide');
                        }
                        else {
                            swal("", result.error, "warning").then((value) => {
                            });
                        }
                    },
                    error: function (err) {
                        alert(err.statusText);
                    }
                });
            }
            else {
                swal("", "Please upload file", "warning").then((value) => {
                });
            }
        } else {
            alert("FormData is not supported.");
        }
    });

    $('#sheetname').on('keypress', function (event) {
        var regex = new RegExp(/[:?[\]\\*/]/, "");
        SheetNameInputRestrict(regex);
    });
    $('#tablename').on('keypress', function (event) {
        var regex = new RegExp("^[a-zA-Z0-9 _-]+$");
        InputRestrict(regex);
    });
    $('#fieldname').on('keypress', function (event) {
        var regex = new RegExp("^[a-zA-Z0-9 *_-]+$");
        if ($("#fieldname").val().length == 0) {
            InputRestrict(regex);
        }
        else if ($("#fieldname").val() == "*") {
            event.preventDefault();
            return false;
        }
        else {
            regex = new RegExp("^[a-zA-Z0-9 _-]+$");
            InputRestrict(regex);
        }
    });

    function InputRestrict(regex) {
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    }
    function SheetNameInputRestrict(regex) {
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (regex.test(key)) {
            event.preventDefault();
            return false;
        }
    }

    async function CheckFileMemeType(file) {
        var IsValidFile = false;
        var ext = file.name.split('.').pop();
        var result = await new Promise((resolve) => {
            var fileReader = new FileReader();
            fileReader.onloadend = (e) => resolve(e.target.result);
            fileReader.readAsArrayBuffer(file);

        });

        var arr = (new Uint8Array(result)).subarray(0, 4);
        var header = "";
        for (var i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
        }

        if (ext.toLowerCase() === "xlsx" && (header.toUpperCase() === "504B0304" || header.toUpperCase() === "504B34") && header.substring(0, 4).toUpperCase() != "4D5A")
            IsValidFile = true;

        if (!IsValidFile) {
            swal("", "Unsupported file format. Please upload in .xlsx format.", "error");
            $("#bulkuploadfile").val(null);
            $(".filename").text("");
            $(".filename").addClass("d-none");
        }
        return IsValidFile;
    }


    async function validateInputFileExtension(file) {
        let result = await CheckFileMemeType(file);
        return result;
    }


    //function LoadSheetName() {
    //    debugger;
    //    $.each(FieldDataTableGrids.fnGetData(), function (i, row) {
    //        secondCellArray.push(row[1]);
    //    })
    //}

});