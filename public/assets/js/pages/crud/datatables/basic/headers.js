let dataTable;
let myData = {};
let DTable = function () {
    let initTable = function () {
        let table = $('#kt_datatable');
		
		alert("hello");
        dataTable = table.DataTable({
            responsive: true,
            searchDelay: 500,
            processing: true,
            serverSide: true,
            dom: `<'row'<'col-sm-6 text-left'f><'col-sm-6 text-right'B>>
			<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
            ajax: {
				
                url: "http://localhost/admin/scripts/Postd_click",
                type: "POST",
                data: function (d) {
                    return $.extend(d, myData);
                }
            },
            order: [[5, 'desc']],
            columns: [
                {data: 'title'},
                {data: 'image'},
                {data: 'created_date'},
                {data: 'status', responsivePriority: -2},
                {data: 'action'},
            ],
            columnDefs: [
                {
                    targets: 0,
                    className: 'text-center',
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return meta.row + 1;
                    }
                },
                {
                    targets: 1,
                    className: 'text-center',
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return meta.row + 1;
                    }
                },

                {
                    targets: 2,
                    className: 'text-center',
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return meta.row + 1;
                    }
                },
                {
                    targets: 3,
                    className: 'text-left',
                    render: function (data, type, full, meta) {
                        return data;
                    }
                },

                {
                    targets: 4,
                    className: 'text-center',
                    orderable: true,
                    render: function (data, type, full, meta) {
                        return meta.row + 1;
                    }
                },
            ],
        });
    };

    return {
        //main function to initiate the module
        init: function () {
            initTable();
            dataTable.on('draw', function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
        },

    };

}();

jQuery(document).ready(function () {
    DTable.init();
});

function delete_data(e) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then(function (result) {
        if (result.value) {
            let form_data = new URLSearchParams();
            form_data.append('report_id', $(e).attr('name'));
            $.ajax({
                type: 'POST',
                data: form_data,
                url: '/api/laboratory-report/delete',
                processData: false,
                contentType: false,
                headers: {'Authorization': 'Basic ' + window.btoa(key_id + ':' + key_secret)},
                beforeSend: function () {
                    KTApp.blockPage({
                        overlayColor: '#000000',
                        state: 'primary',
                        message: 'Please Wait...'
                    });
                },
                success: function (result) {
                    try {
                        if (result && typeof result === 'object' && result.status && result.status === 'success') {
                            toasterPopup('Success', result.message, 'success');
                            dataTable.ajax.reload();
                        } else {
                            toasterPopup('Error', result.message, 'error');
                        }
                    } catch (e) {
                        toasterPopup('Error', 'Sorry, looks like there are some errors detected, please try again.', 'error');
                    }
                },
                error: function (xhr, status) {
                    let error_message = xhr.statusText;
                    if (parseInt(xhr.status) === 401) {
                        let response = JSON.parse(xhr.responseText);
                        error_message = response.message;
                    }
                    toasterPopup('Error', error_message, 'error');
                },
                complete: function () {
                    KTApp.unblockPage();
                }
            });
        }
    });
}