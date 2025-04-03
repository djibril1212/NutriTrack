document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    loadDashboard(); // page par défaut
  });
  
  // SPA
  function setupNavigation() {
    document.querySelectorAll('aside nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('aside nav a').forEach(l => {
          l.classList.remove('text-violet-700', 'bg-violet-100');
          l.classList.add('text-gray-700');
        });
        link.classList.add('text-violet-700', 'bg-violet-100');
        link.classList.remove('text-gray-700');
        const text = link.textContent.trim();
        if (text === 'Dashboard') loadDashboard();
        if (text === 'Repas') loadRepas();
        if (text === 'Objectifs') loadObjectifs();
        if (text === 'Statistiques') loadStats();
      });
    });
  }
  
  // Page Dashboard
  function loadDashboard() {
    const content = document.getElementById('main-content');
    content.innerHTML = `
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-green-600">Conseils du jour</h2>
        <ul class="list-disc list-inside text-gray-700 space-y-1">
          <li>Bois suffisamment d’eau 🧃</li>
          <li>Ajoute une source de protéines à ton prochain repas 🍗</li>
          <li>Essaie de manger des légumes verts aujourd’hui 🥦</li>
        </ul>
      </div>
      <div class="bg-white shadow rounded-lg p-6 mt-6">
        <h2 class="text-xl font-semibold mb-4 text-green-600">Suivi nutritionnel</h2>
        <div id="dashboard-bars" class="space-y-4"></div>
      </div>
      
    `;
    fetch('/meals/today/compare')
      .then(res => res.json())
      .then(data => {
        displayDashboard(data.totals, data.goals);
      });
  }
  
  function displayDashboard(totals, goals) {
    const container = document.getElementById('dashboard-bars');
    container.innerHTML = ['calories', 'proteins', 'carbs', 'fats'].map(nutrient => {
      const value = totals[nutrient];
      const goal = goals[nutrient];
      const percent = Math.min(100, ((value / goal) * 100).toFixed(1));
      const label = nutrient.charAt(0).toUpperCase() + nutrient.slice(1);
  
      return `
        <div>
          <p class="font-medium text-gray-800 mb-1">${label} : ${value} / ${goal} (${percent}%)</p>
          <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div class="bg-green-500 h-full text-center text-white text-sm font-semibold transition-all duration-500 ease-in-out"
                 style="width: ${percent}%">
              ${percent}%
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  //Page Repas
  function loadRepas() {
    const content = document.getElementById('main-content');
  
    //repas pré-remplis
    const mealCards = getPredefinedMeals().map((meal, index) => `
      <div class="bg-white shadow rounded-lg p-4">
        <h3 class="text-lg font-bold text-green-600 mb-2">${meal.name}</h3>
        <p class="text-sm text-gray-700">Calories : ${meal.calories} kcal</p>
        <p class="text-sm text-gray-700">Protéines : ${meal.proteins} g</p>
        <p class="text-sm text-gray-700">Glucides : ${meal.carbs} g</p>
        <p class="text-sm text-gray-700 mb-3">Lipides : ${meal.fats} g</p>
        <button onclick="addMeal(${index})" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Ajouter ce repas
        </button>
      </div>
    `).join('');
  
    content.innerHTML = `
      <h2 class="text-2xl font-semibold mb-4 flex items-center justify-between">
  Repas healthy pré-remplis 🥗
  <button onclick="openMealModal()" class="bg-green-500 text-white text-sm px-4 py-2 rounded hover:bg-green-500">
    + Ajouter un repas manuellement
  </button>
</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
      
        ${mealCards}
      </div>
  
      <h2 class="text-2xl font-semibold mb-4 text-green-600">Repas déjà consommés aujourd’hui 🍽️</h2>
      <div id="consumed-meals" class="space-y-4">
        <p class="text-gray-500 italic">Chargement des repas...</p>
      </div>
    `;
  
    // 🔁 Appel des repas déjà manger
    fetch('/meals/today')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('consumed-meals');
        if (data.meals.length === 0) {
          container.innerHTML = `<p class="text-gray-600">Aucun repas consommé aujourd’hui pour l’instant.</p>`;
        } else {
          container.innerHTML = data.meals.map(meal => `
            <div class="bg-white shadow rounded-lg p-4">
              <h3 class="text-lg font-semibold text-green-700 mb-2">${meal.name}</h3>
              <p class="text-sm text-gray-700">Calories : ${meal.calories} kcal</p>
              <p class="text-sm text-gray-700">Protéines : ${meal.proteins} g</p>
              <p class="text-sm text-gray-700">Glucides : ${meal.carbs} g</p>
              <p class="text-sm text-gray-700">Lipides : ${meal.fats} g</p>
            </div>
          `).join('');
        }
      });
  }
  function addMeal(index) {
    const meal = getPredefinedMeals()[index];
  
    fetch('/meals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meal)
    })
    .then(res => {
      if (res.ok) {
        alert(`✅ "${meal.name}" ajouté avec succès !`);
        loadDashboard();
      } else {
        alert("❌ Une erreur");
      }
    });
  }
  
  function getPredefinedMeals() {
    return [
      { name: "Poulet grillé & quinoa", calories: 480, proteins: 45, carbs: 30, fats: 15 },
      { name: "Saumon & légumes vapeur", calories: 520, proteins: 40, carbs: 20, fats: 25 },
      { name: "Wrap avocat & œufs", calories: 430, proteins: 20, carbs: 35, fats: 20 },
      { name: "Bowl riz complet & tofu", calories: 470, proteins: 25, carbs: 50, fats: 18 },
    ];
  }
  function loadObjectifs() {
    const content = document.getElementById('main-content');
    content.innerHTML = `
      <h2 class="text-2xl font-semibold mb-4 text-green-600">Page Objectifs à venir 🚧</h2>
    `;
  }
  
  // 📈 Statistiques 
  function loadStats() {
    const content = document.getElementById('main-content');
    content.innerHTML = `
      <h2 class="text-2xl font-semibold mb-4 text-green-600">Statistiques à venir 📊</h2>
    `;
  }
  function openMealModal() {
    document.getElementById('meal-modal').classList.remove('hidden');
    document.getElementById('meal-modal').classList.add('flex');
  }
  
  function closeMealModal() {
    document.getElementById('meal-modal').classList.add('hidden');
    document.getElementById('meal-modal').classList.remove('flex');
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('manual-meal-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const data = {
          name: form.name.value,
          calories: +form.calories.value,
          proteins: +form.proteins.value,
          carbs: +form.carbs.value,
          fats: +form.fats.value
        };
  
        fetch('/meals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(() => {
          closeMealModal();
          loadRepas(); 
        });
      });
    }
  });


  function loadObjectifs() {
    const content = document.getElementById('main-content');
  
    content.innerHTML = `
      <h2 class="text-2xl font-semibold mb-6 text-green-600">Définir mes objectifs nutritionnels 🎯</h2>
  
      <form id="goal-form" class="bg-white shadow p-6 rounded-lg max-w-md space-y-4">
        <div>
          <label for="dailyCalories" class="block text-sm font-medium text-gray-700 mb-1">Calories / jour</label>
          <input name="dailyCalories" type="number" placeholder="Ex : 2000" required class="w-full p-2 border border-gray-300 rounded" />
        </div>
  
        <div>
          <label for="dailyProteins" class="block text-sm font-medium text-gray-700 mb-1">Protéines (g) / jour</label>
          <input name="dailyProteins" type="number" placeholder="Ex : 150" required class="w-full p-2 border border-gray-300 rounded" />
        </div>
  
        <div>
          <label for="dailyCarbs" class="block text-sm font-medium text-gray-700 mb-1">Glucides (g) / jour</label>
          <input name="dailyCarbs" type="number" placeholder="Ex : 250" required class="w-full p-2 border border-gray-300 rounded" />
        </div>
  
        <div>
          <label for="dailyFats" class="block text-sm font-medium text-gray-700 mb-1">Lipides (g) / jour</label>
          <input name="dailyFats" type="number" placeholder="Ex : 70" required class="w-full p-2 border border-gray-300 rounded" />
        </div>
  
        <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
          Enregistrer mes objectifs
        </button>
      </form>
  
      <p id="goal-message" class="mt-4 text-sm text-gray-600"></p>
    `;
  
    // Récupération des objectifs existants
    fetch('/goals')
      .then(res => res.json())
      .then(data => {
        const goal = data[0];
        if (goal) {
          const form = document.getElementById('goal-form');
          form.dailyCalories.value = goal.dailyCalories;
          form.dailyProteins.value = goal.dailyProteins;
          form.dailyCarbs.value = goal.dailyCarbs;
          form.dailyFats.value = goal.dailyFats;
        }
      });
  
    // Soumission du formulaire
    document.getElementById('goal-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
  
      const updatedGoals = {
        dailyCalories: +form.dailyCalories.value,
        dailyProteins: +form.dailyProteins.value,
        dailyCarbs: +form.dailyCarbs.value,
        dailyFats: +form.dailyFats.value
      };
  
      fetch('/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGoals)
      })
      .then(res => res.json())
      .then(() => {
        document.getElementById('goal-message').textContent = "✅ Objectifs mis à jour avec succès !";
      });
    });
  }


  function loadStats() {
    const content = document.getElementById('main-content');
  
    content.innerHTML = `
    <div class="flex justify-end mb-4">
  <button onclick="exportMealsToExcel()" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
    📤 Exporter en Excel
  </button>
</div>
      <h2 class="text-2xl font-semibold mb-6 text-green-600">Statistiques nutritionnelles 📊</h2>
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Graphique en barres -->
        <div class="bg-white p-6 rounded shadow">
          <h3 class="text-lg font-semibold mb-4 text-gray-800">Apports par nutriment (aujourd’hui)</h3>
          <canvas id="bar-chart" height="220"></canvas>
        </div>
  
        <!-- Graphique en camembert -->
        <div class="bg-white p-6 rounded shadow">
          <h3 class="text-lg font-semibold mb-4 text-gray-800">Répartition des macronutriments 🥧</h3>
          <canvas id="pie-chart" height="220"></canvas>
        </div>
      </div>

      
    `;
  
    // Appel à l'API pour récupérer les données du jour
    fetch('/meals/today/compare')
      .then(res => res.json())
      .then(data => {
        const totals = data.totals;
  
        const bar = document.getElementById("bar-chart").getContext("2d");
        const pie = document.getElementById("pie-chart").getContext("2d");
  
        new Chart(bar, {
          type: "bar",
          data: {
            labels: ["Calories", "Protéines", "Glucides", "Lipides"],
            datasets: [
              {
                label: "Quantité consommée",
                data: [
                  totals.calories,
                  totals.proteins,
                  totals.carbs,
                  totals.fats
                ],
                backgroundColor: ["#10B981", "#6366F1", "#F59E0B", "#EF4444"],
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
  
        new Chart(pie, {
          type: "doughnut",
          data: {
            labels: ["Protéines", "Glucides", "Lipides"],
            datasets: [
              {
                label: "Répartition",
                data: [totals.proteins, totals.carbs, totals.fats],
                backgroundColor: ["#6366F1", "#F59E0B", "#EF4444"],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            cutout: 70,
          },
        });
      });
  }


  function exportMealsToExcel() {
    fetch('/meals/today')
      .then(res => res.json())
      .then(data => {
        const meals = data.meals.map(meal => ({
          Nom: meal.name,
          Calories: meal.calories,
          Protéines: meal.proteins,
          Glucides: meal.carbs,
          Lipides: meal.fats,
          Date: new Date(meal.date).toLocaleString("fr-FR")
        }));
  
        const worksheet = XLSX.utils.json_to_sheet(meals);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Repas");
  
        XLSX.writeFile(workbook, "Repas_Journaliers.xlsx");
      });
  }