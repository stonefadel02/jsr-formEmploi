'use client';

import Footer from "@/app/components/footer/page";
import Navbar from "@/app/components/navbar/page";

export default function ProfileEmployeur() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex mt-10 items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-7xl">
          {/* Table des candidats */}
          <div className="bg-white rounded-[20px] px-10 border border-[#C4C4C4] shadow-md overflow-x-auto">
            <table className="w-full ">
              <thead className="">
                <tr>
                  <th className="px-6 py-6 text-sm font-semibold text-left text-[#202020]">Nom (anonymisé)</th>
                  <th className="px-6 py-3 text-sm font-semibold text-start text-[#202020]">Secteur</th>
                  <th className="px-6 py-3 text-sm font-semibold text-start text-[#202020]">Localisation</th>
                  <th className="px-6 py-3 text-sm font-semibold text-start text-[#202020]">Niveau d`étude</th>
                  <th className="px-6 py-3 text-sm font-semibold text-start text-[#202020]">Date de soumission</th>
                  <th className="px-6 py-3 text-sm font-semibold  text-end text-[#202020]">Actions</th>
                </tr>
              </thead>
              <tbody className="" >
                <tr className="border-t  border-[#C4C4C4]">
                  <td className="px-6 py-4 text-[#4C4C4C]">C- --------</td>
                  <td className="px-6 text-start py-4 text-[#4C4C4C]">Informatique</td>
                  <td className="px-6 text-start py-4 text-[#4C4C4C]">Paris</td>
                  <td className="px-6 text-start py-4 text-[#4C4C4C]">Bac +3</td>
                  <td className="px-6 text-start py-4  text-[#4C4C4C]">01/05/2025</td>
                  <td className="px-6 text-end py-4">
                    <button className="bg-[#7A20DA] text-white px-4 py-2 rounded-[5px] hover:bg-[#6A1AB8] transition duration-200">
                      Voir le profil
                    </button>
                  </td>
                </tr>
                {/* <tr className="border-t border-[#ECECEC]">
                  <td className="px-6 py-4 text-[#4C4C4C]">C- --------</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Commerce</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Lyon</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Bac +2</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">21/04/2025</td>
                  <td className="px-6 py-4">
                    <button className="bg-[#7A20DA] text-white px-4 py-2 rounded-[10px] hover:bg-[#6A1AB8] transition duration-200">
                      Voir le profil
                    </button>
                  </td>
                </tr> */}
                {/* <tr className="border-t border-[#ECECEC]  ">
                  <td className="px-6 py-4 text-[#4C4C4C]">C- --------</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Marketing</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Marseille</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Bac</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">15/04/2025</td>
                  <td className="px-6 py-4">
                    <button className="bg-[#7A20DA] text-white px-4 py-2 rounded-[10px] hover:bg-[#6A1AB8] transition duration-200">
                      Voir le profil
                    </button>
                  </td>
                </tr> */}
                {/* <tr className="border-t border-[#ECECEC] px-4 ">
                  <td className="px-6 py-4 text-[#4C4C4C]">C- --------</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Informatique</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Nantes</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Bac +3</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">11/04/2025</td>
                  <td className="px-6 py-4">
                    <button className="bg-[#7A20DA] text-white px-4 py-2 rounded-[10px] hover:bg-[#6A1AB8] transition duration-200">
                      Voir le profil
                    </button>
                  </td>
                </tr> */}
                {/* <tr className="border-t border-[#ECECEC] ">
                  <td className="px-6 py-4 text-[#4C4C4C]">C- --------</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Commerce</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Paris</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Bac +2</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">05/04/2025</td>
                  <td className="px-6 py-4">
                    <button className="bg-[#7A20DA] text-white px-4 py-2 rounded-[10px] hover:bg-[#6A1AB8] transition duration-200">
                      Voir le profil
                    </button>
                  </td>
                </tr> */}
                {/* <tr className="border-t border-[#ECECEC]">
                  <td className="px-6 py-4 text-[#4C4C4C]">C- --------</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Informatique</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Bordeaux</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Bac +3</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">25/03/2025</td>
                  <td className="px-6 py-4">
                    <button className="bg-[#7A20DA] text-white px-4 py-2 rounded-[10px] hover:bg-[#6A1AB8] transition duration-200">
                      Voir le profil
                    </button>
                  </td>
                </tr> */}
                {/* <tr className="border-t border-[#ECECEC]">
                  <td className="px-6 py-4 text-[#4C4C4C]">C- --------</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Commerce</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Lyon</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">Bac +5</td>
                  <td className="px-6 py-4 text-[#4C4C4C]">20/03/2025</td>
                  <td className="px-6 py-4">
                    <button className="bg-[#7A20DA] text-white px-4 py-2 rounded-[10px] hover:bg-[#6A1AB8] transition duration-200">
                      Voir le profil
                    </button>
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <nav className="flex space-x-2">
              <button className="px-3 py-1 text-sm font-medium text-white bg-[#7A20DA] rounded hover:bg-[#6A1AB8] transition duration-200">
                1
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition duration-200">
                2
              </button>
            </nav>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}