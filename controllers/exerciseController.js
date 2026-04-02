const Exercise = require('../models/Exercise');

exports.listExercises = async (req, res) => {
    try {
        const exercises = await Exercise.getAll();
        res.render('exercises/index', { exercises });
    } catch (error) {
        res.status(500).send("Error al cargar ejercicios");
    }
};

