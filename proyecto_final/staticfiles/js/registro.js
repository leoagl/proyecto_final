// Menú móvil
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

menuToggle.addEventListener('click', () => {
    if (menuOpen) {
        mobileMenu.style.display = 'none';
        // Restaurar las barras del menú
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    } else {
        mobileMenu.style.display = 'block';
        // Animar las barras del menú a una X
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    }
    menuOpen = !menuOpen;
});

// Cerrar el menú móvil cuando se hace clic en un enlace
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.style.display = 'none';
        menuOpen = false;
        // Restaurar las barras del menú
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Actualizar el año actual en el footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Mostrar/ocultar contraseña
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

// Validación de formularios
const registerForm = document.getElementById('registerForm');

// Validación de correo electrónico
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Validación de contraseña
function validatePassword(password) {
    // Al menos 8 caracteres, una letra mayúscula y un número
    const re = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
}

// Mostrar mensaje de error
function showError(input, message) {
    const errorElement = input.parentElement.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = message;
        input.classList.add('error');
    } else {
        const formGroup = input.closest('.form-group');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.textContent = message;
            input.classList.add('error');
        }
    }
}

// Limpiar mensaje de error
function clearError(input) {
    const errorElement = input.parentElement.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = '';
        input.classList.remove('error');
    } else {
        const formGroup = input.closest('.form-group');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.textContent = '';
            input.classList.remove('error');
        }
    }
}

// Validación del formulario de registro
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;
        const firstName = document.getElementById('register-firstname');
        const lastName = document.getElementById('register-lastname');
        const email = document.getElementById('register-email');
        const password = document.getElementById('register-password');
        const confirmPassword = document.getElementById('register-confirm-password');
        const terms = document.getElementById('terms');

        // Validar nombre
        if (firstName.value.length < 2) {
            showError(firstName, 'El nombre debe tener al menos 2 caracteres');
            isValid = false;
        } else {
            clearError(firstName);
        }

        // Validar apellido
        if (lastName.value.length < 2) {
            showError(lastName, 'El apellido debe tener al menos 2 caracteres');
            isValid = false;
        } else {
            clearError(lastName);
        }

        // Validar email
        if (!validateEmail(email.value)) {
            showError(email, 'Por favor, ingresa un correo electrónico válido');
            isValid = false;
        } else {
            clearError(email);
        }

        // Validar contraseña
        if (!validatePassword(password.value)) {
            showError(password, 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número');
            isValid = false;
        } else {
            clearError(password);
        }

        // Validar confirmación de contraseña
        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Las contraseñas no coinciden');
            isValid = false;
        } else {
            clearError(confirmPassword);
        }

        // Validar términos y condiciones
        if (!terms.checked) {
            showError(terms, 'Debes aceptar los términos y condiciones');
            isValid = false;
        } else {
            clearError(terms);
        }

        if (isValid) {
            // Aquí iría la lógica para enviar el formulario al servidor
            alert('Registro exitoso');
            // Simulación de redirección
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    });
}

// Validación en tiempo real
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        // Limpiar errores al escribir
        clearError(input);

        // Validación específica para cada tipo de input
        if (input.type === 'email' && input.value) {
            if (!validateEmail(input.value)) {
                showError(input, 'Por favor, ingresa un correo electrónico válido');
            }
        }

        if (input.id === 'register-password' && input.value) {
            if (!validatePassword(input.value)) {
                showError(input, 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número');
            }
        }

        if (input.id === 'register-confirm-password' && input.value) {
            const password = document.getElementById('register-password');
            if (password.value !== input.value) {
                showError(input, 'Las contraseñas no coinciden');
            }
        }
    });
});

// Manejar los botones de registro con redes sociales
const socialButtons = document.querySelectorAll('.social-btn');
socialButtons.forEach(button => {
    button.addEventListener('click', function() {
        const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
        alert(`Registrándose con ${provider}`);
        // Aquí iría la lógica para registro con redes sociales
    });
});

// Manejar los enlaces de términos y condiciones
const termsLinks = document.querySelectorAll('.terms-link');
termsLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const type = this.textContent.includes('términos') ? 'términos y condiciones' : 'política de privacidad';
        alert(`Mostrando ${type}`);
        // Aquí se podría redirigir a la página correspondiente
    });
});