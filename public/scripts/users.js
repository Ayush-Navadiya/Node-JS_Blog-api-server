$(document).ready(function () {
    formOPD.init();
});

let myData = {};
let id = "";
let formOPD = function () {
    var dataTable = $('#data_user').DataTable({
        "responsive": true,
        "searchDelay": 500,
        "processing":true,
        "serverSide":true,
        "dom": "<'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        "ajax":{
            url:"api/userd_click",
            type:"POST",
            data: function (d) {
                return $.extend(d, myData);
            }
        },
        order: [[0, 'desc']],
        columns: [
            {data: '_id'},
            {data: 'fname'},
            {data: 'image'},
            {data: 'created_date'},
            {data: 'status'},
            {data: '_id'},
        ],
        "columnDefs": [
            {
                targets: 0,
                className: 'text-center',
                orderable: true,
                render: function (data, type, full, meta) {
                    id = data;
                    return data;
                }
            },
            {
                targets: 1,
                className: 'text-left',
                orderable: true,
                render: function (data, type, full, meta) {
                    return data;
                }
            },
            {
                targets: 2,
                className: 'text-left',
                orderable: false,
                render: function (data, type, full, meta) {
                    var img = '<div class="image-input image-input-outline" id="kt_image_1">'+
                        '<img class="image-input-wrapper" style="background:grey" id="blah" src="'+data+'">'+
                        '</div>';
                    return img;
                }
            },
            {
                targets: 3,
                className: 'text-left',
                orderable:false,
                render: function (data, type, full, meta) {
                    return data;
                }
            },
            {
                targets: 4,
                className: 'text-left',
                orderable:false,
                render: function (data, type, full, meta) {
                    if(data == 1)
                    {
                        var status = '<input data-switch="true" data-name="'+id+'" type="checkbox" checked="true" onchange="update_status(this)"/></a>';
                    }
                    else
                    {
                        var status = '<input data-switch="true" data-name="'+id+'" type="checkbox" onchange="update_status(this)"/></a>';
                    }
                    return status;
                }
            },
            {
                targets: 5,
                className: 'text-left',
                orderable:false,
                render: function (data, type, full, meta) {
                    var action = '<div class="row"><a href="/edituser/?id='+data+'" class="btn btn-icon btn-light btn-hover-primary btn-sm mx-3 text-center">'+
                        '<span class="svg-icon svg-icon-md svg-icon-primary">'+
                        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">'+
                        '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'+
                        '<rect x="0" y="0" width="24" height="24"></rect>'+
                        '<path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#000000" fill-rule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953)"></path>'+
                        '<path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"></path>'+
                        '</g>'+
                        '</svg>'+
                        '</span>'+
                        '</a>'+
                        '<a href="./api/Userdl_click/?_id='+data+'" class="btn btn-icon btn-light btn-hover-primary btn-sm mx-3 text-center">'+
                        '<span class="svg-icon svg-icon-md svg-icon-primary">'+
                        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">'+
                        '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'+
                        '<rect x="0" y="0" width="24" height="24"></rect>'+
                        '<path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"></path>'+
                        '<path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"></path>'+
                        '</g>'+
                        '</svg>'+
                        '</span>'+
                        '</button></div>';
                    return action;
                }
            },
        ]
    });


    dataTable.on('draw', function () {
        $('[data-switch=true]').bootstrapSwitch();
    });



    return {
        //main function to initiate the module
        init: function () {
            initTable();
        },

    };

}();


function update_status(e) {
    let _id = $(e).data('name');
    $.ajax({
        type: 'POST',
        url: './api/User_status',
        data: {"id":_id}
    })
}