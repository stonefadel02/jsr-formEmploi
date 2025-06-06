"use client";

export default function Employeur() {
  return (
    <>
      {/* Contenu principal (la div flex-1 a été déplacée dans GestionEmployeur) */}
      <div className="max-w-7xl w-full">
        {/* Filtres */}
        <div className="rounded-[15px] bg-white p-10">
          <div className="flex items-center gap-4">
            <svg
              width="39"
              height="37"
              viewBox="0 0 44 43"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.5499 0H4.43931C2.09211 0 0.150391 1.92822 0.150391 4.27539V38.5146C0.150391 40.7446 1.9029 42.5963 4.08789 42.7809V42.799H8.17858V29.9503H17.8106V42.799H25.8388V4.27539C25.8388 1.92822 23.8971 0 21.5499 0ZM8.71469 19.9669H5.86292V17.1151H8.71469V19.9669ZM8.71469 14.2588H5.86292V11.4071H8.71469V14.2588ZM8.71469 8.55528H5.86292V5.69898H8.71469V8.55528ZM14.4227 19.9669H11.5709V17.1151H14.4227V19.9669ZM14.4227 14.2588H11.5709V11.4071H14.4227V14.2588ZM14.4227 8.55528H11.5709V5.69898H14.4227V8.55528ZM20.1307 19.9669H17.2745V17.1151H20.1307V19.9669ZM20.1307 14.2588H17.2745V11.4071H20.1307V14.2588ZM20.1307 8.55528H17.2745V5.69898H20.1307V8.55528Z"
                fill="#7A20DA"
              />
              <path
                d="M39.5756 17.115H27.5469V42.7989H39.5756C41.9228 42.7989 43.851 40.8616 43.851 38.5145V21.3994C43.851 19.0522 41.9228 17.115 39.5756 17.115ZM33.7955 30.9278H30.9438V28.0761H33.7955V30.9278ZM33.7955 25.2243H30.9438V22.368H33.7955V25.2243ZM39.5035 30.9278H36.6473V28.0761H39.5035V30.9278ZM39.5035 25.2243H36.6473V22.368H39.5035V25.2243Z"
                fill="#7A20DA"
              />
            </svg>

            <h1 className="text-2xl font-bold text-[#8929E0]">
              Gestion des Employeurs
            </h1>
          </div>
          <div className="border-[1px] my-4 border-[#8929E0]"></div>

          {/* Tableau */}
          <div className="bg-white p-4 rounded-[20px] border-[1px] border-[#C4C4C4] shadow-md">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-6 px-6">Entreprise</th>
                  <th className="py-6 px-6">Email</th>
                  <th className="py-6 px-6">Statut</th>
                  <th className="py-6 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b text-[#4C4C4C] border-gray-200 odd:bg-white even:bg-[#F6F6F6]">
                  <td className="py-6 px-6">A. André</td>
                  <td className="py-6 px-6">Informatique</td>
                  <td className="py-6 px-6">En attente</td>
                  <td className="py-6 px-6 flex space-x-2">
                    <button className="bg-[#7A20DA] flex font-bold text-white px-4 items-center gap-2 py-1 rounded-[5px]">
                      <svg
                        width="16"
                        height="14"
                        viewBox="0 0 18 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.71124 9.00215L5.30016 11.6103C7.32455 7.32071 9.67154 4.54884 11.6598 2.79623C12.8109 1.78166 13.8326 1.11664 14.5874 0.698472C14.9645 0.489496 15.2745 0.342343 15.5007 0.244021C15.6136 0.19487 15.7055 0.157922 15.7743 0.131554C15.8088 0.118371 15.8374 0.107833 15.86 0.0997265L15.8893 0.0893793L15.9005 0.0855403L15.9052 0.0839402L15.9092 0.0825324C16.7414 -0.196884 17.6407 0.256159 17.9182 1.09445C18.1943 1.92871 17.749 2.83051 16.9246 3.11457L16.9038 3.12234C16.8776 3.13243 16.8289 3.15174 16.7598 3.18175C16.622 3.24176 16.4026 3.34461 16.118 3.50228C15.5492 3.81743 14.718 4.35239 13.7515 5.20441C11.8252 6.90242 9.32383 9.89237 7.29804 14.9943C7.09977 15.4935 6.66572 15.8591 6.14276 15.9673C5.61979 16.0754 5.0779 15.9116 4.70039 15.5315L0.46517 11.2649C-0.155057 10.6401 -0.155057 9.62699 0.46517 9.00215C1.0854 8.37732 2.09101 8.37732 2.71124 9.00215Z"
                          fill="white"
                        />
                      </svg>
                      Valider
                    </button>
                    <button className="bg-[#F4E9FF] text-[#7A20DA] font-bold flex px-4 items-center gap-2 py-1 rounded-[5px]">
                      <svg
                        width="5"
                        height="14"
                        viewBox="0 0 7 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.23938 0.627251V15.3727C2.23938 15.6236 2.05277 15.8044 1.67954 15.9164C1.49893 15.9721 1.31274 16 1.11969 16L0.559846 15.9164C0.186186 15.8044 0 15.6236 0 15.3727V0.627251C0 0.37635 0.186615 0.195609 0.559846 0.0836335C0.740026 0.0278779 0.926641 0 1.11969 0L1.67954 0.0836335C2.05277 0.195145 2.23938 0.37635 2.23938 0.627251ZM7 0.627251V15.3727C7 15.6236 6.81339 15.8044 6.44016 15.9164C6.25955 15.9721 6.07336 16 5.88031 16L5.32046 15.9164C4.9468 15.8044 4.76062 15.6236 4.76062 15.3727V0.627251C4.76062 0.37635 4.94723 0.195609 5.32046 0.0836335C5.50064 0.0278779 5.68726 0 5.88031 0L6.44016 0.0836335C6.81339 0.195145 7 0.37635 7 0.627251Z"
                          fill="#7A20DA"
                        />
                      </svg>
                      Suspendre
                    </button>
                    <button className="bg-[#FF0000] text-white flex font-bold px-4 items-center gap-2 py-1 rounded-[5px]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_63_3710)">
                          <path
                            d="M19.1667 2.5H14.7675L14.685 2.25418C14.2358 0.90582 12.9792 0 11.5583 0H8.44164C7.02082 0 5.76414 0.90582 5.31414 2.25418L5.2325 2.5H0.83332C0.3725 2.5 0 2.87332 0 3.33332C0 3.79332 0.3725 4.16664 0.83332 4.16664H5.83332H14.1666H19.1666C19.6275 4.16664 20 3.79332 20 3.33332C20 2.87332 19.6275 2.5 19.1667 2.5ZM7.02 2.5C7.30418 1.99168 7.84332 1.66668 8.44168 1.66668H11.5584C12.1567 1.66668 12.6967 1.99168 12.98 2.5H7.02Z"
                            fill="white"
                          />
                          <path
                            d="M17.4995 5H2.49945C2.26945 5 2.04945 5.095 1.89195 5.2625C1.73445 5.43082 1.65277 5.65582 1.66777 5.885L2.40363 17.65C2.48445 18.9683 3.58363 20 4.90363 20H15.0953C16.4153 20 17.5145 18.9683 17.5953 17.6508L18.3311 5.885C18.3461 5.65582 18.2645 5.43082 18.107 5.2625C17.9495 5.095 17.7295 5 17.4995 5ZM14.1661 16.6667H5.83281C5.37199 16.6667 4.99949 16.2934 4.99949 15.8334C4.99949 15.3734 5.37195 15 5.83281 15H14.1661C14.627 15 14.9995 15.3733 14.9995 15.8333C14.9995 16.2933 14.627 16.6667 14.1661 16.6667ZM14.1661 13.3333H5.83281C5.37199 13.3333 4.99949 12.96 4.99949 12.5C4.99949 12.04 5.37199 11.6667 5.83281 11.6667H14.1661C14.627 11.6667 14.9995 12.04 14.9995 12.5C14.9995 12.96 14.627 13.3333 14.1661 13.3333Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_63_3710">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Supprimer
                    </button>
                    <button className="bg-[#F4E9FF] text-[#7A20DA] font-bold flex px-4 items-center gap-2 py-1 rounded-[5px]">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 23 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.5 0C5.16147 0 0 5.16147 0 11.5C0 17.8385 5.16147 23 11.5 23C17.8385 23 23 17.8385 23 11.5C23 5.16147 17.8385 0 11.5 0ZM10.8235 16.0797V15.3829C10.8235 15.0109 11.1279 14.7065 11.5 14.7065C11.8721 14.7065 12.1765 15.0109 12.1765 15.3829V16.0797C12.1765 16.4585 11.8721 16.7562 11.5 16.7562C11.1279 16.7562 10.8235 16.4585 10.8235 16.0797ZM12.1765 13.2047C12.1765 13.5768 11.8721 13.8812 11.5 13.8812C11.1279 13.8812 10.8235 13.5768 10.8235 13.2047V6.92029C10.8235 6.54147 11.1279 6.24382 11.5 6.24382C11.8721 6.24382 12.1765 6.54147 12.1765 6.92029V13.2047Z"
                          fill="#7A20DA"
                        />
                      </svg>
                      Détails
                    </button>
                  </td>
                </tr>

                <tr className="border-b border-gray-200 odd:bg-white even:bg-[#F6F6F6]">
                  <td className="py-6 px-6">C. Lefèvre</td>
                  <td className="py-6 px-6">Marketing</td>
                  <td className="py-6 px-6">Refusé</td>
                  <td className="py-6 px-6 flex space-x-2">
                    <button className="bg-red-600 text-white px-2 py-1 rounded-md">
                      Refuser
                    </button>
                    <button className="bg-[#7A20DA] text-white px-2 py-1 rounded-md">
                      Détails
                    </button>
                    <button className="bg-red-600 text-white px-2 py-1 rounded-md">
                      Supprimer
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 odd:bg-white even:bg-[#F6F6F6]">
                  <td className="py-6 px-6">D. Garcia</td>
                  <td className="py-6 px-6">Informatique</td>
                  <td className="py-6 px-6">En attente</td>
                  <td className="py-6 px-6 flex space-x-2">
                    <button className="bg-[#7A20DA] text-white px-2 py-1 rounded-md">
                      Valider
                    </button>
                    <button className="bg-[#7A20DA] text-white px-2 py-1 rounded-md">
                      Modifier
                    </button>
                    <button className="bg-red-600 text-white px-2 py-1 rounded-md">
                      Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button className="bg-[#7A20DA] text-white py-2 px-10 mt-10 font-semibold rounded-[5px]">
            Voir plus d’employeurs
          </button>
        </div>
      </div>
    </>
  );
}