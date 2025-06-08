// 'use client';

// import { signOut } from 'next-auth/react';
// import Cookies from 'js-cookie';

// const LogoutButton = () => {
//   const handleLogout = () => {
//     // 1. Supprimer les données locales si tu en stockes
//     Cookies.remove('userType');
//     Cookies.remove('token');// ou tout autre clé que tu utilises

//     // 2. Déconnexion via NextAuth
//     signOut({ callbackUrl: '/' }); // redirige vers la page d'accueil
//   };

//   return (
//     <button onClick={handleLogout} className="text-red-600 hover:underline">
//       Se déconnecter
//     </button>
//   );
// };

// const Sidebar = () => {
//   return (
//     <div className="flex flex-col h-full justify-between">
//       {/* ... menu ... */}
//       <LogoutButton />
//     </div>
//   );
// };

// export default Sidebar;
