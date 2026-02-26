// affichage Header
const header = document.createElement('header');
header.className = 'header';

// on vérifie si l'utilisateur est connecté
const token = localStorage.getItem('token');

if (token) {
    header.innerHTML = `
        <h1>CoiffeurProMax</h1>
        <div class="header-btns">
            <a href="../page-recap/Recap.html" class="btn btn-secondary">
                <i class="fa-solid fa-calendar-check"></i> Mes Rendez-vous
            </a>
            <button id="btn-deconnexion" class="btn btn-secondary">
                <i class="fa-solid fa-right-from-bracket"></i> Se déconnecter
            </button>
        </div>
    `;
} else {
    header.innerHTML = `
        <h1>CoiffeurProMax</h1>
        <div class="header-btns">
            <a href="../page-login/login.html" class="btn btn-secondary">
                <i class="fa-solid fa-user"></i> Se connecter
            </a>
        </div>
    `;
}

document.body.prepend(header);

// bouton deconnexion
const btnDeconnexion = document.getElementById('btn-deconnexion');
if (btnDeconnexion) {
    btnDeconnexion.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '../page-login/login.html';
    });
}

// ajouter un searchBar
const searchBar = document.createElement('div');
searchBar.className = 'recherche';
searchBar.innerHTML = `
<input type="text" id="search-input" placeholder="Chercher un salon...">
<button id="btn-chercher" class="btn btn-primary">Chercher</button>
`;
const routDiv = document.getElementById('rout');
document.body.insertBefore(searchBar, routDiv);

const aside = document.createElement('aside');
aside.className = 'contact';
aside.innerHTML = `
<h2>Contact</h2>
<p>📞 Tél : 01 23 45 67 65</p>
<p>✉️ Email : contact@coifferpromax.fr</p>
`;
document.body.appendChild(aside);

// footer 
const footer = document.createElement('footer');
footer.innerHTML = `<p>© 2026 CoiffureProMax — Tous droits réservés</p>`;
document.body.appendChild(footer);

// afficher les salons
async function fetchData(search = '') {
    const response = await fetch('http://localhost:4242/salons');
    const salons = await response.json();

    const container = document.getElementById('rout');
    container.innerHTML = '';

    const filtered = salons.filter(salon =>
        salon.nom.toLowerCase().includes(search.toLowerCase())
    );

    filtered.map(salon => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-buttons">
                <h3>${salon.nom}</h3>
                <p>${salon.adresse}</p>
                <p>${salon.Contact}</p>
                <button class="btn btn-primary btn-reserver" data-salon="${encodeURIComponent(salon.nom)}">Réserver</button>
            </div>
        `;
        container.appendChild(card);
    });
}

document.getElementById('rout').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-reserver')) {
        const token = localStorage.getItem('token');
        const salon = e.target.dataset.salon;

        if (!token) {
            window.location.href = '../page-login/login.html';
        } else {
            window.location.href = `../page-reservation/reservation.html?salon=${salon}`;
        }
    }
});

document.getElementById('btn-chercher').addEventListener('click', () => {
    const search = document.getElementById('search-input').value;
    fetchData(search);
});

fetchData();