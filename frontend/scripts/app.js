import Profile from '/frontend/scripts/components/profile.class.js';

const data = {
    first_name: 'Chris',
    last_name: 'Paschall',
    email: 'ChrisP1108@gmail.com'
}

// Instantiate Profile Class

const profile = new Profile(data);

console.log(profile.getData());

// Render HTML

document.querySelector("#app").outerHTML = profile.render();