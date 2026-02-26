const header = document.querySelector('header');
header.innerHTML = `<h1>CoiffeurProMax</h1>`;

const section = document.querySelector('section');
section.className = 'formulaire-login';
section.innerHTML = `
    <h2>Se connecter</h2>
    <form id="formulaire-login">
        <label>Email</label>
        <input type="email" name="email" required>

        <label>Mot de passe</label>
        <input type="password" name="mot_de_passe" required>

        <button type="submit">Se connecter</button>

        <a href="../page-register/register.html">Pas encore de compte ? S'inscrire</a>
    </form>
`;

// ─── Afficher un message popup ────────────────────────────────────
function afficherPopup(message, type = 'popup-succes') {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.className = `popup ${type}`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
}

// ─────────────────────────────────────────────────────────────────

const formulaire = document.getElementById('formulaire-login');
formulaire.addEventListener('submit', async function(event){
    event.preventDefault();

    const response = await fetch('http://localhost:4242/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: formulaire.email.value,
            mot_de_passe: formulaire.mot_de_passe.value
        })
    })

    const data = await response.json();

    if (response.ok) {
        // on sauvegarde le token dans le navigateur
        localStorage.setItem('token', data.token);

        // on lit les infos qui sont dans le token pour savoir le role
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        const role = payload.role;

        // si c'est un admin on l'envoie vers la page admin sinon vers l'accueil
        if (role === 'admin') {
            window.location.href = '../page-admin/admin.html';
        } else {
            window.location.href = '../page-accueil/index.html';
        }
    } else {
        // si le mot de passe ou l'email est incorrect on affiche une erreur
        afficherPopup('❌ ' + data.erreur, 'popup-erreur');
    }
})

const footer = document.querySelector('footer');
footer.innerHTML = `<p>© 2026 CoiffureProMax – Tous droits réservés</p>`;