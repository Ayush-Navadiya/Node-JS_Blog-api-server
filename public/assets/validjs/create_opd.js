$(document).ready(function () {
    formOPD.init();
});

let formOPD = function () {
    let _buttonSpinnerClasses = 'spinner spinner-right spinner-white pr-15';
    let _handleFormSubjects = function () {
        let form = KTUtil.getById('form_opd');
        let formSubmitButton = $("#form_opd button[type=submit]");

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
                        doctor_id: validation_rule_empty('Doctor is required!'),
                        phone_number: validation_rule_empty('Phone number is required!'),
                        full_name: validation_rule_empty('Patient name is required!'),
                        description: validation_rule_empty('Description is required!'),
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        submitButton: new FormValidation.plugins.SubmitButton(),
                        bootstrap: new FormValidation.plugins.Bootstrap(),
                    }
                }
            )
            .on('core.form.valid', function () {
                let form_data = new URLSearchParams(new FormData($("#form_opd")[0]));
                $.ajax({
                    method: 'post',
                    url: '/api/opd',
                    data: form_data,
                    cache: false,
                    processData: false,
                    contentType: false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': 'Basic ' + window.btoa(key_id + ':' + key_secret)
                    },
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
                                    location.href = '/app/opd';
                                });
                            } else {
                                toasterPopup('Error', obj.message, 'error');
                            }
                        } catch (e) {
                            toasterPopup('Error', 'Something went wrong!', 'error');
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
