document.addEventListener('DOMContentLoaded', function() {
    // Movie data
    const movies = [
        {
            id: 1,
            title: "Avengers: Endgame",
            genre: "Action, Adventure, Sci-Fi",
            duration: 181,
            language: "English",
            screen: "IMAX",
            poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
            times: ["10:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"]
        },
        {
            id: 2,
            title: "The Lion King",
            genre: "Animation, Adventure, Drama",
            duration: 118,
            language: "English, Hindi",
            screen: "3D",
            poster: "https://m.media-amazon.com/images/M/MV5BMjIwMjE1Nzc4NV5BMl5BanBnXkFtZTgwNDg4OTA1NzM@._V1_.jpg",
            times: ["9:30 AM", "1:00 PM", "4:30 PM", "8:00 PM"]
        },
        {
            id: 3,
            title: "Joker",
            genre: "Crime, Drama, Thriller",
            duration: 122,
            language: "English",
            screen: "Dolby",
            poster: "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
            times: ["11:00 AM", "3:00 PM", "7:00 PM", "10:30 PM"]
        },
        {
            id: 4,
            title: "Parasite",
            genre: "Comedy, Drama, Thriller",
            duration: 132,
            language: "Korean",
            screen: "Standard",
            poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
            times: ["12:00 PM", "3:30 PM", "7:30 PM", "11:00 PM"]
        }
    ];

    // DOM elements
    const moviesGrid = document.querySelector('.movies-grid');
    const bookingModal = document.querySelector('.booking-modal');
    const confirmationModal = document.querySelector('.confirmation-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeConfirmationBtn = document.querySelector('.close-confirmation');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const bookingForm = document.getElementById('booking-form');
    const timeSlotsContainer = document.getElementById('time-slots');
    const seatsContainer = document.getElementById('seats-container');
    const selectedSeatsCount = document.getElementById('selected-seats-count');
    const selectedSeatsInput = document.getElementById('selected-seats');

    // Modal elements
    const modalTitle = document.getElementById('modal-title');
    const modalGenre = document.getElementById('modal-genre');
    const modalDuration = document.getElementById('modal-duration');
    const modalLanguage = document.getElementById('modal-language');
    const modalScreen = document.getElementById('modal-screen');
    const modalPoster = document.getElementById('modal-poster');
    const confirmationDetails = document.getElementById('confirmation-details');

    // Current selected movie, time and seats
    let selectedMovie = null;
    let selectedTime = null;
    let selectedSeats = [];

    // Display movies
    function displayMovies() {
        moviesGrid.innerHTML = '';
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <div class="movie-meta">
                        <span>${movie.language}</span>
                        <span>${movie.screen}</span>
                        <span>${movie.duration} min</span>
                    </div>
                    <button class="book-btn" data-id="${movie.id}">Book Now</button>
                </div>
            `;
            moviesGrid.appendChild(movieCard);
        });

        // Add event listeners to book buttons
        document.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const movieId = parseInt(this.getAttribute('data-id'));
                openBookingModal(movieId);
            });
        });
    }

    // Open booking modal
    function openBookingModal(movieId) {
        selectedMovie = movies.find(movie => movie.id === movieId);
        selectedTime = null;
        selectedSeats = [];
        updateSelectedSeatsCount();

        // Set modal content
        modalTitle.textContent = selectedMovie.title;
        modalGenre.textContent = selectedMovie.genre;
        modalDuration.textContent = selectedMovie.duration;
        modalLanguage.textContent = selectedMovie.language;
        modalScreen.textContent = selectedMovie.screen;
        modalPoster.src = selectedMovie.poster;
        modalPoster.alt = selectedMovie.title;

        // Display time slots
        timeSlotsContainer.innerHTML = '';
        selectedMovie.times.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            timeSlot.addEventListener('click', function() {
                document.querySelectorAll('.time-slot').forEach(slot => {
                    slot.classList.remove('selected');
                });
                this.classList.add('selected');
                selectedTime = time;
                generateSeats();
            });
            timeSlotsContainer.appendChild(timeSlot);
        });

        // Generate initial seats (empty until time is selected)
        seatsContainer.innerHTML = '';

        // Show modal
        bookingModal.style.display = 'block';
    }

    // Generate seats for selected time
    function generateSeats() {
        seatsContainer.innerHTML = '';
        
        // Create seats (5 rows A-E, 10 seats per row)
        for (let row = 0; row < 5; row++) {
            const rowLetter = String.fromCharCode(65 + row); // A, B, C, D, E
            
            for (let seatNum = 1; seatNum <= 10; seatNum++) {
                const seatId = `${rowLetter}${seatNum}`;
                const seat = document.createElement('div');
                seat.className = 'seat available';
                seat.textContent = seatId;
                seat.dataset.id = seatId;
                
                // Randomly occupy some seats (for demo)
                if (Math.random() < 0.3) {
                    seat.classList.remove('available');
                    seat.classList.add('occupied');
                }
                
                seat.addEventListener('click', function() {
                    if (this.classList.contains('occupied')) return;
                    
                    this.classList.toggle('selected');
                    
                    if (this.classList.contains('selected')) {
                        if (!selectedSeats.includes(seatId)) {
                            selectedSeats.push(seatId);
                        }
                    } else {
                        selectedSeats = selectedSeats.filter(id => id !== seatId);
                    }
                    
                    updateSelectedSeatsCount();
                });
                
                seatsContainer.appendChild(seat);
            }
        }
    }

    // Update selected seats count display
    function updateSelectedSeatsCount() {
        selectedSeatsCount.textContent = selectedSeats.length;
        selectedSeatsInput.value = selectedSeats.join(', ');
    }

    // Close modals
    function closeModals() {
        bookingModal.style.display = 'none';
        confirmationModal.style.display = 'none';
    }

    // Event listeners
    closeModalBtn.addEventListener('click', closeModals);
    closeConfirmationBtn.addEventListener('click', closeModals);
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', closeModals);
    });

    // Booking form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!selectedTime) {
            alert('Movie Successfully Booked! The Ticket Has Been Sent To Your Email! Thank You For Booking!');
            return;
        }
        
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        // Show confirmation
        confirmationDetails.innerHTML = `
            <p><strong>Movie:</strong> ${selectedMovie.title}</p>
            <p><strong>Showtime:</strong> ${selectedTime}</p>
            <p><strong>Screen:</strong> ${selectedMovie.screen}</p>
            <p><strong>Seats:</strong> ${selectedSeats.join(', ')}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p>A confirmation has been sent to your email.</p>
        `;

        // Close booking modal and open confirmation
        bookingModal.style.display = 'none';
        confirmationModal.style.display = 'block';
        
        // Reset form
        this.reset();
        selectedSeats = [];
        updateSelectedSeatsCount();
    });

    // Initialize the page
    displayMovies();
});