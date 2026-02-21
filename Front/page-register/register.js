const header = document.querySelector('header');
header.innerHTML = `<h1>CoiffureProMax</h1>`;

const section = document.querySelector('section');
section.className = 'formulaire-register';
section.innerHTML = `
<h2>Créer un compte</h2>
<form id="formulaire-register">
<label>Nom et Prénom</lable>
<input type="text" name="nom" required>

<label>Email</label>
<input type="Email" name="email" required>

<label>Mot de passe</label>
<input type="password" name="mot_de_passe" required>


<button type="submit">S'inscrire</button>
</form>
`;


const formulaire = document.getElementById('formulaire-register');
//une fois que qqun clique sur s'inscrire
formulaire.addEventListener('submit', async function(event){
    event.preventDefault() //on empeche la page de se reharger
    //on envoie les donnes au serveur
    const response = await fetch('http://localhost:4242/register', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            nom: formulaire.nom.value,
            email: formulaire.email.value,
            mot_de_passe: formulaire.mot_de_passe.value
        })
    })
    // si ça marche on regirgie vers login 
    if (response.ok){
        alert('Compte créé avec succés !')
        window.location.href = '../page-login/login.html'
    }
})

const footer = document.querySelector('footer');
footer.innerHTML = `<p>© 2026 CoiffureProMax – Tous droits réservés</p>`;
