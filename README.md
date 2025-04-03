# ✨ NutriTrack 🏋🏿‍♂️

Bienvenue dans **NutriTrack**, pour une alimentation saine et équilibrée.  
Suivez vos repas, définissez vos objectifs  et visualisez votre progression à travers des graphiques dynamiques et des export en excel !

Merci d'utiliser NutriTrack ! 🌱🏋🏿‍♂️

---

## 📦 Fonctionnalités principales

- ✅ Ajouter des repas manuellement ou depuis une liste de repas healthy
- 📊 Suivi des apports nutritionnels journaliers
- 🎯 Définir ses objectifs quotidiens en calories, protéines, glucides, lipides
- 📈 Statistiques visuelles (barres + camembert)
- 📤 Export des repas consommés en Excel

---

## 🛠️ Stack technique

- **Frontend** : HTML, Tailwind CSS, Vanilla JavaScript
- **Backend** : Node.js + Express
- **Base de données** : MongoDB
- **Libs utilisées** :
  - [Chart.js](https://www.chartjs.org/) (graphiques)
  - [SheetJS (xlsx)](https://sheetjs.com/) (export Excel)
  - [Material Tailwind Charts](https://www.material-tailwind.com/docs/html/plugins/charts) (Tailwind CSS)

---

## ⚙️ Configuration

Assurez-vous d’avoir installé :

- Node.js (v16 ou supérieur)
- MongoDB local (`mongodb://localhost:27017/nutritrack`)
- Un navigateur moderne (Chrome, Edge, Firefox...)

---

## 🚀 Exécution

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/djibril1212/NutriTrack
   cd nutritrack
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer le serveur :**
   ```bash
   node server.js
   ```
   L'application sera accessible sur : [http://localhost:3000](http://localhost:3000)

4. **Accéder à l'application :**
   Ouvre `http://localhost:3000` dans ton navigateur préféré.

---

## 🌐 Endpoints de l'API

| Méthode | Route                      | Description                              |
|---------|----------------------------|------------------------------------------|
| GET     | `/meals`                   | Récupère tous les repas                  |
| POST    | `/meals`                   | Ajoute un repas                          |
| GET     | `/meals/today`             | Liste les repas consommés aujourd’hui    |
| GET     | `/meals/today/compare`     | Renvoie les apports + objectifs du jour |
| GET     | `/goals`                   | Récupère les objectifs nutritionnels     |
| PUT     | `/goals`                   | Met à jour les objectifs                 |

---

## 📁 Arborescence principale

```
NutriTrack/
├── public/
│   ├── index.html
│   ├── app.js
├── models/
│   ├── mealModel.js
│   ├── goalModel.js
├── data/
│   └── connection.js
├── server.js
├── README.md
```

---

## 💡 Idées futures

- 🔔 Notifications et rappels
- 📱 Version mobile responsive
- 📆 Planificateur de repas hebdomadaire
- 🔐 Authentification multi-profils (localStorage)

---

## 👤 Auteur

Développé  par **Djibril Abaltou**

---

## ✨ Merci !

Merci d'utiliser NutriTrack !  
Que la force soit avec tes macros 💪🏿🌿