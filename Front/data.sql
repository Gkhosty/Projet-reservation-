
CREATE TABLE salons (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    adresse VARCHAR(255)
);


CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    salon VARCHAR(100),
    nom VARCHAR(100),
    email VARCHAR(100),
    telephone VARCHAR(20),
    date_reservation DATE,
    heure VARCHAR(10),
    service VARCHAR(50),
    commentaire TEXT
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  mot_de_passe TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);


INSERT INTO salons (nom, adresse) VALUES
('Le Chic Atelier', '12 Rue de la Beauté • 75001'),
('Inès Coiffeusse', '1 Rue de la Charonnes • 75005'),
('Patrise Salon', '3 Rue de la Général • 75002'),
('Hugo Studio', '177 Rue de la Bourdain • 75006'),
('Chic & Co', '9 Rue des Petits Champs • 75002');


INSERT INTO reservations (salon, nom, email, telephone, date_reservation, heure, service, commentaire) 
VALUES ('Le Chic Atelier', 'Test User', 'test@test.com', '0123456789', '2026-03-15', '10:00', 'Coupe', 'Test de réservation');