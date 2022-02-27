$(document).ready(function () {
    formOPD.init();
});

let formOPD = function () {
    let _buttonSpinnerClasses = 'spinner spinner-right spinner-white pr-15';
    let _handleFormSubjects = function () {
        let form = KTUtil.getById('kt_form_create_blog');
        let formSubmitButton = $("#kt_form_create_blog button[type=submit]");

        let validation_rule_empty = (message) => {
            return {
                validators: {
                    notEmpty: {
                        message: message
                    }
                }
            }
        };

        if (!form) {
            return;
        }

        FormValidation
            .formValidation(
                form,
                {
                    fields: {
                        btitle: validation_rule_empty('Title is required!'),
                        shortdes: validation_rule_empty('Short Description'),
                        inpFile: validation_rule_empty('Select image!'),
                        mtitle: validation_rule_empty('Meta title is required!'),
                        mkeyword: validation_rule_empty('Meta keyword is required!'),
                        mdescription: validation_rule_empty('Description is required!'),
                        seo_url: validation_rule_empty('Seourl is required!'),
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        submitButton: new FormValidation.plugins.SubmitButton(),
                        bootstrap: new FormValidation.plugins.Bootstrap(),
                    }
                }
            )
            .on('core.form.valid', function () {


                var des = document.getElementById("kt_quil_2");
                var text  = des.textContent || des.innerText;
                let form_data = new FormData($("#kt_form_create_blog")[0]);
                form_data.append("des", text);
                const endpoint = "api/create_click";




                $.ajax({
                    type: "post",
                    url: "api/Create_click",
                    data: form_data,
                    cache: false,
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                        formSubmitButton.addClass(_buttonSpinnerClasses).attr('disabled', true);
                    },
                    success: function (obj) {
                        try {
                            if (obj.status === 'success') {
                                Swal.fire({
                                    allowOutsideClick: false,
                                    position: "top-right",
                                    icon: "success",
                                    title: obj.message,
                                    showConfirmButton: false,
                                    timer: 1000
                                }).then(function () {
                                    location.href = '/dashboard';
                                });
                            } else {
                                Swal.fire('Error', obj.message, 'error');
                            }
                        } catch (e) {
                            console.log(e);
                            Swal.fire('Error', 'Something went wrong!', 'error')
                        }
                    },
                    complete: function () {
                        formSubmitButton.removeClass(_buttonSpinnerClasses).attr('disabled', false);
                    }
                });


            })
            .on('core.form.invalid', function () {
                toasterPopup('Error', 'Sorry, looks like there are some errors detected, please try again.', 'error');
                KTUtil.scrollTop();
            });
    };

    return {
        init: function () {
            _handleFormSubjects();
        }
    };
}();
