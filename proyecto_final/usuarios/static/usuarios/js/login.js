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
const togglePasswordButton = document.querySelector('.toggle-password');
if (togglePasswordButton) {
    togglePasswordButton.addEventListener('click', () => {
        const input = togglePasswordButton.previousElementSibling;
        const icon = togglePasswordButton.querySelector('i');

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
}

// Validación de formularios
const loginForm = document.getElementById('loginForm');

// Validación de correo electrónico
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Mostrar mensaje de error
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

// Limpiar mensaje de error
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

// Validación del formulario de inicio de sesión
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        // Validar email
        if (!validateEmail(email.value)) {
            showError(email, 'Por favor, ingresa un correo electrónico válido');
            isValid = false;
        } else {
            clearError(email);
        }

        // Validar contraseña
        if (password.value.length < 1) {
            showError(password, 'Por favor, ingresa tu contraseña');
            isValid = false;
        } else {
            clearError(password);
        }

        if (isValid) {
            // Animación de carga en el botón
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
            submitButton.disabled = true;

            // Simulación de envío del formulario
            setTimeout(() => {
                // Aquí iría la lógica para enviar el formulario al servidor
                alert('Inicio de sesión exitoso');
                // Simulación de redirección
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 500);
            }, 1500);
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
    });
});

// Manejar el enlace de contraseña olvidada
const forgotPasswordLink = document.querySelector('.forgot-password');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Funcionalidad de recuperación de contraseña');
        // Aquí se podría redirigir a la página de recuperación de contraseña
        // window.location.href = 'recuperar-contrasena.html';
    });
}

// Manejar los botones de inicio de sesión con redes sociales
const socialButtons = document.querySelectorAll('.social-btn');
socialButtons.forEach(button => {
    button.addEventListener('click', function() {
        const provider = this.classList.contains('google') ? 'Google' : 'Facebook';

        // Animación de carga en el botón
        const originalHTML = this.innerHTML;
        this.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Conectando con ${provider}...`;
        this.disabled = true;

        // Simulación de autenticación
        setTimeout(() => {
            alert(`Iniciando sesión con ${provider}`);
            // Aquí iría la lógica para autenticación con redes sociales
            setTimeout(() => {
                window.location.href = '/inicio/';
            }, 500);
        }, 1500);
    });
});

// Añadir efectos visuales
document.addEventListener('DOMContentLoaded', function() {
    // Animación de entrada para el formulario
    const loginCard = document.querySelector('.login-card');
    loginCard.style.opacity = '0';
    loginCard.style.transform = 'translateY(20px)';

    setTimeout(() => {
        loginCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        loginCard.style.opacity = '1';
        loginCard.style.transform = 'translateY(0)';
    }, 100);

    // Efecto de focus en los inputs
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
});