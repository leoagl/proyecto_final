document.addEventListener('DOMContentLoaded', function() {
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

    // Tabs de préstamos
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Quitar clase activa de todos los botones
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Añadir clase activa al botón seleccionado
            button.classList.add('active');

            // Mostrar el contenido correspondiente
            const tabId = button.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Filtrar préstamos
    const statusFilter = document.getElementById('statusFilter');
    const sortLoans = document.getElementById('sortLoans');
    const searchLoans = document.getElementById('searchLoans');
    const loanCards = document.querySelectorAll('.loan-card');

    function filterLoans() {
        const statusValue = statusFilter.value;
        const searchValue = searchLoans.value.toLowerCase();

        loanCards.forEach(card => {
            const title = card.querySelector('.loan-book-info h3').textContent.toLowerCase();
            const author = card.querySelector('.book-author').textContent.toLowerCase();
            const matchesSearch = title.includes(searchValue) || author.includes(searchValue);

            let matchesStatus = true;
            if (statusValue !== 'all') {
                matchesStatus = card.classList.contains(statusValue);
            }

            if (matchesSearch && matchesStatus) {
                card.style.display = 'grid';
            } else {
                card.style.display = 'none';
            }
        });
    }

    statusFilter.addEventListener('change', filterLoans);
    searchLoans.addEventListener('input', filterLoans);

    // Paginación en el historial
    const paginationButtons = document.querySelectorAll('.pagination-btn');

    paginationButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                // Quitar clase activa de todos los botones
                paginationButtons.forEach(btn => btn.classList.remove('active'));

                // Añadir clase activa al botón seleccionado
                if (!this.querySelector('i')) {
                    this.classList.add('active');
                }

                // En una aplicación real, aquí se cargarían los datos de la página seleccionada
                // Simulamos una carga
                const historyTable = document.querySelector('.loans-history-table tbody');
                historyTable.innerHTML = '<tr><td colspan="5" class="loading-message"><i class="fas fa-spinner fa-spin"></i> Cargando datos...</td></tr>';

                setTimeout(() => {
                    // Restaurar los datos originales (en una aplicación real, se cargarían nuevos datos)
                    historyTable.innerHTML = `
                        <tr>
                            <td class="book-cell">
                                <img src="https://via.placeholder.com/40x60/8b5cf6/FFFFFF?text=El+Aleph" alt="El Aleph">
                                <div>
                                    <h4>El Aleph</h4>
                                    <p>Jorge Luis Borges</p>
                                </div>
                            </td>
                            <td>10 Marzo, 2023</td>
                            <td>9 Abril, 2023</td>
                            <td><span class="status-pill completed">Devuelto a tiempo</span></td>
                            <td>
                                <button class="btn btn-sm btn-outline">
                                    <i class="fas fa-redo"></i>
                                    Volver a pedir
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td class="book-cell">
                                <img src="https://via.placeholder.com/40x60/ef4444/FFFFFF?text=La+Casa" alt="La Casa de los Espíritus">
                                <div>
                                    <h4>La Casa de los Espíritus</h4>
                                    <p>Isabel Allende</p>
                                </div>
                            </td>
                            <td>5 Febrero, 2023</td>
                            <td>15 Marzo, 2023</td>
                            <td><span class="status-pill late">Devuelto con retraso</span></td>
                            <td>
                                <button class="btn btn-sm btn-outline">
                                    <i class="fas fa-redo"></i>
                                    Volver a pedir
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td class="book-cell">
                                <img src="https://via.placeholder.com/40x60/10b981/FFFFFF?text=Cosmos" alt="Cosmos">
                                <div>
                                    <h4>Cosmos</h4>
                                    <p>Carl Sagan</p>
                                </div>
                            </td>
                            <td>20 Enero, 2023</td>
                            <td>19 Febrero, 2023</td>
                            <td><span class="status-pill completed">Devuelto a tiempo</span></td>
                            <td>
                                <button class="btn btn-sm btn-outline">
                                    <i class="fas fa-redo"></i>
                                    Volver a pedir
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td class="book-cell">
                                <img src="https://via.placeholder.com/40x60/6366f1/FFFFFF?text=El+Amor" alt="El Amor en los Tiempos del Cólera">
                                <div>
                                    <h4>El Amor en los Tiempos del Cólera</h4>
                                    <p>Gabriel García Márquez</p>
                                </div>
                            </td>
                            <td>5 Diciembre, 2022</td>
                            <td>4 Enero, 2023</td>
                            <td><span class="status-pill completed">Devuelto a tiempo</span></td>
                            <td>
                                <button class="btn btn-sm btn-outline">
                                    <i class="fas fa-redo"></i>
                                    Volver a pedir
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td class="book-cell">
                                <img src="https://via.placeholder.com/40x60/f59e0b/FFFFFF?text=Ficciones" alt="Ficciones">
                                <div>
                                    <h4>Ficciones</h4>
                                    <p>Jorge Luis Borges</p>
                                </div>
                            </td>
                            <td>10 Noviembre, 2022</td>
                            <td>20 Diciembre, 2022</td>
                            <td><span class="status-pill late">Devuelto con retraso</span></td>
                            <td>
                                <button class="btn btn-sm btn-outline">
                                    <i class="fas fa-redo"></i>
                                    Volver a pedir
                                </button>
                            </td>
                        </tr>
                    `;

                    // Volver a añadir los event listeners a los botones
                    const requestAgainButtons = document.querySelectorAll('.loans-history-table .btn');
                    requestAgainButtons.forEach(btn => {
                        btn.addEventListener('click', function() {
                            const bookTitle = this.closest('tr').querySelector('h4').textContent;
                            alert(`Has solicitado nuevamente "${bookTitle}". Te notificaremos cuando esté disponible.`);
                            this.disabled = true;
                            this.innerHTML = '<i class="fas fa-check"></i> Solicitado';
                        });
                    });
                }, 1000);
            });
        }
    });

    // Modal de nuevo préstamo
    const modal = document.getElementById('loanModal');
    const newLoanBtn = document.getElementById('newLoanBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelLoan = document.getElementById('cancelLoan');
    const availableBooksContainer = document.querySelector('#loanModal .available-books');

    // Abrir modal
    newLoanBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Evitar scroll en el body
    });


    // Cerrar modal
    function closeModalFunction() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaurar scroll en el body
    }

    closeModal.addEventListener('click', closeModalFunction);
    cancelLoan.addEventListener('click', closeModalFunction);

    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunction();
        }
    });
});