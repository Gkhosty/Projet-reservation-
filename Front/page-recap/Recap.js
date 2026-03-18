// header
const header = document.createElement('header');
header.innerHTML = `<h1>CoiffeurProMax</h1>`;
header.className = 'header';
document.body.prepend(header);

// ─── Afficher un message popup ────
function afficherPopup(message, type = 'popup-succes') {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.className = `popup ${type}`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
}

// titre
const titre = document.createElement('h2');
titre.textContent = 'Récapitulatif de mes RDV';
titre.className = 'recap-titre';
document.body.appendChild(titre);

// container pour les rdv
const container = document.createElement('div');
container.id = 'rout-recap';
document.body.appendChild(container);

// on récupère le token depuis le navigateur
const token = localStorage.getItem('token');

// si y'a pas de token on redirige vers login
if (!token) {
    window.location.href = '../page-login/login.html';
}

// afficher les rdv de l'utilisateur connecté
async function fetchRDV() {
    const response = await fetch('https://projet-reservation-rho.vercel.app/reservations', {
        headers: { 'authorization': `Bearer ${token}` }
    });
    const reservations = await response.json();

    container.innerHTML = '';

    // on affiche directement les réservations retournées par le serveur
    reservations.forEach(rdv => {
        const card = document.createElement('div');
        card.className = 'rdv-card';

        card.innerHTML = `
            <p>Salon : <span>${rdv.salon}</span></p>
            <p>Nom : <span>${rdv.nom}</span></p>
            <p>Date : <span>${rdv.date_reservation}</span></p>
            <p>Heure : <span>${rdv.heure}</span></p>
            <p>Service : <span>${rdv.service}</span></p>
        `;

        const inputDate = document.createElement('input');
        inputDate.type = 'date';
        inputDate.value = rdv.date_reservation.substring(0, 10);

        const inputHeure = document.createElement('input');
        inputHeure.type = 'time';
        inputHeure.value = rdv.heure;

        const divBoutons = document.createElement('div');
        divBoutons.className = 'rdv-card-buttons';

        const btnModifier = document.createElement('button');
        btnModifier.textContent = 'MODIFICATION';
        btnModifier.className = 'btn-modifier';
        btnModifier.addEventListener('click', async () => {
            await fetch(`https://projet-reservation-rho.vercel.app/reservations/${rdv.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date_reservation: inputDate.value,
                    heure: inputHeure.value
                })
            });
            afficherPopup('✅ RDV modifié avec succès !');
            fetchRDV();
        });

        const btnSupprimer = document.createElement('button');
        btnSupprimer.textContent = 'SUPRIMER';
        btnSupprimer.className = 'btn-supprimer';
        btnSupprimer.addEventListener('click', async () => {
            await fetch(`https://projet-reservation-rho.vercel.app/reservations/${rdv.id}`, {
                method: 'DELETE'
            });
            afficherPopup('🗑️ RDV supprimé !', 'popup-erreur');
            fetchRDV();
        });

        divBoutons.appendChild(btnModifier);
        divBoutons.appendChild(btnSupprimer);

        card.appendChild(inputDate);
        card.appendChild(inputHeure);
        card.appendChild(divBoutons);

        container.appendChild(card);
    });
}

fetchRDV();

// lien retour
const retour = document.createElement('div');
retour.className = 'recap-retour';
retour.innerHTML = `<a href="../page-accueil/index.html" class="btn btn-secondary">← Retour aux salons</a>`;
document.body.appendChild(retour);

// footer
const footer = document.createElement('footer');
footer.innerHTML = `<p>© 2026 CoiffureProMax – Tous droits réservés</p>`;
document.body.appendChild(footer);