document.getElementById('editProfileForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Stop the form from submitting normally

    // data object
    const profileData = {
        fullName: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        favoriteDestination: document.getElementById('favorite-destination').value,
        bio: document.getElementById('bio').value
    };

    // 2. Save as JSON string to localStorage
    localStorage.setItem('userProfileData', JSON.stringify(profileData));

    // 3. Redirect to profile page
    window.location.href = '../pages/my-profile.html';
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check for existing data
    const savedData = localStorage.getItem('userProfileData');
    
    if (savedData) {
        const profile = JSON.parse(savedData);
        
        // 2. Pre-fill the form fields if the element exists
        if (document.getElementById('fullname')) document.getElementById('fullname').value = profile.fullName;
        if (document.getElementById('email')) document.getElementById('email').value = profile.email;
        if (document.getElementById('phone')) document.getElementById('phone').value = profile.phone;
        if (document.getElementById('address')) document.getElementById('address').value = profile.address;
        if (document.getElementById('favorite-destination')) document.getElementById('favorite-destination').value = profile.favoriteDestination;
        if (document.getElementById('bio')) document.getElementById('bio').value = profile.bio;
    }
});