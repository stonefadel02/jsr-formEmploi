// data/personalityMapping.ts

export const questions = [
    {
      text: "En groupe, tu es plutôt...",
      options: [
        { text: "Celui qui lance les idées...", profile: "Le Créatif" },
        { text: "Celui qui structure...", profile: "Le Leader" },
        { text: "Celui qui observe...", profile: "L’Analytique" },
        { text: "Celui qui rassure...", profile: "Le Bienveillant" },
        { text: "Celui qui s’adapte...", profile: "Le Discret" },
        { text: "Celui qui met l’ambiance...", profile: "Le Spontané" },
      ],
    },
    {
      text: "Face à un nouveau projet...",
      options: [
        { text: "Tu fonces avec créativité", profile: "Le Créatif" },
        { text: "Tu établis une méthode claire", profile: "Le Leader" },
        { text: "Tu veux comprendre tous les détails", profile: "L’Analytique" },
        { text: "Tu cherches à coopérer", profile: "Le Bienveillant" },
        { text: "Tu t’adaptes sans stress", profile: "Le Discret" },
        { text: "Tu improvises et trouves sur le moment", profile: "Le Spontané" },
      ],
    },
    {
      text: "Ce que tu apprécies le plus dans un travail...",
      options: [
        { text: "La liberté de proposer...", profile: "Le Créatif" },
        { text: "Un cadre clair avec des responsabilités", profile: "Le Leader" },
        { text: "La précision, les défis techniques", profile: "L’Analytique" },
        { text: "L’ambiance bienveillante", profile: "Le Bienveillant" },
        { text: "Pouvoir apprendre sans pression", profile: "Le Discret" },
        { text: "La variété, les échanges, le fun", profile: "Le Spontané" },
      ],
    },
    {
      text: "Tes amis diraient que tu es...",
      options: [
        { text: "Créatif(ve) et plein(e) d’idées", profile: "Le Créatif" },
        { text: "Fiable et structuré(e)", profile: "Le Leader" },
        { text: "Posé(e) et intelligent(e)", profile: "L’Analytique" },
        { text: "Attentionné(e) et sympa", profile: "Le Bienveillant" },
        { text: "Calme et adaptable", profile: "Le Discret" },
        { text: "Drôle et sociable", profile: "Le Spontané" },
      ],
    },
    {
      text: "Ton espace de travail idéal, c’est...",
      options: [
        { text: "Créatif et stimulant", profile: "Le Créatif" },
        { text: "Organisé et fonctionnel", profile: "Le Leader" },
        { text: "Calme et propice à la réflexion", profile: "L’Analytique" },
        { text: "Chaleureux et collaboratif", profile: "Le Bienveillant" },
        { text: "Simple et sans pression", profile: "Le Discret" },
        { text: "Vivace et dynamique", profile: "Le Spontané" },
      ],
    },
    {
      text: "Tu te sens bien quand tu peux...",
      options: [
        { text: "Créer, proposer, exprimer", profile: "Le Créatif" },
        { text: "Gérer, diriger, organiser", profile: "Le Leader" },
        { text: "Comprendre, creuser, résoudre", profile: "L’Analytique" },
        { text: "Aider, soutenir, collaborer", profile: "Le Bienveillant" },
        { text: "Observer, écouter, apprendre", profile: "Le Discret" },
        { text: "Improviser, rire, connecter", profile: "Le Spontané" },
      ],
    },
  ];
  
  export const profileDescriptions = {
    "Le Créatif": {
      emoji: "\ud83d\udd25",
      description:
        "Tu as une imagination débordante et tu aimes proposer des idées. Tu t’exprimes avec originalité et énergie.",
    },
    "Le Leader": {
      emoji: "\ud83d\udcc5",
      description:
        "Tu sais diriger et prendre des décisions. Tu aimes que les choses soient organisées et efficaces.",
    },
    "L'Analytique": {
      emoji: "\ud83e\uddf0",
      description:
        "Tu aimes comprendre, analyser, résoudre. Tu trouves de la satisfaction dans les défis logiques.",
    },
    "Le Bienveillant": {
      emoji: "\ud83d\udc91",
      description:
        "Tu es bienveillant et à l’écoute. Tu valorises l’entraide et le travail d’équipe.",
    },
    "Le Discret": {
      emoji: "\ud83c\udf33",
      description:
        "Tu es calme, adaptable et préfères apprendre à ton rythme sans pression.",
    },
    "Le Spontané": {
      emoji: "\ud83c\udf1f",
      description:
        "Tu es sociable et dynamique. Tu aimes l’échange, le mouvement et la bonne humeur.",
    },
  };