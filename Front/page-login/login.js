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

// envoyer les donner au server

const formulaire = document.getElementById('formulaire-login');
formulaire.addEventListener('submit', async function(event){
    event.preventDefault(); //on empêche la page de se recharger

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
        localStorage.setItem('token', data.token); // on sougard le token dans le navigateur
        alert('Connection réussi !');
        window.location.href = '../page-accueil/index.html';// on te orient vers la page d'acceul
    } else {
        alert(data.erreur)
    }
})



const footer = document.querySelector('footer');
footer.innerHTML = `<p>© 2026 CoiffureProMax – Tous droits réservés</p>`;