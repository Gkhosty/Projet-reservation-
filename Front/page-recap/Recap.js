// header
const header = document.createElement('header');
header.innerHTML = `<h1>CoiffeurProMax</h1>`;
header.className = 'header';
document.body.prepend(header);

// titre
const titre = document.createElement('h2');
titre.textContent = 'Récapitulatif de mes RDV';
titre.className = 'recap-titre';
document.body.appendChild(titre);

// div recherche email
const divRecherche = document.createElement('div');
divRecherche.className = 'recap-recherche';

const inputEmail = document.createElement('input');
inputEmail.type = 'email';
inputEmail.placeholder = 'Entrez votre email...';

const btnChercher = document.createElement('button');
btnChercher.textContent = 'Chercher';
btnChercher.className = 'btn btn-primary';

divRecherche.appendChild(inputEmail);
divRecherche.appendChild(btnChercher);
document.body.appendChild(divRecherche);

// container pour les rdv
const container = document.createElement('div');
container.id = 'rout-recap';
document.body.appendChild(container);

// afficher les rdv filtrés par email
async function fetchRDV() {
    const email = inputEmail.value;
    const response = await fetch('http://localhost:4242/reservations');
    const reservations = await response.json();

    container.innerHTML = '';

    const filtered = reservations.filter(rdv => rdv.email === email);

    filtered.forEach(rdv => {
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
            await fetch(`http://localhost:4242/reservations/${rdv.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date_reservation: inputDate.value,
                    heure: inputHeure.value
                })
            });
            fetchRDV();
        });

        const btnSupprimer = document.createElement('button');
        btnSupprimer.textContent = 'SUPRIMER';
        btnSupprimer.className = 'btn-supprimer';
        btnSupprimer.addEventListener('click', async () => {
            await fetch(`http://localhost:4242/reservations/${rdv.id}`, {
                method: 'DELETE'
            });
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

btnChercher.addEventListener('click', fetchRDV);

// lien retour
const retour = document.createElement('div');
retour.className = 'recap-retour';
retour.innerHTML = `<a href="../page-accueil/index.html" class="btn btn-secondary">← Retour aux salons</a>`;
document.body.appendChild(retour);

// footer
const footer = document.createElement('footer');
footer.innerHTML = `<p>© 2026 CoiffureProMax – Tous droits réservés</p>`;
document.body.appendChild(footer);