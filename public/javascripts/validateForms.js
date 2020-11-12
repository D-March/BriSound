(function () {
    'use strict'

    //Custom file inputs will be displayed
    bsCustomFileInput.init()

    //Fetch all forms to apply custom Bootstrap validation
    const forms = document.querySelectorAll('.validated-form')

    //Loop over each form and prevent submission
        Array.from(forms)
            .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                    }
                    form.classList.add('was-validated')
                }, false)
            })
})()