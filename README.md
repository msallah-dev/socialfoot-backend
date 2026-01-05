🚀 NestJS API – PostgreSQL & TypeORM
🧱 Stack technique

# Backend
NestJS (Node.js, TypeScript)

# Base de données
PostgreSQL

# ORM 
TypeORM

# Authentification
JWT

# Validation 
class-validator / class-transformer

_____________________________

📦 Prérequis

Avant de commencer, assurez-vous d’avoir :

Node.js (v18 ou supérieur recommandé)

npm ou yarn

PostgreSQL installé et en cours d’exécution
_____________________________

⚙️ Installation
npm install

_____________________________

🔐 Configuration de l’environnement

Créer un fichier .env à la racine du projet :
# Application
PORT=3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=`votre port localhost`
DB_USER=`votre identifiant`
DB_PASSWORD=`votre mot de passe`
DB_NAME=`le nom de la DB`

# JWT
JWT_SECRET=`votre clé secrète aléatoire`

# Client
CLIENT_URL=`votre URL client`

_____________________________

🚀 Démarrage du projet
npm run start:dev

L’API sera accessible à l’adresse
http://localhost:PORT

_____________________________

🔁 Migrations TypeORM
* Créer une migration
npm run migration:generate -- src/migrations/CreateUserTable

* Exécuter les migrations
npm run migration:run

_____________________________

🔒 Sécurité

* Hash des mots de passe avec bcrypt
* Authentification JWT
* Validation des entrées utilisateurs
* Variables sensibles via .env

_____________________________

🚀 Bonnes pratiques

* Architecture modulaire NestJS
* Utilisation des DTOs et entities séparés
* Relations TypeORM bien définies
* Migrations versionnées
* Séparation logique des couches (controller / service / repository)

_____________________________

👨‍💻 Auteur

SALLAH Mohamed
📧 Email : sallah.mohamed@outlook.fr

💼 LinkedIn : https://www.linkedin.com/in/mohamed-sallah-642151128/