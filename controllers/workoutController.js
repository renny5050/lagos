const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

// Mostrar el historial del usuario
exports.getDashboard = async (req, res) => {
    try {
        const history = await Workout.getUserHistory(req.session.userId);
        res.render('dashboard', { history, username: req.session.username });
    } catch (error) {
        res.status(500).send("Error al cargar el historial");
    }
};

// Formulario para nueva sesión
exports.getNewSession = async (req, res) => {
    const exercises = await Exercise.getAll();
    res.render('workouts/new', { exercises });
};

// Guardar sesión y sus series
exports.postWorkout = async (req, res) => {
    const { notes, sets } = req.body; 
    // "sets" sería un array de objetos [{exercise_id, reps, weight}, ...]
    
    try {
        const session = await Workout.createSession(req.session.userId, notes);
        const sessionId = session.id;

        // Guardamos cada serie en la base de datos
        for (let i = 0; i < sets.length; i++) {
            const { exercise_id, reps, weight } = sets[i];
            await Workout.addSet(sessionId, exercise_id, reps, weight, i + 1);
        }

        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send("Error al guardar el entrenamiento");
    }
};