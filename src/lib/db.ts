// Exemple avec base statique — à adapter avec ta vraie base MongoDB, MySQL, etc.
export const getCandidateById = (id: string) => {
    const candidats = [
      { id: '1', nom: 'Jean Dupont', email: 'jean@exemple.com' },
      { id: '2', nom: 'Marie Curie', email: 'marie@exemple.com' },
    ];
  
    return candidats.find((c) => c.id === id);
  };
          