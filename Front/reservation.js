const header = document.createElement('header');
header.innerHTML = `<h1>CoiffeurProMax</h1>`;
header.className = 'header';
document.body.prepend(header);

const section = document.createElement('section');
section.className = 'formulaire-reservation';
section.style.display = 'block';

section.innerHTML = `
    <h2>Réservation de rendez-vous</h2>

    <form id="formulaire">
        <label>Salon choisi</label>
        <input type="text" name="salon" list="salons-list" required>
        <datalist id="salons-list">
            <option value="Le Chic Atelier">
            <option value="Inès Coiffure">
            <option value="Patrise Salon">
            <option value="Hugo Studio">
            <option value="Chic & Co">
        </datalist>

        <label>Nom complet</label>
        <input type="text" name="nom" required>

        <label>Email</label>
        <input type="email" name="email" required>

        <label>Téléphone</label>
        <input type="tel" name="telephone" required>

        <label>Date souhaitée</label>
        <input type="date" name="date" required>

        <label>Heure souhaitée</label>
        <input type="time" name="heure" required>

        <label>Service demandé</label>
        <input type="text" name="service" list="services-list" required>
        <datalist id="services-list">
            <option value="Coupe">
            <option value="Coloration">
            <option value="Brushing">
            <option value="Mèches">
        </datalist>

        <label>Commentaire</label>
        <textarea name="commentaire"></textarea>

        <div class="boutons">
            <button type="submit" class="btn btn-primary">Confirmer la réservation</button>
            <a href="index.html" class="btn btn-secondary">Retour aux salons</a>
        </div>
    </form>
`;

document.body.appendChild(section);

const formulaire = document.getElementById('formulaire');

formulaire.addEventListener('submit', async function(event) {
    event.preventDefault();

    await fetch('http://localhost:4242/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            salon: formulaire.salon.value,
            nom: formulaire.nom.value,
            email: formulaire.email.value,
            telephone: formulaire.telephone.value,
            date_reservation: formulaire.date.value,
            heure: formulaire.heure.value,
            service: formulaire.service.value,
            commentaire: formulaire.commentaire.value
        })
    });

    alert('Réservation confirmée avec succès ! Sam va bientôt envoyer un message de confirmation.');
});