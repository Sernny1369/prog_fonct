const express = require('express');
const mongoose = require('mongoose');
const Meal = require('./meal.js');
const Goal = require('./goal.js');
const path = require('path')



const app = express();
const PORT = 3000;

const Url = 'mongodb+srv://sergio:node@cluster0.slv7ehl.mongodb.net/NutriTrack?retryWrites=true&w=majority';

// Middleware pour parser le corps des requêtes en JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../front')));


// Connexion à MongoDB
mongoose.connect(Url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
});

app.get('/goal', async (req, res) => {
    try {
        const goal = await Goal.findOne(); // Récupère le seul objectif existant
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.status(200).json(goal); // Renvoie l'objectif en JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Gestion des erreurs
    }
});

app.put('/goal', async (req, res) => {
    try {
        // Mise à jour du seul objectif existant
        const updatedGoal = await Goal.findOneAndUpdate(
            {}, // Filtre vide pour trouver le seul objectif
            {
                name: req.body.name,
                calories: req.body.calories,
                proteins: req.body.proteins,
                glucides: req.body.glucides,
                lipides: req.body.lipides,
            },
            { new: true } // Retourne l'objectif mis à jour
        );

        // Si aucun objectif n'est trouvé
        if (!updatedGoal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        // Réponse avec l'objectif mis à jour
        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(400).json({ message: error.message }); // Gestion des erreurs
    }
});

app.get('/meal',async (req, res) => {
    try {
        // Récupération de tous les repas depuis la base de données
        const meals = await Meal.find();
        res.status(200).json(meals); // Réponse avec la liste des repas
    } catch (error) {
        res.status(500).json({ message: error.message }); // Gestion des erreurs
    }
});
app.post('/meal', async (req, res) => {
    try {
        console.log(req.body);
        // Création d'une nouvelle instance de Meal avec les données reçues
        const meal = new Meal({
            name: req.body.name,
            calories: req.body.calories,
            proteins: req.body.proteins,
            glucides: req.body.glucides,
            lipides: req.body.lipides,
        });

        // Sauvegarde dans la base de données
        const savedMeal = await meal.save();
        res.status(201).json(savedMeal); // Réponse avec l'objet sauvegardé
    } catch (error) {
        res.status(400).json({ message: error.message }); // Gestion des erreurs
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});