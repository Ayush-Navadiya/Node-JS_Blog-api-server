$(document).ready(function () {
    kt_login_signin_form.init();
});

let kt_login_signin_form = function () {
    let _buttonSpinnerClasses = 'spinner spinner-right spinner-white pr-15';

        let _handleFormSubjects = function () {
            let form = KTUtil.getById('kt_login_signin_form');
            let formSubmitButton = $("#kt_login_signin_form button[type=submit]");

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
                        username: validation_rule_empty('Username is required'),
                        password: validation_rule_empty('Password is required'),
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        submitButton: new FormValidation.plugins.SubmitButton(),
                        bootstrap: new FormValidation.plugins.Bootstrap(),
                    }
                }
            )
            .on('core.form.valid', function () {
                let form_data = new URLSearchParams(new FormData($("#kt_login_signin_form")[0]));


                $.ajax({
                    type: "post",
                    url: "api/login_click",
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