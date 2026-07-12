# CinéMatch — Frontend (Membre 1)

Interface React (Vite + Tailwind v4) pour CinéMatch. Ce frontend ne parle **qu'au
backend principal** (`backend-main`), jamais directement aux microservices —
c'est backend-main qui joue le rôle de gateway.

## Démarrage local

```bash
cd frontend
npm install
cp .env.example .env   # puis ajuster VITE_API_URL si besoin
npm run dev             # http://localhost:5173
```

## Build de production

```bash
npm run build
npm run preview
```

## Avec Docker

```bash
docker build -t cinematch-frontend --build-arg VITE_API_URL=http://localhost:4000 .
docker run -p 5173:80 cinematch-frontend
```

En pratique, ce service sera lancé via le `docker-compose.yml` à la racine du repo,
aux côtés de `backend-main`, `service-reviews`, `service-recommendations`, `mongo`
et `postgres`.

## Structure

```
src/
├── api/
│   ├── client.js      # instance axios, attache le JWT, gère les 401/403
│   └── movies.js      # fonctions d'appel API (contrat détaillé ci-dessous)
├── context/
│   └── AuthContext.jsx # état d'auth global (token, user, login, logout)
├── components/
│   ├── Navbar.jsx
│   ├── PrivateRoute.jsx  # protège les routes, redirige vers /login
│   ├── MovieCard.jsx
│   └── ErrorBanner.jsx
└── pages/
    ├── Dashboard.jsx       # liste des films (publique)
    ├── MovieDetail.jsx     # détail + avis + formulaire d'avis (si connecté)
    ├── Login.jsx            # bouton "Se connecter avec Google"
    ├── AuthCallback.jsx     # récupère le JWT après redirection Google
    └── Profile.jsx           # route protégée
```

## Contrat API attendu de `backend-main` (Membre 2)

Le frontend a été développé contre ce contrat. Merci de garder cette forme (ou
de me prévenir si ça change) :

| Méthode | Route | Auth requise | Description |
|---|---|---|---|
| GET | `/auth/google?redirect=<path>` | non | Démarre le flow OAuth Google (Passport.js) |
| GET | `/auth/google/callback` | non | Callback Google → doit rediriger vers `FRONTEND_URL/auth/callback?token=<jwt>&redirect=<path>` |
| GET | `/api/movies` | non | Liste des films `[{ id, title, posterUrl, averageRating }]` |
| GET | `/api/movies/:id` | non | Détail d'un film `{ id, title, synopsis, posterUrl }` |
| GET | `/api/movies/:id/reviews` | non | Avis du film (proxy vers `service-reviews`) `[{ id, rating, comment }]` |
| POST | `/api/movies/:id/reviews` | **oui (JWT)** | Body `{ rating, comment }`, retourne l'avis créé |
| GET | `/api/me` | **oui (JWT)** | Profil de l'utilisateur connecté `{ name, email }` |

Format attendu pour les réponses d'erreur (utilisé par `ErrorBanner.jsx`) :

```json
{ "message": "Description lisible de l'erreur" }
```

Le token JWT est envoyé dans le header `Authorization: Bearer <token>` sur
chaque requête protégée (géré automatiquement par `src/api/client.js`).

## Variables d'environnement

Voir `.env.example`. `VITE_API_URL` doit pointer vers `backend-main`
(`http://localhost:4000` en local). Comme le navigateur de l'utilisateur doit
pouvoir joindre l'API directement, utilisez une URL publique/accessible, pas
un nom de service Docker interne.

## Déploiement en ligne (Vercel)

Le frontend se déploie sur [Vercel](https://vercel.com), connecté directement au repo GitHub.

1. Sur Vercel : **New Project** → importer le repo `ApiProject`.
2. **Root Directory** : `frontend` (important, sinon Vercel essaie de builder à la racine).
3. Build settings (auto-détectés normalement pour Vite, à vérifier) :
   - Build Command : `npm run build`
   - Output Directory : `dist`
4. Variables d'environnement à ajouter dans Vercel (Project Settings → Environment Variables) :
   - `VITE_API_URL` → l'URL publique de `backend-main` une fois déployé sur Render
5. `vercel.json` est déjà présent à la racine de `frontend/` pour que les routes React Router (`/movies/:id`, `/auth/callback`, `/profile`) fonctionnent correctement en rechargement direct (rewrite vers `index.html`).

**Déploiements automatiques :**
- Push sur `main` → déploiement de production
- Push sur `dev` (ou une Pull Request) → déploiement de preview automatique par Vercel, ça fait office d'environnement de test partagé avant de merger dans `main`

**Important côté Google OAuth :** une fois l'URL de prod connue (ex. `https://cinematch.vercel.app`), il faut l'ajouter comme *Authorized redirect URI* dans Google Cloud Console, en plus de l'URL locale (`http://localhost:5173`). C'est le membre 2 (backend-main) qui gère cette config Google, mais il aura besoin de l'URL Vercel finale — à lui transmettre dès que le déploiement est fait.
