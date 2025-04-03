// Gestion de l'affichage des sections
function setupNavigation() {
    document.querySelectorAll('nav button').forEach(button => {
        button.addEventListener('click', () => {
            // Cacher toutes les sections
            document.querySelectorAll('section').forEach(section => {
                section.classList.add('hidden');
            });

            // Afficher la section correspondante
            const target = button.getAttribute('data-target');
            document.getElementById(target).classList.remove('hidden');
        });
    });

    // Afficher la section "Dashboard" par défaut
    document.getElementById('dashboard').classList.remove('hidden');
}

// Fonction générique pour récupérer des données depuis une URL
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des données depuis ${url}`);
    }
    return response.json();
}

// Fonction pour récupérer et afficher les repas
async function fetchMeals() {
    try {
        const meals = await fetchData('/meal');
        const mealList = document.querySelector('#meal-list ul'); // Sélectionne la liste des repas

        // Vide la liste avant d'ajouter les repas
        mealList.innerHTML = '';

        // Ajoute chaque repas à la liste
        meals.forEach(meal => {
            const mealItem = document.createElement('li');
            mealItem.classList.add('flex', 'justify-between', 'items-center', 'border-b', 'pb-2', 'mb-2');
            mealItem.innerHTML = `
                <div>${meal.name}</div>
                <div>${meal.calories} Calories</div>
                <div>${meal.proteins}g Protéines</div>
                <div>${meal.glucides}g Glucides</div>
                <div>${meal.lipides}g Lipides</div>
            `;
            mealList.appendChild(mealItem);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des repas:', error);
    }
}

// Fonction pour récupérer et afficher les informations de l'objectif
async function fetchGoal() {
    try {
        const goal = await fetchData('/goal');

        // Pré-remplir les placeholders des champs du formulaire
        document.getElementById('name').placeholder = goal.name || 'Nom de l\'objectif';
        document.getElementById('calories').placeholder = goal.calories || '0';
        document.getElementById('proteines').placeholder = goal.proteins || '0';
        document.getElementById('glucides').placeholder = goal.glucides || '0';
        document.getElementById('lipides').placeholder = goal.lipides || '0';
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'objectif:', error);
    }
}

// Fonction pour calculer les totaux des repas
function calculateTotals(meals) {
    return meals.reduce(
        (acc, meal) => ({
            calories: acc.calories + (meal.calories || 0),
            proteins: acc.proteins + (meal.proteins || 0),
            glucides: acc.glucides + (meal.glucides || 0),
            lipides: acc.lipides + (meal.lipides || 0),
        }),
        { calories: 0, proteins: 0, glucides: 0, lipides: 0 }
    );
}

// Fonction pour mettre à jour une barre de progression
function updateProgressBar(type, total, goal) {
    const progressBar = document.getElementById(`${type}-progress`);
    const progressText = document.getElementById(`${type}-text`);

    const percentage = Math.min((total / goal) * 100, 100); // Limiter à 100%
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${total} / ${goal}`;
}

// Fonction pour calculer et afficher les barres de progression
async function updateDashboard() {
    try {
        const [meals, goal] = await Promise.all([fetchData('/meal'), fetchData('/goal')]);
        const totals = calculateTotals(meals);

        // Mettre à jour les barres de progression
        updateProgressBar('calories', totals.calories, goal.calories);
        updateProgressBar('proteins', totals.proteins, goal.proteins);
        updateProgressBar('glucides', totals.glucides, goal.glucides);
        updateProgressBar('lipides', totals.lipides, goal.lipides);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du dashboard:', error);
    }
}


// Fonction pour gérer la soumission du formulaire "Add Meal"
function handleMealFormSubmit() {
    const mealForm = document.querySelector('#meal-form form');
    mealForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Empêche la redirection par défaut

        // Récupérer les données du formulaire
        const formData = new FormData(mealForm);
        const mealData = {
            name: formData.get('name'),
            calories: parseInt(formData.get('calories'), 10) || 0,
            proteins: parseInt(formData.get('proteins'), 10) || 0,
            glucides: parseInt(formData.get('glucides'), 10) || 0,
            lipides: parseInt(formData.get('lipides'), 10) || 0,
        };

        try {
            // Envoyer les données au backend
            const response = await fetch('/meal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mealData),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout du repas');
            }

            // Réinitialiser le formulaire après soumission
            mealForm.reset();

            // Optionnel : Mettre à jour la liste des repas ou le dashboard
            await fetchMeals();
            await updateDashboard();

            alert('Repas ajouté avec succès !');
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
            alert('Une erreur est survenue lors de l\'ajout du repas.');
        }
    });
}

// Initialisation de l'application
function init() {
    setupNavigation();
    fetchMeals();
    fetchGoal();
    updateDashboard();
    handleMealFormSubmit(); // Ajout du gestionnaire pour le formulaire "Add Meal"
}


// Appeler init lorsque la page est chargée
document.addEventListener('DOMContentLoaded', init);

