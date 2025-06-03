"use client";

import Image from "next/image";

export default function Entete() {
  return (
    <>
    

    {/* En-tête */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 35 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M35 25.9793V9.0207C35 4.03871 30.9613 0 25.9793 0H9.0207C4.03871 0 0 4.03871 0 9.0207V25.9793C0 30.9613 4.03871 35 9.0207 35H25.9793C30.9613 35 35 30.9613 35 25.9793Z"
                    fill="#7A20DA"
                  />
                  <path
                    d="M27.2474 15.5436L19.3006 8.88675C18.7959 8.46353 18.1583 8.23157 17.4997 8.23157C16.841 8.23157 16.2034 8.46353 15.6987 8.88675L7.75263 15.5436C6.74433 16.3885 7.34247 18.0319 8.65703 18.0319H9.37753V25.3689C9.37753 25.7407 9.52525 26.0973 9.78818 26.3603C10.0511 26.6232 10.4077 26.7709 10.7796 26.7709H14.7964V22.0323C14.7963 21.6772 14.8662 21.3256 15.002 20.9975C15.1378 20.6695 15.337 20.3714 15.588 20.1203C15.8391 19.8692 16.1372 19.6701 16.4653 19.5343C16.7933 19.3984 17.1449 19.3286 17.5 19.3286C17.855 19.3286 18.2066 19.3986 18.5346 19.5344C18.8626 19.6703 19.1607 19.8695 19.4117 20.1205C19.6628 20.3716 19.8619 20.6696 19.9978 20.9976C20.1337 21.3256 20.2036 21.6772 20.2036 22.0323V26.7709H24.2204C24.5923 26.7709 24.9489 26.6232 25.2118 26.3603C25.4747 26.0973 25.6225 25.7407 25.6225 25.3689V18.0319H26.3423C27.6582 18.0319 28.2557 16.3885 27.2474 15.5436Z"
                    fill="white"
                  />
                </svg>

                <h1 className="text-2xl font-bold text-[#8929E0]">
                  TABLEAU DE BORD Admin
                </h1>
              </div>
              <div className="flex gap-2 items-center space-x-4">
                <span className="text-sm font-bold text-[#8929E0]">
                  Administrateur@gmail.com
                </span>
                <Image
                  src="/admin-icon.png" // Remplace par ton icône d'admin si disponible
                  alt="Admin Icon"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>
            </div>

    </>
  );
}
