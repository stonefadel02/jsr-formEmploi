import mongoose from 'mongoose';

const uri = 'mongodb+srv://afedjoustone:H1YTwJjCEZ9AL3NR@employeur.jbqyfnw.mongodb.net/?retryWrites=true&w=majority&appName=employeur';

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connexion MongoDB réussie');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Échec connexion MongoDB :', err.message);
    process.exit(1);
  });
