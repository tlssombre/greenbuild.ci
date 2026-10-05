# Administration GreenBuild

## Accès et activation

Le tableau de bord est à `/admin`. Il gère Investir, Actualités, Équipe, Contact, les postes à pourvoir, les messages et les candidatures. Il n’existe aucun mot de passe par défaut.

1. Utiliser Node.js 22.13 minimum (Node 24 recommandé pour correspondre au runtime de développement).
2. Exécuter `npm ci`, puis `npm run admin:setup` dans un terminal privé. Le script demande un mot de passe et écrit uniquement son empreinte scrypt et un secret de session dans `.env.local`, ignoré par Git.
3. Pour un hébergement, reporter `ADMIN_PASSWORD_HASH` et `ADMIN_SESSION_SECRET` dans ses variables secrètes. Ne pas les mettre dans le dépôt ou une variable `NEXT_PUBLIC_*`.
4. Définir `SITE_URL` sur l’origine HTTPS exacte du site, sans chemin.
5. Monter un disque persistant et définir `GREENBUILD_DATA_DIR` sur son chemin absolu, par exemple `/var/data/greenbuild`.
6. Lancer `npm run build`, puis `npm start` et ouvrir `/admin`.

Sans ces paramètres, l’admin indique que l’accès reste à configurer. Une connexion n’est possible qu’après configuration. Le cookie de session est HTTP-only, SameSite Strict et Secure en production ; l’accès distant doit utiliser HTTPS. Changer le secret invalide les sessions existantes.

## Stockage et hébergement

Le serveur utilise SQLite (`greenbuild.sqlite`, WAL) et le sous-dossier privé `resumes/` du disque configuré. Utiliser **une instance Node** avec volume persistant. Sauvegarder ensemble base de données et CV, via un snapshot cohérent ou après arrêt du serveur.

Un déploiement purement statique ou une fonction serverless à disque éphémère ne convient pas à ce stockage. Pour ce type d’hébergement, migrer vers une base externe et un stockage objet privé avant activation. Les fichiers de CV ne sont jamais exposés dans `public/`.

## Contenus et candidatures

- Actualités, équipe et offres : créer, modifier, publier/dépublier, trier et supprimer. Les contenus de démonstration ne sont pas publiés automatiquement.
- Investir et Contact : modifier le texte et les informations publiques.
- Images des contenus éditoriaux : URL HTTPS d’une image hébergée, ou chemin d’une image du site.
- Messages : réception réelle dans l’admin, avec statut et suppression.
- Candidatures : nom, e-mail, téléphone, motivation, accord et CV PDF de 5 Mo maximum. Le CV est téléchargeable uniquement après authentification.
- Une offre dépubliée refuse les nouvelles candidatures. Les candidatures existantes conservent le titre du poste.
- Aucune notification e-mail automatique n’est envoyée. Consulter l’admin pour les nouvelles demandes.

## Contrôles

`npm run build` valide TypeScript et le build de production. Après le build, `npm run test:api` lance le serveur sur un port local avec des secrets temporaires et une base isolée, vérifie les parcours, puis supprime ces données de test.

Les contrôles couvrent l’authentification, l’origine des requêtes, la publication et les brouillons, les formulaires, la validation PDF, le téléchargement privé, les statuts, la persistance après redémarrage et la suppression. La QA visuelle des modales et du défilement doit être faite dans un navigateur.
