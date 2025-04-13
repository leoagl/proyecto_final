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

/*// Funcionalidad para los botones de inicio de sesión y registro
const loginButtons = document.querySelectorAll('.btn-outline, .btn-outline-light');
loginButtons.forEach(button => {
    button.addEventListener('click', () => {
        alert('Redirigiendo a la página de inicio de sesión...');
        // Aquí se podría redirigir a la página de inicio de sesión
        // window.location.href = 'login.html';
    });
});

const registerButtons = document.querySelectorAll('.btn-primary, .btn-light');
registerButtons.forEach(button => {
    if (button.textContent.includes('Registrarse')) {
        button.addEventListener('click', () => {
            alert('Redirigiendo a la página de registro...');
            // Aquí se podría redirigir a la página de registro
            // window.location.href = 'register.html';
        });
    }
});*/

// Funcionalidad para los botones de detalles de libros
const detailButtons = document.querySelectorAll('.book-card .btn-small');
detailButtons.forEach(button => {
    button.addEventListener('click', () => {
        const bookTitle = button.closest('.book-card').querySelector('h3').textContent;
        alert(`Mostrando detalles del libro: ${bookTitle}`);
        // Aquí se podría redirigir a la página de detalles del libro
        // window.location.href = `book-details.html?title=${encodeURIComponent(bookTitle)}`;
    });
});

// Funcionalidad para el formulario de búsqueda
const searchForm = document.querySelector('.search-box');
const searchInput = searchForm.querySelector('input');
const searchButton = searchForm.querySelector('button');

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        alert(`Buscando: ${searchTerm}`);
        // Aquí se podría redirigir a la página de resultados de búsqueda
        // window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
    } else {
        alert('Por favor, ingresa un término de búsqueda');
    }
});

// Añadir funcionalidad de búsqueda al presionar Enter
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchButton.click();
    }
});