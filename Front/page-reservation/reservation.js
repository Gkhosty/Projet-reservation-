// header
const header = document.createElement('header');
header.innerHTML = `<h1>CoiffeurProMax</h1>`;
header.className = 'header';
document.body.prepend(header);

// récupérer le nom du salon depuis l'URL
const params = new URLSearchParams(window.location.search);
const nomSalon = params.get('salon');

// on récupère le token depuis le navigateur
const token = localStorage.getItem('token');

// si y'a pas de token on redirige vers login
if (!token) {
    window.location.href = '../page-login/login.html';
}

const section = document.createElement('section');
section.className = 'formulaire-reservation';

section.innerHTML = `
    <h2>Réservation - ${nomSalon}</h2>

    <form id="formulaire">

        <label>Nom et Prenom</label>
        <input type="text" name="nom" required>

        <label>Email</label>
        <input type="email" name="email" required>

        <label>Téléphone</label>
        <input type="tel" name="telephone" required>

        <label>Date souhaitée</label>
        <input type="date" name="date" required>

        <label>Heure souhaitée</label>
        <select name="heure" required>
            <option value="">-- Choisir une heure --</option>
            <option value="09:00">09:00</option>
            <option value="09:30">09:30</option>
            <option value="10:00">10:00</option>
            <option value="10:30">10:30</option>
            <option value="11:00">11:00</option>
            <option value="11:30">11:30</option>
            <option value="12:00">12:00</option>
            <option value="14:30">14:30</option>
            <option value="15:00">15:00</option>
            <option value="15:30">15:30</option>
            <option value="16:00">16:00</option>
            <option value="16:30">16:30</option>
            <option value="17:00">17:00</option>
            <option value="17:30">17:30</option>
            <option value="18:00">18:00</option>
            <option value="18:30">18:30</option>
            <option value="19:00">19:00</option>
            <option value="19:30">19:30</option>
            <option value="20:00">20:00</option>
            <option value="20:30">20:30</option>
            <option value="21:00">21:00</option>
        </select>

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
            <a href="../page-accueil/index.html" class="btn btn-secondary">Retour aux salons</a>
        </div>
    </form>
`;

document.body.appendChild(section);

// date minimum = toujours demain
const demain = new Date();
demain.setDate(demain.getDate() + 1);
const demainFormate = demain.toISOString().split('T')[0];
document.querySelector('input[name="date"]').min = demainFormate;

const formulaire = document.getElementById('formulaire');

formulaire.addEventListener('submit', async function(event) {
    event.preventDefault();

    // on envoie le token dans le header pour dire au serveur qui on est
    const response = await fetch('http://localhost:4242/reservations', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            salon: nomSalon,
            nom: formulaire.nom.value,
            email: formulaire.email.value,
            telephone: formulaire.telephone.value,
            date_reservation: formulaire.date.value,
            heure: formulaire.heure.value,
            service: formulaire.service.value,
            commentaire: formulaire.commentaire.value
        })
    });

    if (response.ok) {
        window.location.href = '../page-recap/Recap.html';
    } else {
        const data = await response.json();
        alert(data.erreur);
    }
});