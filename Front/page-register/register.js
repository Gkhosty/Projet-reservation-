const header = document.querySelector('header');
header.innerHTML = `<h1>CoiffureProMax</h1>`;

const section = document.querySelector('section');
section.className = 'formulaire-register';
section.innerHTML = `
<h2>Créer un compte</h2>
<form id="formulaire-register">
<label>Nom et Prénom</label>
<input type="text" name="nom" required>

<label>Email</label>
<input type="email" name="email" required>

<label>Mot de passe</label>
<input type="password" name="mot_de_passe" required>

<button type="submit">S'inscrire</button>
</form>
`;

// ─── Afficher un message popup ───
function afficherPopup(message, type = 'popup-succes') {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.className = `popup ${type}`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
}


const formulaire = document.getElementById('formulaire-register');
formulaire.addEventListener('submit', async function(event){
    event.preventDefault();

    const response = await fetch('https://projet-reservation-rho.vercel.app/register', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            nom: formulaire.nom.value,
            email: formulaire.email.value,
            mot_de_passe: formulaire.mot_de_passe.value
        })
    })

    if (response.ok){
        afficherPopup('✅ Compte créé avec succès !');
        setTimeout(() => {
            window.location.href = '../page-login/login.html';
        }, 1500);
    } else {
        const data = await response.json();
        afficherPopup('❌ ' + data.erreur, 'popup-erreur');
    }
})

const footer = document.querySelector('footer');
footer.innerHTML = `<p>© 2026 CoiffureProMax – Tous droits réservés</p>`;