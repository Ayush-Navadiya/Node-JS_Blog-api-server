$(document).ready(function () {
    formOPD.init();
});

let formOPD = function () {
    let _buttonSpinnerClasses = 'spinner spinner-right spinner-white pr-15';
    let _handleFormSubjects = function () {
        let form = KTUtil.getById('kt_form_edit');
        let formSubmitButton = $("#kt_form_edit button[type=submit]");

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
                        shortdes: validation_rule_empty('Short Description is required!'),
                        mtitle: validation_rule_empty('Meta Title is required!'),
                        mkeyword: validation_rule_empty('Meta Keyword is required!'),
                        mdescription: validation_rule_empty('Meta Description is required!'),
                        seo_url: validation_rule_empty('SEO URL is required!'),
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        submitButton: new FormValidation.plugins.SubmitButton(),
                        bootstrap: new FormValidation.plugins.Bootstrap(),
                    }
                }
            )
            .on('core.form.valid', function () {
                let form_data = new FormData($("#kt_form_edit")[0]);
                var des = document.getElementById("kt_quil_2");
                var text  = des.textContent || des.innerText;
                form_data.append("des", text);
                console.log(form_data);

                $.ajax({
                    type: "post",
                    url: "api/Bloged_click",
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
                                    location.href = '/postblog';
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
