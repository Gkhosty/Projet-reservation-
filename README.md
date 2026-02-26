# 💇 CoiffureProMax

Application web de réservation de salons de coiffure avec authentification JWT.

---

## 📁 Structure du projet

```
Projet-reservation/
├── Back/
│   ├── index.js              # Serveur Express + import des routes
│   ├── routes/
│   │   ├── users.js          # Routes register et login
│   │   ├── salons.js         # Routes salons + middleware admin
│   │   └── reservations.js   # Routes réservations
│   ├── .env                  # Variables d'environnement (DATABASE_URL, JWT_SECRET)
│   └── package.json
├── Front/
│   ├── style.css             # Styles globaux
│   ├── page-accueil/
│   │   ├── index.html
│   │   └── script.js
│   ├── page-reservation/
│   │   ├── reservation.html
│   │   └── reservation.js
│   ├── page-recap/
│   │   ├── Recap.html
│   │   └── Recap.js
│   ├── page-login/
│   │   ├── login.html
│   │   └── login.js
│   ├── page-register/
│   │   ├── register.html
│   │   └── register.js
│   └── page-admin/
│       ├── admin.html
│       └── admin.js
```

---

## 🛠️ Technologies utilisées

- **Backend** : Node.js, Express
- **Base de données** : PostgreSQL (Neon)
- **Authentification** : JWT (jsonwebtoken)
- **Frontend** : HTML, CSS, JavaScript Vanilla
- **Icônes** : Font Awesome 6

---

## 🗄️ Base de données (Neon)

### Table `salons`
```sql
CREATE TABLE salons (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    adresse VARCHAR(255),
    "Contact" VARCHAR(100)
);
```

### Table `reservations`
```sql
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    salon VARCHAR(100),
    nom VARCHAR(100),
    email VARCHAR(100),
    telephone VARCHAR(20),
    date_reservation DATE,
    heure VARCHAR(10),
    service VARCHAR(50),
    commentaire TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
```

### Table `users`
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'client',
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone <url-du-projet>
cd Projet-reservation
```

### 2. Installer les dépendances
```bash
cd Back
npm install
```

### 3. Configurer le fichier `.env`
```
DATABASE_URL=postgresql://...votre_url_neon...
JWT_SECRET=votre_secret_jwt
```

### 4. Lancer le serveur
```bash
nodemon index.js
```

Le serveur tourne sur **http://localhost:4242**

---

## 📡 Routes API

### Authentification
| Méthode | Route | Description |
|--------|-------|-------------|
| POST | `/register` | Créer un compte |
| POST | `/login` | Se connecter (reçoit un token JWT) |

### Salons
| Méthode | Route | Description |
|--------|-------|-------------|
| GET | `/salons` | Récupérer tous les salons |
| POST | `/salons` | Ajouter un salon 🔒 admin |
| PUT | `/salons/:id` | Modifier un salon 🔒 admin |
| DELETE | `/salons/:id` | Supprimer un salon 🔒 admin |

### Réservations
| Méthode | Route | Description |
|--------|-------|-------------|
| GET | `/reservations` | Récupérer les réservations 🔒 connecté |
| POST | `/reservations` | Créer une réservation 🔒 connecté |
| PUT | `/reservations/:id` | Modifier une réservation |
| DELETE | `/reservations/:id` | Supprimer une réservation |

> 🔒 Les routes protégées nécessitent un token JWT dans le header `authorization` : `Bearer <token>`

---

## 🔐 Authentification JWT

1. L'utilisateur s'inscrit via `/register`
2. Il se connecte via `/login` et reçoit un **token JWT**
3. Le token est sauvegardé dans le `localStorage` du navigateur
4. Pour accéder aux routes protégées, le token est envoyé dans le header `authorization`
5. Le token expire après **24h**

---

## 👥 Rôles utilisateurs

### Client
- Voir les salons
- Faire une réservation (max 2 RDV par jour par salon)
- Voir et modifier ses propres RDV
- Supprimer ses propres RDV

### Admin
- Toutes les fonctionnalités du client
- Ajouter / modifier / supprimer des salons
- Voir toutes les réservations de tous les utilisateurs
- Supprimer n'importe quelle réservation

Pour passer un utilisateur en admin :
```sql
UPDATE users SET role = 'admin' WHERE email = 'email@exemple.com';
```

---

## 📄 Pages Frontend

| Page | Description |
|------|-------------|
| `page-accueil` | Liste des salons avec recherche |
| `page-reservation` | Formulaire de réservation |
| `page-recap` | Récapitulatif des RDV de l'utilisateur connecté |
| `page-login` | Connexion |
| `page-register` | Inscription |
| `page-admin` | Gestion des salons et réservations (admin uniquement) |

---

## ✅ Fonctionnalités

- Affichage et recherche des salons
- Réservation avec validation de date et heure
- Maximum 2 RDV par jour par salon par utilisateur
- Récapitulatif et modification des RDV
- Inscription et connexion avec JWT
- Redirection selon le rôle (admin → page admin, client → page accueil)
- Bouton "Mes Rendez-vous" dans le header
- Bouton Se connecter / Se déconnecter dans le header
- Notifications popup pour toutes les actions
- Page admin protégée (accès réservé aux admins)
- Foreign key entre reservations et users
- Routes organisées en fichiers séparés (users, salons, reservations)

---

## 🔜 Améliorations prévues

- Hashage des mots de passe avec **bcrypt**
- Page profil utilisateur

---

*© 2026 CoiffureProMax — Tous droits réservés*