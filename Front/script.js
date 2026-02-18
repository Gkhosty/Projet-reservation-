
// affichage Header et en haut avec prepend method

const header = document.createElement('header');
header.innerHTML = `<h1>CoiffeurProMax</h1>`;
header.className = 'header';
document.body.prepend(header);

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

const footer = document.createElement('footer');
footer.innerHTML = `<p>© 2026 CoiffureProMax — Tous droits réservés</p>`;
document.body.appendChild(footer);

async function fetchData(search = '') {
    const response = await fetch('http://localhost:4242/salons');
    const salons = await response.json();
    console.log('salons:', salons);

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
                <a href="reservation.html" class="btn btn-primary">Réserver</a>
            </div>
        `;
        container.appendChild(card);
    });
}

document.getElementById('btn-chercher').addEventListener('click', () => {
    const search = document.getElementById('search-input').value;
    fetchData(search);
});

fetchData();