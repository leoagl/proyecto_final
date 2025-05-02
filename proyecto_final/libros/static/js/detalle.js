document.addEventListener('DOMContentLoaded', function() {
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

    // Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Sistema de calificación
    const starRatings = document.querySelectorAll('.star-rating');

    starRatings.forEach(ratingContainer => {
        const stars = ratingContainer.querySelectorAll('i');
        const ratingText = ratingContainer.nextElementSibling;

        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.className = 'fas fa-star';
                    } else {
                        s.className = 'far fa-star';
                    }
                });
                if (ratingText) updateRatingText(rating, ratingText);
            });

            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.className = 'fas fa-star active';
                    } else {
                        s.className = 'far fa-star';
                    }
                });
                ratingContainer.setAttribute('data-selected-rating', rating);
                if (ratingText) updateRatingText(rating, ratingText);
            });

            ratingContainer.addEventListener('mouseleave', function() {
                const selectedRating = parseInt(this.getAttribute('data-selected-rating')) || 0;
                stars.forEach((s, index) => {
                    if (index < selectedRating) {
                        s.className = 'fas fa-star active';
                    } else {
                        s.className = 'far fa-star';
                    }
                });
                if (ratingText) {
                    if (selectedRating > 0) updateRatingText(selectedRating, ratingText);
                    else ratingText.textContent = 'Selecciona una calificación';
                }
            });
        });
    });

    function updateRatingText(rating, element) {
        const ratingTexts = [
            'Selecciona una calificación',
            'No me gustó',
            'Está bien',
            'Bueno',
            'Muy bueno',
            'Excelente'
        ];
        element.textContent = ratingTexts[rating];
    }

    const helpfulButtons = document.querySelectorAll('.btn-helpful');
    helpfulButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            const countSpan = this.querySelector('span');
            let count = parseInt(countSpan.textContent.match(/\d+/)[0]);
            this.querySelector('i').className = this.classList.contains('active') ? 'fas fa-thumbs-up' : 'far fa-thumbs-up';
            countSpan.textContent = `Útil (${this.classList.contains('active') ? count + 1 : count - 1})`;
        });
    });

    const paginationButtons = document.querySelectorAll('.pagination-btn');
    paginationButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                paginationButtons.forEach(btn => btn.classList.remove('active'));
                if (!this.querySelector('i')) this.classList.add('active');
                const reviewsList = document.querySelector('.reviews-list');
                if (reviewsList) {
                    reviewsList.style.opacity = '0.5';
                    setTimeout(() => {
                        reviewsList.style.opacity = '1';
                    }, 500);
                }
            });
        }
    });

    const reviewModal = document.getElementById('reviewModal');
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    const closeReviewModal = document.getElementById('closeReviewModal');
    const cancelReview = document.getElementById('cancelReview');
    const reviewForm = document.getElementById('reviewForm');

    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', () => {
            reviewModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    function closeReviewModalFunction() {
        reviewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (closeReviewModal) closeReviewModal.addEventListener('click', closeReviewModalFunction);
    if (cancelReview) cancelReview.addEventListener('click', closeReviewModalFunction);

    if (reviewModal) {
        reviewModal.addEventListener('click', (e) => {
            if (e.target === reviewModal) closeReviewModalFunction();
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const selectedRating = document.querySelector('.modal-rating-input .star-rating').getAttribute('data-selected-rating');
            const reviewContent = document.getElementById('reviewContent').value;
            const libroId = window.location.pathname.split('/').filter(Boolean).pop();

            if (!selectedRating || selectedRating === '0') {
                alert('Por favor, selecciona una calificación.');
                return;
            }

            if (reviewContent.length < 50) {
                alert('Tu reseña debe tener al menos 50 caracteres.');
                return;
            }

            const formData = new FormData(this);
            formData.append('calificacion', selectedRating);
            formData.append('comentario', reviewContent);

            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            fetch(`/libros/libro/${libroId}/reseña/crear/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: formData,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Publicar reseña';
                closeReviewModalFunction();
                window.location.reload();
            })
            .catch(error => {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Publicar reseña';
                alert('Error de red al enviar la reseña.');
                console.error('Error:', error);
            });
        });
    }
});

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                // ¿Esta cookie comienza con el nombre que queremos?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }