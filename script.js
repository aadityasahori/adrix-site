// Admin Password (Change this in production!)
const ADMIN_PASSWORD = 'baithak123';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('reviewForm')) {
        initReviewForm();
    }
    if (document.querySelector('.admin-page')) {
        loadAdminData();
    }
});

// Review Form Functions
function initReviewForm() {
    const stars = document.querySelectorAll('.star');
    const ratingText = document.querySelector('.rating-text');
    let rating = 0;

    stars.forEach(star => {
        star.addEventListener('click', function() {
            rating = this.dataset.value;
            updateStars(rating);
            ratingText.textContent = `You rated ${rating} star${rating > 1 ? 's' : ''}`;
            document.querySelector('#reviewForm').dataset.rating = rating;
        });

        star.addEventListener('mouseover', function() {
            if (rating === 0) {
                updateStars(this.dataset.value);
            }
        });
    });

    document.querySelector('#reviewForm').addEventListener('mouseleave', function() {
        if (rating > 0) {
            updateStars(rating);
        } else {
            stars.forEach(s => s.classList.remove('active'));
            ratingText.textContent = 'Click to rate';
        }
    });

    document.getElementById('reviewForm').addEventListener('submit', submitReview);
}

function updateStars(ratingValue) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < ratingValue) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

async function submitReview(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const rating = e.target.dataset.rating;
    
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            body: JSON.stringify({
                action: 'submit_review',
                rating: rating,
                name: formData.get('name'),
                experience: formData.get('experience')
            })
        });

        const result = await response.json();
        
        if (result.success) {
            document.getElementById('reviewForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
        } else {
            alert('Error submitting review: ' + result.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Admin Functions
function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        loadAdminData();
    } else {
        alert('Invalid password!');
    }
}

async function loadAdminData() {
    try {
        const response = await fetch('api.php?action=get_reviews');
        const reviews = await response.json();
        
        updateStats(reviews);
        displayReviews(reviews);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function updateStats(reviews) {
    const totalReviews = reviews.length;
    const avgRating = reviews.length ? 
        (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;
    const todayReviews = reviews.filter(r => 
        new Date(r.created_at).toDateString() === new Date().toDateString()
    ).length;

    document.getElementById('totalReviews').textContent = totalReviews;
    document.getElementById('avgRating').textContent = avgRating;
    document.getElementById('todayReviews').textContent = todayReviews;
}

function displayReviews(reviews) {
    const tbody = document.getElementById('reviewsTableBody');
    tbody.innerHTML = '';

    reviews.forEach(review => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${review.name}</td>
            <td>${'★'.repeat(review.rating)}${'☆
