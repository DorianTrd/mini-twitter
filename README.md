# Mini-twitter

## Etape d'installation du projet

### **1️⃣ Backend Setup**
1. Se positionner au niveau du back:
   ```sh
   cd back-tiwtter
   npm install
   ```
2. **Variable d'Environment**:
  Créer un .env coté back et mettre dedans : NOTIFICATION_PUBLIC_KEY=BJnkICy5p4uSAONoZTznxYTHlNZ9RVF9vrJp6SS_MTIbczNmMq4rt_SrRq2WoBBWwWunfNZjgSNHsAwBdvb3fDo
NOTIFICATION_PRIVATE_KEY=lWnGFHzHVyh5rwD_5sBqAWR-SZKGvoQ9k64thG7Hvsg

Si les clés ne fonctionnent pas / plus
regénérer des clés avec :
   ```sh
   web-push generate-vapid-keys
   ```
Mettre les nouvelles clés dans le .env + dans le front dans le fichier twitter-project\front-twitter\src\components\NotificationManager.tsx et changer la variable 'VAPID_PUBLIC_KEY'

4. **BDD**:
   - Ouvrir un outil pour la BDD .
   - Créer une nouvelle BDD `twitter_db` ou alors en changeant les valeurs du fichier : twitter-project\back-twitter\config\db.js.
     

5. **Lancer le back**:
   ```sh
   node .\server.js
   ```
---

### **2️⃣ Lancer le front**
1. Navigate to the frontend folder:
   ```sh
   cd ../front-twtter
   npm install
   ```
```
npm run build
npm run preview
```

2. Ouvrir l'url: http://localhost:4173/
---
- Créer un compte
- Se connecter sur le compte
- Créer des posts

  Pour les notifications: Avoir créé 2 comptes
  - activer les notifications avec le bouton S'abonner au Notifications dans la page principale
  puis s'abonner à chaque utilisateur souhaité en cliquant sur le profil ( cliquer sur le nom) et en cliquant sur 
  s'abonner

  Une fois effectué, les notifications sont activées et seront reçues quand la personne abonnée aura créé un nouveau post ( les notifications marchent bizzarement et fonctionnent sur mes navigateurs seulement si on écrit un post avec firefox ou chrome et on reçoit la notification de la personne qui s'est abonnée sur Edge uniquement. A voir de ton coté si cela marche mieux)


S'il y'a un quelquonque problème, merci de me contacter je repondrai au plus vite
---

### Fonctionnalitées obligatoires : 
- Création de compte
    - Connexion ✔
    - Liste des posts ✔ 
    - Ajout d'un post ✔
    - Liste des posts d'une personne précise ✔
    - Utilisation du précache pour fonctionnement hors ligne ✔
    - Utilisation d'un cache "network-first" pour avoir les derniers posts chargés, même hors-ligne ✔
    - Ajout d'un post en mode hors-ligne (offline-sync) ✔
    - Abonnements & Notifications "général" (je m'abonne, dès que quelqu'un ajoute un post, j'ai une notif) ✔
    - Ouverture du site lors du click sur une notif ✔
      
### Fonctionnalitées ensuite : 


    - Passer les notifs en mode "follow". (Je m'abonne à des profils en particulier, je reçois une notif si l'un d'eux ajoute un post) ✔
    - Affichage d'une info-bulle si on est hors-ligne ✔ (via un toastr)
    - Ajout de photo sur les posts ✔ 
    - Pouvoir prendre des photos directement via l'appli ✘
    - Ajout de géolocalisation sur les posts ✘
    - Pouvoir utiliser son micro pour écrire un post (speech-to-text) ✘
    - Faire le post par une IA (text-to-speech) ✘
    - Ajout de filtre type instagram sur l'appareil photo in-app. ✘
    
    - Tout autre idée est la bienvenue (et sera récompensée).  
    
    - Barre de navigation au menu pour chercher un utilisateur/ post spécifique
    
