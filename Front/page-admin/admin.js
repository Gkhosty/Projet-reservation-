// on récupère le token depuis le navigateur
const token = localStorage.getItem('token');

// si y'a pas de token on redirige vers login
if (!token) {
    window.location.href = '../page-login/login.html';
}

// on lit le role depuis le token
const payload = JSON.parse(atob(token.split('.')[1]));
const role = payload.role;

// si c'est pas un admin on redirige vers l'accueil
if (role !== 'admin') {
    window.location.href = '../page-accueil/index.html';
}

// ─── Afficher un message popup ────────────────────────────────────
function afficherPopup(message, type = 'popup-succes') {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.className = `popup ${type}`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
}

// ─── HEADER ───────────────────────────────────────────────────────
const header = document.querySelector('header');
header.className = 'header';
header.innerHTML = `
    <h1>CoiffeurProMax - Admin</h1>
    <div class="header-btns">
        <button id="btn-deconnexion" class="btn btn-secondary">
            <i class="fa-solid fa-right-from-bracket"></i> Se déconnecter
        </button>
    </div>
`;

// bouton déconnexion
document.getElementById('btn-deconnexion').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '../page-login/login.html';
});

// ─── SECTION SALONS ───────────────────────────────────────────────
const sectionSalons = document.getElementById('section-salons');
sectionSalons.innerHTML = `
    <h2>Gestion des salons</h2>

    <form id="formulaire-salon">
        <input type="text" name="nom" placeholder="Nom du salon" required>
        <input type="text" name="adresse" placeholder="Adresse du salon" required>
        <input type="text" name="contact" placeholder="Contact du salon" required>
        <button type="submit" class="btn btn-primary">Ajouter le salon</button>
    </form>

    <div id="liste-salons"></div>
`;

// afficher tous les salons
async function fetchSalons() {
    const response = await fetch('http://localhost:4242/salons');
    const salons = await response.json();

    const listeSalons = document.getElementById('liste-salons');
    listeSalons.innerHTML = '';

    salons.forEach(salon => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-buttons">
                <h3>${salon.nom}</h3>
                <p>${salon.adresse}</p>
                <p>${salon.Contact}</p>
                <button class="btn btn-supprimer" data-id="${salon.id}">Supprimer</button>
            </div>
        `;

        // bouton supprimer salon
        card.querySelector('.btn-supprimer').addEventListener('click', async () => {
            await fetch(`http://localhost:4242/salons/${salon.id}`, {
                method: 'DELETE',
                headers: { 'authorization': `Bearer ${token}` }
            });
            afficherPopup('🗑️ Salon supprimé !', 'popup-erreur');
            fetchSalons();
        });

        listeSalons.appendChild(card);
    });
}

// ajouter un salon
const formulaireSalon = document.getElementById('formulaire-salon');
formulaireSalon.addEventListener('submit', async function(event) {
    event.preventDefault();

    await fetch('http://localhost:4242/salons', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            nom: formulaireSalon.nom.value,
            adresse: formulaireSalon.adresse.value,
            Contact: formulaireSalon.Contact.value
        })
    });

    afficherPopup('✅ Salon ajouté avec succès !');
    formulaireSalon.reset();
    fetchSalons();
});

fetchSalons();

// ─── SECTION RESERVATIONS ─────────────────────────────────────────
const sectionReservations = document.getElementById('section-reservations');
sectionReservations.innerHTML = `
    <h2>Toutes les réservations</h2>
    <div id="liste-reservations"></div>
`;

// afficher toutes les réservations
async function fetchReservations() {
    const response = await fetch('http://localhost:4242/reservations', {
        headers: { 'authorization': `Bearer ${token}` }
    });
    const reservations = await response.json();

    const listeReservations = document.getElementById('liste-reservations');
    listeReservations.innerHTML = '';

    reservations.forEach(rdv => {
        const card = document.createElement('div');
        card.className = 'rdv-card';
        card.innerHTML = `
            <p>Salon : <span>${rdv.salon}</span></p>
            <p>Nom : <span>${rdv.nom}</span></p>
            <p>Email : <span>${rdv.email}</span></p>
            <p>Date : <span>${rdv.date_reservation}</span></p>
            <p>Heure : <span>${rdv.heure}</span></p>
            <p>Service : <span>${rdv.service}</span></p>
            <div class="rdv-card-buttons">
                <button class="btn-supprimer" data-id="${rdv.id}">SUPPRIMER</button>
            </div>
        `;

        // bouton supprimer réservation
        card.querySelector('.btn-supprimer').addEventListener('click', async () => {
            await fetch(`http://localhost:4242/reservations/${rdv.id}`, {
                method: 'DELETE',
                headers: { 'authorization': `Bearer ${token}` }
            });
            afficherPopup('🗑️ Réservation supprimée !', 'popup-erreur');
            fetchReservations();
        });

        listeReservations.appendChild(card);
    });
}

fetchReservations();

// ─── FOOTER ───────────────────────────────────────────────────────
const footer = document.querySelector('footer');
footer.innerHTML = `<p>© 2026 CoiffureProMax – Tous droits réservés</p>`;