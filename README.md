# Dir-Khir 🤝

**L'entraide de quartier du Maroc**

Une plateforme communautaire marocaine pour coordonner l'aide de proximité dans les quartiers. De Tanger à Laayoune, connectez-vous avec vos voisins et aidez ensemble.

## 🎯 Objectif

Dir-Khir permet aux résidents marocains de publier des besoins (aide financière, nettoyage, éducation, santé, nourriture) et aux volontaires de l'échelle du quartier/douar de les aider rapidement.

## 🏗️ Architecture Technique

### Stack
- **Framework**: Next.js 16.0.1 avec Turbopack
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Drizzle ORM avec TypeScript
- **Auth**: Better Auth 1.3.32 (email/password + username)
- **UI**: Shadcn/UI + Tailwind CSS v4
- **Validation**: Zod schemas
- **Icons**: Lucide React
- **Notifications**: Sonner toast

### Design System
**Palette Marocaine**:
- 🟢 Primaire: Émeraude verte (oklch(0.35 0.12 160))
- 🟠 Secondaire: Terre de sienne (oklch(0.52 0.13 55))
- 🔴 Accent: Coral chaud (oklch(0.62 0.16 35))

Pattern: Zellige géométrique (subtil, 2-3% opacité)

## 📁 Structure des Fichiers

```
src/
├── app/
│   ├── page.tsx                     # Homepage - Feed des besoins
│   ├── needs/[id]/page.tsx          # Page détail d'un besoin
│   ├── proposer-un-besoin/page.tsx  # Créer un besoin
│   ├── mon-espace/page.tsx          # Dashboard utilisateur
│   ├── login/page.tsx               # Connexion
│   ├── register/page.tsx            # Inscription
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Styles globaux + animations
├── components/
│   ├── ui/                          # Shadcn/UI components
│   ├── needs/
│   │   ├── need-card.tsx            # Composant fiche besoin
│   │   ├── create-need-form.tsx     # Formulaire création
│   │   └── need-detail-actions.tsx  # Actions page détail
│   ├── dashboard/
│   │   └── dashboard-actions.tsx    # Actions dashboard
│   ├── empty-states/                # États vides (Illustration + CTA)
│   ├── skeletons/                   # Loading skeleton components
│   └── page-header.tsx              # Header réutilisable
├── db/
│   ├── index.ts                     # Drizzle instance
│   └── schema/
│       └── needs.ts                 # Needs + Volunteers schema
├── lib/
│   ├── actions/
│   │   └── needs.ts                 # Server Actions (mutations DB)
│   ├── auth/
│   │   ├── server.ts                # Better Auth instance
│   │   ├── client.ts                # Client auth hooks
│   │   └── get-session.ts           # Server session retrieval
│   └── utils.ts                     # Helper functions
└── providers/
    └── index.tsx                    # React providers wrapper
```

## 🚀 Features

### ✅ Implémentées
- **Authentification**: Sign up/login avec email, username, password
- **Profil utilisateur**: Nom, email, gender, rôle
- **Création de besoin**: Titre, description, catégorie, ville, numéro WhatsApp
- **Feed public**: Liste des besoins actifs, filtres par ville/catégorie
- **Page détail**: Info complète du besoin, liste des volontaires
- **Système de volontariat**: S'engager/retirer son engagement
- **Dashboard**: Mes besoins, mes engagements, état complété
- **Notifications**: Toast success/error avec Sonner
- **Design responsif**: Mobile-first avec Tailwind CSS
- **Navigation mobile**: Bottom nav bar (4 sections)
- **Styles Marocains**: Couleurs culturelles + pattern Zellige
- **Animations**: Fade-in, slide, scale-in smooth transitions
- **États vides**: Illustrations + CTA pour actions vides
- **Validation**: Zod schemas côté client + serveur
- **Cache**: React cache() pour session optimization

### 🔄 Server Actions (Sécurisées)
- `createNeed()`: Créer un besoin (authentification requise)
- `volunteerForNeed()`: S'engager pour aider
- `unvolunteerForNeed()`: Retirer son engagement
- `resolveNeed()`: Marquer comme résolu (owner only)
- `deleteNeed()`: Supprimer un besoin (owner + cascade)

## 🛠️ Installation

### Prérequis
- Node.js 18+
- npm ou bun
- Compte Neon PostgreSQL
- Domaine ou localhost pour NEXT_PUBLIC_APP_URL

### Setup

1. **Cloner & installer**
```bash
cd dir-lkhir
npm install
```

2. **Configurer environment**
```bash
cp .env.example .env
```

Variables requises:
```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://[user]:[password]@[host]/[db]
DIRECT_URL=postgresql://[user]:[password]@[host]/[db]

# Better Auth
BETTER_AUTH_SECRET=<64-char-hex-random>

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Migrations BD**
```bash
npm run db:migrate
```

4. **Dev server**
```bash
npm run dev
```

Accédez à `http://localhost:3000`

## 📱 Pages Principales

| URL | Description | Auth |
|-----|-------------|------|
| `/` | Feed besoins, filtres | Public |
| `/needs/[id]` | Détail besoin + volontaires | Public |
| `/proposer-un-besoin` | Formulaire création | ✅ Required |
| `/mon-espace` | Dashboard (mes besoins + engagements) | ✅ Required |
| `/login` | Connexion | Public |
| `/register` | Inscription + gender selection | Public |

## 🎨 Système de Design

### Couleurs (OKLch format)
```css
Primary:    oklch(0.35 0.12 160)  /* Emerald Green */
Secondary:  oklch(0.52 0.13 55)   /* Sienna Earth */
Accent:     oklch(0.62 0.16 35)   /* Warm Coral */
```

### Animations Disponibles
- `.animate-fade-in`: Apparition douce
- `.animate-slide-in-top`: Glissement du haut
- `.animate-slide-in-bottom`: Glissement du bas
- `.animate-scale-in`: Zoom in

## 🗄️ Base de Données

### Tables

**needs** (Besoins)
- `id` (Primary Key)
- `userId` (Foreign Key → user)
- `title` (varchar)
- `description` (text)
- `category` (enum: education, cleaning, financial, health, food, other)
- `city` (varchar - 10 cities marocaines)
- `phoneWhatsApp` (varchar)
- `volunteerCount` (int)
- `isResolved` (boolean)
- `createdAt`, `updatedAt`

**needVolunteers** (Jonction)
- `id` (Primary Key)
- `needId` (Foreign Key → need, CASCADE)
- `userId` (Foreign Key → user)
- `createdAt`

## 🔒 Sécurité

- **Server Actions**: Mutations sécurisées côté serveur
- **Session Auth**: React cache() + getServerSession
- **Validation**: Zod schemas pour toutes les inputs
- **Row-level Security**: Auth checks avant mutations
- **HTTPS**: Recommandé pour production
- **Rate Limiting**: À implémenter (future)

## 📊 Statistiques

Affichées sur homepage:
- Besoins actifs (count)
- Volontaires totaux (sum volunteerCount)
- Besoins résolus (count isResolved)

## 🚧 Future Features

- [ ] Recherche full-text
- [ ] Filtres avancés (date range, volunteer count)
- [ ] Système de rating/review
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Messaging système
- [ ] Géolocalisation

## 📝 License

MIT

---

**Construit avec ❤️ pour l'entraide marocaine**

```
bun db:push
```

### 5\. Start the Development Server

Run the development server:

```
bun dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000).

## Contributing

Contributions are welcome! Feel free to:

- Open issues for bugs or feature requests.
- Submit pull requests to improve the project.

### License

This project is licensed under the MIT License.
