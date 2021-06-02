
class FormRegister {
    constructor() {
        // Elements
        this.form = document.getElementById('cg-register')
        this.username = document.querySelector('.cg-register__username')
        this.email = document.querySelector('.cg-register__email')
        this.password = document.querySelector('.cg-register__password')
        this.password2 = document.querySelector('.cg-register__password2')
        this.btn = document.querySelector('.cg-register__submit')
        this.smalls = document.querySelectorAll('.form-control small')
        this.formControl = document.querySelectorAll('#cg-register .form-control')
        this.successText = document.querySelector('.form-success')
        this.fields = document.querySelectorAll('#cg-register .form-control input')

        // Ajax Url
        this.url = this.form.dataset.url

        // Call Event submit
        this.event()

        // Count Error
        this.countError = 0
    }

    // Event
    event() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault()

            // Check Fields
            this.checkRequired([this.username, this.email, this.password, this.password2])
            this.checkLength(this.username, 2)
            this.checkLength(this.password, 6)
            this.checkEmail(this.email)
            this.checkPasswordConfirm(this.password, this.password2)

            // Check if Errors
            this.countError = document.querySelectorAll('.error').length
            if (this.countError === 0) {
                this.btn.innerText = 'Enregistrement...'
                this.btn.disabled = true

                const params = new URLSearchParams(new FormData(this.form))

                // Fetch
                fetch(this.url, {
                    method: 'POST',
                    body: params
                })
                .then(res => res.json())
                .then(res => {
                    
                    // Check Username Errors
                    if (res.field === 'username' && !res.status) {
                        this.username.parentElement.classList.add('error')
                        this.username.parentElement.querySelector('small').innerText = res.message

                        this.btn.innerText = "S'enregistrer"
                        this.btn.disabled = false
                    }

                    // Check Email Errors
                    if (res.field === 'email' && !res.status) {
                        this.email.parentElement.classList.add('error')
                        this.email.parentElement.querySelector('small').innerText = res.message

                        this.btn.innerText = "S'enregistrer"
                        this.btn.disabled = false
                    }

                    // Check Passwords
                    if (res.field === 'password' && !res.status) {
                        this.password.parentElement.classList.add('error')
                        this.password.parentElement.querySelector('small').innerText = res.message

                        this.btn.innerText = "S'enregistrer"
                        this.btn.disabled = false
                    }

                    if (res.field === 'passwordConfirm' && !res.status) {
                        this.password2.parentElement.classList.add('error')
                        this.password2.parentElement.querySelector('small').innerText = res.message

                        this.btn.innerText = "S'enregistrer"
                        this.btn.disabled = false
                    }


                    // If Success
                    if (res.field === 'success' && res.status) {
                        this.btn.innerText = "Enregistrement..."
                        this.btn.disabled = true

                        this.successText.innerText = res.message
                        this.successText.classList.add('success')

                        // Remove Errors class
                        this.username.parentElement.classList.remove('error')
                        this.email.parentElement.classList.remove('error')
                        this.password.parentElement.classList.remove('error')
                        this.password2.parentElement.classList.remove('error')

                        // Add Success class
                        this.username.parentElement.classList.add('success')
                        this.email.parentElement.classList.add('success')
                        this.password.parentElement.classList.add('success')
                        this.password2.parentElement.classList.add('success')

                        this.smalls.forEach(item => {
                            item.innerText = ''
                        })

                        this.resetFields()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }
        })
    }

    // Check field not empty
    checkRequired(inputArr) {
        inputArr.forEach(input => {
            if (input.value.trim() === '') {
                this.showError(input, `${this.getDataInput(input)} ne peut être vide`)
            } else {
                this.showSuccess(input)
            }
        })
    }

    // Check Length
    checkLength(input, min) {
        if (input.value.length < min) {
            this.showError(input, `Votre ${this.getDataInput(input)} doit contenir au minimum ${min} caractères`)
        } else {
            this.showSuccess(input)
        }
    }

    // Check Email is Valid
    checkEmail(input) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (re.test(input.value.trim())) {
            this.showSuccess(input)
        } else {
            this.showError(input, `Votre email n'est pas valide`)
        }
    }

    // Check Confirmation password
    checkPasswordConfirm(input1, input2) {
        if (input1.value.trim() !== input2.value.trim()) {
            this.showError(input2, `Votre mot de passe est diférent`)
        }
    }

    // Return Input Name
    getDataInput(input) {
        return input.dataset.input
    }

    // Display Error
    showError(input, message) {
        const parentEl = input.parentElement
        const small = parentEl.querySelector('small')

        parentEl.classList.add('error')
        parentEl.classList.remove('success')
        small.innerText = message
    }

    // Display Success
    showSuccess(input) {
        const parentEl = input.parentElement
        const small = parentEl.querySelector('small')

        parentEl.classList.add('success')
        parentEl.classList.remove('error')
        small.innerText = ''
    }

    // Reset All Fields
    resetFields() {
        this.smalls.forEach(item => {
            item.innerText = ''
        })

        this.formControl.forEach(item => {
            item.classList.remove('success', 'error')
        })

        this.fields.forEach(field => {
            field.value = ''
        })

        this.btn.innerText = "S'enregistrer"
        this.btn.disabled = false
    }
}

new FormRegister
