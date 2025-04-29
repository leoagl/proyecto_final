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

    // Ordenar préstamos
    sortLoans.addEventListener('change', () => {
        const sortValue = sortLoans.value;
        const loansList = document.querySelector('.loans-list');
        const loansArray = Array.from(loanCards);

        loansArray.sort((a, b) => {
            if (sortValue === 'duedate-asc') {
                const dateA = new Date(a.querySelector('.due-date .value').textContent);
                const dateB = new Date(b.querySelector('.due-date .value').textContent);
                return dateA - dateB;
            } else if (sortValue === 'duedate-desc') {
                const dateA = new Date(a.querySelector('.due-date .value').textContent);
                const dateB = new Date(b.querySelector('.due-date .value').textContent);
                return dateB - dateA;
            } else if (sortValue === 'title-asc') {
                const titleA = a.querySelector('.loan-book-info h3').textContent;
                const titleB = b.querySelector('.loan-book-info h3').textContent;
                return titleA.localeCompare(titleB);
            } else if (sortValue === 'title-desc') {
                const titleA = a.querySelector('.loan-book-info h3').textContent;
                const titleB = b.querySelector('.loan-book-info h3').textContent;
                return titleB.localeCompare(titleA);
            } else if (sortValue === 'loandate-desc') {
                const dateA = new Date(a.querySelector('.loan-date .value').textContent);
                const dateB = new Date(b.querySelector('.loan-date .value').textContent);
                return dateB - dateA;
            } else if (sortValue === 'loandate-asc') {
                const dateA = new Date(a.querySelector('.loan-date .value').textContent);
                const dateB = new Date(b.querySelector('.loan-date .value').textContent);
                return dateA - dateB;
            }
            return 0;
        });

        // Limpiar y volver a añadir los elementos ordenados
        loansList.innerHTML = '';
        loansArray.forEach(card => {
            loansList.appendChild(card);
        });
    });

    // Botones de acción para préstamos
    const renewButtons = document.querySelectorAll('.loan-actions .btn-primary');
    const returnButtons = document.querySelectorAll('.loan-actions .btn-outline');

    renewButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                const loanCard = this.closest('.loan-card');
                const bookTitle = loanCard.querySelector('.loan-book-info h3').textContent;
                const dueDate = loanCard.querySelector('.due-date .value');

                // Obtener la fecha actual y calcular la nueva fecha de vencimiento (30 días más)
                const currentDueDate = new Date(dueDate.textContent);
                const newDueDate = new Date(currentDueDate);
                newDueDate.setDate(newDueDate.getDate() + 30);

                // Formatear la nueva fecha
                const formattedDate = newDueDate.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

                // Actualizar la fecha de vencimiento
                dueDate.textContent = formattedDate;

                // Actualizar el estado del préstamo
                loanCard.classList.remove('soon', 'overdue');
                loanCard.classList.add('ontime');

                const statusBadge = loanCard.querySelector('.status-badge');
                const daysIndicator = loanCard.querySelector('.soon-days, .overdue-days, .ontime-days');

                statusBadge.textContent = 'Al día';
                daysIndicator.className = 'ontime-days';
                daysIndicator.textContent = '30 días';

                // Mostrar mensaje de confirmación
                alert(`El préstamo de "${bookTitle}" ha sido renovado. Nueva fecha de vencimiento: ${formattedDate}`);

                // Deshabilitar el botón después de renovar (solo se permite una renovación)
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-check"></i> Renovado';
            });
        }
    });

    returnButtons.forEach(button => {
        button.addEventListener('click', function() {
            const loanCard = this.closest('.loan-card');
            const bookTitle = loanCard.querySelector('.loan-book-info h3').textContent;

            // Confirmar la devolución
            if (confirm(`¿Estás seguro de que deseas devolver "${bookTitle}"?`)) {
                // Simular la devolución (en una aplicación real, esto enviaría datos al servidor)
                loanCard.style.opacity = '0.5';
                loanCard.style.pointerEvents = 'none';

                // Añadir mensaje de devolución
                const returnMessage = document.createElement('div');
                returnMessage.className = 'return-message';
                returnMessage.innerHTML = '<i class="fas fa-check-circle"></i> Libro devuelto correctamente';
                loanCard.appendChild(returnMessage);

                // En una aplicación real, después de un tiempo se eliminaría el préstamo
                // o se movería al historial
                setTimeout(() => {
                    loanCard.style.height = '0';
                    loanCard.style.padding = '0';
                    loanCard.style.margin = '0';
                    loanCard.style.overflow = 'hidden';
                    loanCard.style.transition = 'all 0.5s ease';

                    setTimeout(() => {
                        loanCard.remove();

                        // Actualizar contadores
                        const activeCount = document.querySelector('.tab-btn[data-tab="current"] .count');
                        const historyCount = document.querySelector('.tab-btn[data-tab="history"] .count');

                        activeCount.textContent = parseInt(activeCount.textContent) - 1;
                        historyCount.textContent = parseInt(historyCount.textContent) + 1;

                        // Actualizar resumen
                        const totalLoans = document.querySelector('.summary-card:first-child h3');
                        totalLoans.textContent = parseInt(totalLoans.textContent) - 1;

                        if (loanCard.classList.contains('soon')) {
                            const soonLoans = document.querySelector('.summary-card:nth-child(2) h3');
                            soonLoans.textContent = parseInt(soonLoans.textContent) - 1;
                        } else if (loanCard.classList.contains('overdue')) {
                            const overdueLoans = document.querySelector('.summary-card:nth-child(3) h3');
                            overdueLoans.textContent = parseInt(overdueLoans.textContent) - 1;
                        }
                    }, 500);
                }, 2000);
            }
        });
    });

    // Botones de acción para reservas
    const cancelReservationButtons = document.querySelectorAll('.reserved-actions .btn-danger');
    const confirmPickupButton = document.querySelector('.reserved-actions .btn-primary');

    cancelReservationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reservedCard = this.closest('.reserved-card');
            const bookTitle = reservedCard.querySelector('.reserved-book-info h3').textContent;

            // Confirmar la cancelación
            if (confirm(`¿Estás seguro de que deseas cancelar la reserva de "${bookTitle}"?`)) {
                // Simular la cancelación
                reservedCard.style.opacity = '0.5';
                reservedCard.style.pointerEvents = 'none';

                // Añadir mensaje de cancelación
                const cancelMessage = document.createElement('div');
                cancelMessage.className = 'cancel-message';
                cancelMessage.innerHTML = '<i class="fas fa-times-circle"></i> Reserva cancelada';
                reservedCard.appendChild(cancelMessage);

                // En una aplicación real, después de un tiempo se eliminaría la reserva
                setTimeout(() => {
                    reservedCard.style.height = '0';
                    reservedCard.style.padding = '0';
                    reservedCard.style.margin = '0';
                    reservedCard.style.overflow = 'hidden';
                    reservedCard.style.transition = 'all 0.5s ease';

                    setTimeout(() => {
                        reservedCard.remove();

                        // Actualizar contador
                        const reservedCount = document.querySelector('.tab-btn[data-tab="reserved"] .count');
                        reservedCount.textContent = parseInt(reservedCount.textContent) - 1;
                    }, 500);
                }, 2000);
            }
        });
    });

    if (confirmPickupButton) {
        confirmPickupButton.addEventListener('click', function() {
            const reservedCard = this.closest('.reserved-card');
            const bookTitle = reservedCard.querySelector('.reserved-book-info h3').textContent;

            // Confirmar la recogida
            if (confirm(`¿Confirmas que has recogido "${bookTitle}" de la biblioteca?`)) {
                // Simular la confirmación
                reservedCard.style.opacity = '0.5';
                reservedCard.style.pointerEvents = 'none';

                // Añadir mensaje de confirmación
                const confirmMessage = document.createElement('div');
                confirmMessage.className = 'confirm-message';
                confirmMessage.innerHTML = '<i class="fas fa-check-circle"></i> Recogida confirmada';
                reservedCard.appendChild(confirmMessage);

                // En una aplicación real, después de un tiempo se movería al listado de préstamos activos
                setTimeout(() => {
                    reservedCard.style.height = '0';
                    reservedCard.style.padding = '0';
                    reservedCard.style.margin = '0';
                    reservedCard.style.overflow = 'hidden';
                    reservedCard.style.transition = 'all 0.5s ease';

                    setTimeout(() => {
                        reservedCard.remove();

                        // Actualizar contadores
                        const reservedCount = document.querySelector('.tab-btn[data-tab="reserved"] .count');
                        const activeCount = document.querySelector('.tab-btn[data-tab="current"] .count');

                        reservedCount.textContent = parseInt(reservedCount.textContent) - 1;
                        activeCount.textContent = parseInt(activeCount.textContent) + 1;

                        // Actualizar resumen
                        const totalLoans = document.querySelector('.summary-card:first-child h3');
                        totalLoans.textContent = parseInt(totalLoans.textContent) + 1;

                        alert(`El libro "${bookTitle}" ha sido añadido a tus préstamos activos.`);
                    }, 500);
                }, 2000);
            }
        });
    }

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

    // Inicializar los botones de "Volver a pedir" en el historial
    const requestAgainButtons = document.querySelectorAll('.loans-history-table .btn');
    requestAgainButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookTitle = this.closest('tr').querySelector('h4').textContent;
            alert(`Has solicitado nuevamente "${bookTitle}". Te notificaremos cuando esté disponible.`);
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-check"></i> Solicitado';
        });
    });

    // Modal de nuevo préstamo
    const modal = document.getElementById('loanModal');
    const newLoanBtn = document.getElementById('newLoanBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelLoan = document.getElementById('cancelLoan');

    // Abrir modal
    newLoanBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Evitar scroll en el body
        initializeLoanForm();
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

    // Inicializar formulario de préstamo
    function initializeLoanForm() {
        // Inicializar fechas
        const today = new Date();

        // Calcular fechas para las opciones
        const date7Days = new Date(today);
        date7Days.setDate(today.getDate() + 7);

        const date14Days = new Date(today);
        date14Days.setDate(today.getDate() + 14);

        const date30Days = new Date(today);
        date30Days.setDate(today.getDate() + 30);

        // Formatear fechas
        const formatDate = (date) => {
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        };

        // Actualizar valores en las opciones de fecha
        document.getElementById('date7Value').textContent = formatDate(date7Days);
        document.getElementById('date14Value').textContent = formatDate(date14Days);
        document.getElementById('date30Value').textContent = formatDate(date30Days);

        // Establecer fecha mínima y máxima para la fecha personalizada
        const customDateInput = document.getElementById('customDateInput');
        const minDate = new Date(today);
        minDate.setDate(today.getDate() + 1); // Mínimo 1 día

        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 60); // Máximo 60 días

        customDateInput.min = minDate.toISOString().split('T')[0];
        customDateInput.max = maxDate.toISOString().split('T')[0];
        customDateInput.value = date7Days.toISOString().split('T')[0];

        // Mostrar/ocultar fecha personalizada
        const dateOptions = document.querySelectorAll('input[name="returnDate"]');
        const customDateContainer = document.getElementById('customDateContainer');

        dateOptions.forEach(option => {
            option.addEventListener('change', function() {
                if (this.value === 'custom') {
                    customDateContainer.classList.add('active');
                } else {
                    customDateContainer.classList.remove('active');
                }
                updateLoanSummary();
            });
        });

        // Actualizar resumen al cambiar la fecha personalizada
        customDateInput.addEventListener('change', updateLoanSummary);

        // Gestionar selección de libros
        const bookCheckboxes = document.querySelectorAll('input[name="books"]');
        const selectedCount = document.getElementById('selectedCount');
        const selectedBooksList = document.getElementById('selectedBooksList');

        bookCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateSelectedBooks();
                updateLoanSummary();
            });
        });

        function updateSelectedBooks() {
            const selectedBooks = Array.from(bookCheckboxes).filter(cb => cb.checked);
            selectedCount.textContent = selectedBooks.length;

            selectedBooksList.innerHTML = '';

            if (selectedBooks.length === 0) {
                selectedBooksList.innerHTML = '<li>No has seleccionado ningún libro</li>';
                return;
            }

            selectedBooks.forEach(book => {
                const bookLabel = book.nextElementSibling;
                const bookTitle = bookLabel.querySelector('h5').textContent;

                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${bookTitle}</span>
                    <button type="button" class="remove-book" data-book-id="${book.id}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                selectedBooksList.appendChild(li);

                // Añadir evento para eliminar libro
                li.querySelector('.remove-book').addEventListener('click', function() {
                    const bookId = this.getAttribute('data-book-id');
                    document.getElementById(bookId).checked = false;
                    updateSelectedBooks();
                    updateLoanSummary();
                });
            });
        }

        // Inicializar lista de libros seleccionados
        updateSelectedBooks();

        // Actualizar resumen del préstamo
        function updateLoanSummary() {
            const selectedBooks = Array.from(bookCheckboxes).filter(cb => cb.checked);
            const summaryBooks = document.getElementById('summaryBooks');
            const summaryLoanDate = document.getElementById('summaryLoanDate');
            const summaryReturnDate = document.getElementById('summaryReturnDate');

            // Actualizar libros seleccionados
            if (selectedBooks.length === 0) {
                summaryBooks.textContent = 'Ninguno';
            } else {
                const bookTitles = selectedBooks.map(book => {
                    return book.nextElementSibling.querySelector('h5').textContent;
                });
                summaryBooks.textContent = bookTitles.join(', ');
            }

            // Actualizar fecha de préstamo (hoy)
            summaryLoanDate.textContent = formatDate(today);

            // Actualizar fecha de devolución
            const selectedDateOption = document.querySelector('input[name="returnDate"]:checked').value;
            let returnDate;

            if (selectedDateOption === 'custom') {
                returnDate = new Date(customDateInput.value);
            } else {
                returnDate = new Date(today);
                returnDate.setDate(today.getDate() + parseInt(selectedDateOption));
            }

            summaryReturnDate.textContent = formatDate(returnDate);
        }

        // Inicializar resumen
        updateLoanSummary();

        // Buscar libros
        const searchBooks = document.getElementById('searchBooks');
        const bookOptions = document.querySelectorAll('.book-option');

        searchBooks.addEventListener('input', function() {
            const searchValue = this.value.toLowerCase();

            bookOptions.forEach(option => {
                const title = option.querySelector('h5').textContent.toLowerCase();
                const author = option.querySelector('p').textContent.toLowerCase();

                if (title.includes(searchValue) || author.includes(searchValue)) {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            });
        });

        // Enviar formulario
        const loanForm = document.getElementById('loanForm');
        const confirmLoan = document.getElementById('confirmLoan');

        loanForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const selectedBooks = Array.from(bookCheckboxes).filter(cb => cb.checked);
            const termsAccepted = document.getElementById('termsAccepted').checked;

            if (selectedBooks.length === 0) {
                alert('Por favor, selecciona al menos un libro para el préstamo.');
                return;
            }

            if (!termsAccepted) {
                alert('Debes aceptar los términos y condiciones para continuar.');
                return;
            }

            // Obtener datos del préstamo
            const selectedDateOption = document.querySelector('input[name="returnDate"]:checked').value;
            let returnDate;

            if (selectedDateOption === 'custom') {
                returnDate = new Date(customDateInput.value);
            } else {
                returnDate = new Date();
                returnDate.setDate(new Date().getDate() + parseInt(selectedDateOption));
            }

            const formattedReturnDate = formatDate(returnDate);

            // Obtener títulos de libros
            const bookTitles = selectedBooks.map(book => {
                return book.nextElementSibling.querySelector('h5').textContent;
            });

            // Simular envío del formulario
            confirmLoan.disabled = true;
            confirmLoan.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

            setTimeout(() => {
                // Mostrar mensaje de éxito
                alert(`Préstamo realizado con éxito. Has solicitado ${bookTitles.length} libro(s): ${bookTitles.join(', ')}. Fecha de devolución: ${formattedReturnDate}`);

                // Cerrar modal
                closeModalFunction();

                // Actualizar contadores
                const activeCount = document.querySelector('.tab-btn[data-tab="current"] .count');
                activeCount.textContent = parseInt(activeCount.textContent) + bookTitles.length;

                // Actualizar resumen
                const totalLoans = document.querySelector('.summary-card:first-child h3');
                totalLoans.textContent = parseInt(totalLoans.textContent) + bookTitles.length;

                // Resetear formulario
                loanForm.reset();
                confirmLoan.disabled = false;
                confirmLoan.innerHTML = 'Confirmar Préstamo';

                // Recargar la página para mostrar los nuevos préstamos
                // En una aplicación real, se añadirían dinámicamente los nuevos préstamos
                location.reload();
            }, 2000);
        });
    }
});