// Menú móvil
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

menuToggle.addEventListener('click', () => {
    if (menuOpen) {
        mobileMenu.style.display = 'none';
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    } else {
        mobileMenu.style.display = 'block';
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    }
    menuOpen = !menuOpen;
});

const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.style.display = 'none';
        menuOpen = false;
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

document.getElementById('currentYear').textContent = new Date().getFullYear();

const togglePasswordButtons = document.querySelectorAll('.toggle-password');
togglePasswordButtons.forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

const registerForm = document.getElementById('registerForm');

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    const lengthValid = password.length >= 8;
    const uppercaseValid = /[A-Z]/.test(password);
    const numberValid = /[0-9]/.test(password);

    return {
        lengthValid,
        uppercaseValid,
        numberValid,
        isValid: lengthValid && uppercaseValid && numberValid
    };
}

function showError(input, message) {
    const errorElement = input.parentElement.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = message;
        input.classList.add('error');
        input.style.borderColor = '#ef4444';
    } else {
        const formGroup = input.closest('.form-group');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.textContent = message;
            input.classList.add('error');
            input.style.borderColor = '#ef4444';
        }
    }
}

function clearError(input) {
    const errorElement = input.parentElement.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = '';
        input.classList.remove('error');
        input.style.borderColor = '#d1d5db';
    } else {
        const formGroup = input.closest('.form-group');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.textContent = '';
            input.classList.remove('error');
            input.style.borderColor = '#d1d5db';
        }
    }
}

function updatePasswordRequirements(password) {
    const validation = validatePassword(password);

    const lengthCheck = document.getElementById('length-check');
    if (validation.lengthValid) {
        lengthCheck.classList.add('valid');
        lengthCheck.querySelector('i').classList.remove('fa-circle');
        lengthCheck.querySelector('i').classList.add('fa-check-circle');
    } else {
        lengthCheck.classList.remove('valid');
        lengthCheck.querySelector('i').classList.remove('fa-check-circle');
        lengthCheck.querySelector('i').classList.add('fa-circle');
    }

    const uppercaseCheck = document.getElementById('uppercase-check');
    if (validation.uppercaseValid) {
        uppercaseCheck.classList.add('valid');
        uppercaseCheck.querySelector('i').classList.remove('fa-circle');
        uppercaseCheck.querySelector('i').classList.add('fa-check-circle');
    } else {
        uppercaseCheck.classList.remove('valid');
        uppercaseCheck.querySelector('i').classList.remove('fa-check-circle');
        uppercaseCheck.querySelector('i').classList.add('fa-circle');
    }

    const numberCheck = document.getElementById('number-check');
    if (validation.numberValid) {
        numberCheck.classList.add('valid');
        numberCheck.querySelector('i').classList.remove('fa-circle');
        numberCheck.querySelector('i').classList.add('fa-check-circle');
    } else {
        numberCheck.classList.remove('valid');
        numberCheck.querySelector('i').classList.remove('fa-check-circle');
        numberCheck.querySelector('i').classList.add('fa-circle');
    }
}

if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        let isValid = true;
        const nombre = document.getElementById('nombre');
        const apellido = document.getElementById('apellido');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');
        const terms = document.getElementById('terms');

        if (nombre.value.length < 2) {
            showError(nombre, 'El nombre debe tener al menos 2 caracteres');
            isValid = false;
        } else {
            clearError(nombre);
        }

        if (apellido.value.length < 2) {
            showError(apellido, 'El apellido debe tener al menos 2 caracteres');
            isValid = false;
        } else {
            clearError(apellido);
        }

        if (!validateEmail(email.value)) {
            showError(email, 'Por favor, ingresa un correo electrónico válido');
            isValid = false;
        } else {
            clearError(email);
        }

        const passwordValidation = validatePassword(password.value);
        if (!passwordValidation.isValid) {
            showError(password, 'La contraseña no cumple con los requisitos');
            isValid = false;
        } else {
            clearError(password);
        }

        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Las contraseñas no coinciden');
            isValid = false;
        } else {
            clearError(confirmPassword);
        }

        if (!terms.checked) {
            showError(terms, 'Debes aceptar los términos y condiciones');
            isValid = false;
        } else {
            clearError(terms);
        }

        if (!isValid) {
            e.preventDefault(); //Previene el submit si no es valido.
        }
    });
}

const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        clearError(input);

        if (input.type === 'email' && input.value) {
            if (!validateEmail(input.value)) {
                showError(input, 'Por favor, ingresa un correo electrónico válido');
            }
        }

        if (input.id === 'password' && input.value) {
            updatePasswordRequirements(input.value);
        }

        if (input.id === 'confirm-password' && input.value) {
            const password = document.getElementById('password');
            if (password.value !== input.value) {
                showError(input, 'Las contraseñas no coinciden');
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const registerCard = document.querySelector('.register-card');
    registerCard.style.opacity = '0';
    registerCard.style.transform = 'translateY(20px)';

    setTimeout(() => {
        registerCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        registerCard.style.opacity = '1';
        registerCard.style.transform = 'translateY(0)';
    }, 100);

    const formInputs = document.querySelectorAll('input');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transition = 'transform 0.3s ease';
            this.parentElement.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    updatePasswordRequirements('');
});