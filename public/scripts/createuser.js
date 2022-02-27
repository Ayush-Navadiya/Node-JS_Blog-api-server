

$(document).ready(function () {
    formOPD.init();
});

let formOPD = function () {
    let _buttonSpinnerClasses = 'spinner spinner-right spinner-white pr-15';
    let _handleFormSubjects = function () {
        let form = KTUtil.getById('kt_createuser_form');
        let formSubmitButton = $("#kt_login_signup_form button[type=submit]");

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
                        cfname: validation_rule_empty('firstname is required!'),
                        clname: validation_rule_empty('Lastname is required!'),
                        cno: validation_rule_empty('Mobile number is required!'),
                        ccity: validation_rule_empty('City is required!'),
                        caddress: validation_rule_empty('gender is required!'),
                        cgender: validation_rule_empty('Select Gender'),
                        cemail: {
                            validators: {
                                notEmpty: {
                                    message: 'Email address is required'
                                },
                                emailAddress: {
                                    message: 'The value is not a valid email address'
                                }
                            }
                        },
                        cpassword: {
                            validators: {
                                notEmpty: {
                                    message: 'The password is required'
                                }
                            }
                        },
                        ccpassword: {
                            validators: {
                                notEmpty: {
                                    message: 'The password confirmation is required'
                                },
                                identical: {
                                    compare: function() {
                                        return form.querySelector('[name="cpassword"]').value;
                                    },
                                    message: 'The password and its confirm are not the same'
                                }
                            }
                        },
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        submitButton: new FormValidation.plugins.SubmitButton(),
                        bootstrap: new FormValidation.plugins.Bootstrap(),
                    }
                }
            )
            .on('core.form.valid', function () {
                let form_data = new URLSearchParams(new FormData($("#kt_createuser_form")[0]));
                $.ajax({
                    type: "POST",
                    url: "api/createuser_click",
                    data: form_data,
                    cache: false,
                    processData: false,
                    contentType: false,
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
                                    location.href = '/';
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
