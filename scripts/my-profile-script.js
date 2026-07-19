document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Personal Profile Data
    const savedData = localStorage.getItem('userProfileData');
    if (savedData) {
        const profile = JSON.parse(savedData);
        if (document.getElementById('display-name')) document.getElementById('display-name').innerText = profile.fullName;
        if (document.getElementById('stat-favorite')) document.getElementById('stat-favorite').innerText = profile.favoriteDestination;
        if (document.getElementById('display-email')) document.getElementById('display-email').innerText = profile.email;
        if (document.getElementById('display-phone')) document.getElementById('display-phone').innerText = profile.phone;
        if (document.getElementById('display-address')) document.getElementById('display-address').innerText = profile.address;
        if (document.getElementById('display-bio')) document.getElementById('display-bio').innerText = profile.bio; 
    }

    // 2. Load Stats (Reward Points & Trips Booked)
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
        rewardPoints: 0,
        tripsBooked: 0
    };
    
    if (document.getElementById('stat-trips-count')) {
        document.getElementById('stat-trips-count').innerText = userProfile.tripsBooked;
    }
    if (document.getElementById('stat-reward-points')) {
        document.getElementById('stat-reward-points').innerText = userProfile.rewardPoints;
    }

    // 3. Load Bookings with Dynamic Images
    const bookedTrips = JSON.parse(localStorage.getItem('bookedTrips')) || [];
    const bookingsList = document.getElementById('recent-bookings-list');
    
    if (bookedTrips.length > 0) {
        // Render Recent Bookings List
        bookingsList.innerHTML = bookedTrips.map(trip => `
            <div class="booking-card">
                <img src="${trip.image}" alt="${trip.title}" class="booking-image">
                <div class="booking-info">
                    <h3>${trip.title}</h3>
                    <p>${trip.bookingDate}</p>
                </div>
                <div class="booking-status">Confirmed</div>
            </div>
        `).join('');

        // Render Upcoming Trip
        const upcomingContainer = document.getElementById('upcoming-trip-content');
        const latestTrip = bookedTrips[bookedTrips.length - 1];
        upcomingContainer.innerHTML = `
            <div class="trip-card-content">
                <img src="${latestTrip.image}" alt="${latestTrip.title}" class="upcoming-image">
                <div class="trip-details">
                    <h3>${latestTrip.title}</h3>
                    <p>Date: ${latestTrip.bookingDate}</p>
                    <p>Quantity: ${latestTrip.quantity}</p>
                </div>
            </div>
        `;
    } else {
        bookingsList.innerHTML = `
            <div class="empty-bookings">
                <h3>No Bookings Yet</h3>
                <p>You haven't booked your first beach adventure yet.</p>
            </div>
        `;
    }
});