"use client";

import { IActiveSubscription, statsType } from "@/lib/types";
import { useState, useEffect } from "react";

export default function Abonnement() {
  const [subscriptions, setSubscriptions] = useState<IActiveSubscription[]>([]);
  const [stats, setStats] = useState<statsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch("/api/admin/subscriptions");
        if (!response.ok) throw new Error("Erreur lors du chargement des données");
        const data = await response.json();
        setSubscriptions(data.data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleRenew = (employerId: string) => {
    const confirmRenouvellement = window.confirm("Êtes-vous sûr de vouloir renouveler l'abonnement ?");
    if (confirmRenouvellement) {
      fetch(`/api/admin/subscriptions/${employerId}/renouveler`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Erreur lors du renouvellement");
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            alert(`Erreur : ${data.error}`);
          } else {
            alert("Abonnement renouvelé avec succès !");
            setSubscriptions((prev) =>
              prev.map((sub) =>
                sub.type === "employer" && sub.employerId?.toString() === employerId
                  ? { ...sub, isActive: true }
                  : sub
              )
            );
          }
        })
        .catch((error) => {
          console.error("Erreur lors du renouvellement :", error);
          alert("Une erreur est survenue lors du renouvellement de l'abonnement.");
        });
    }
  };

  const handleMarkAsPaid = (employerId: string) => {
    const confirmPayment = window.confirm("Confirmez-vous le paiement de cet abonnement ?");
    if (confirmPayment) {
      fetch(`/api/admin/subscriptions/${employerId}/renouveler`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(`Erreur : ${data.error}`);
          } else {
            alert("Abonnement marqué comme payé avec succès !");
            setSubscriptions((prev) =>
              prev.map((sub) =>
                sub.type === "employer" && sub.employerId?.toString() === employerId
                  ? { ...sub, isActive: true, isTrial: false }
                  : sub
              )
            );
          }
        })
        .catch((error) => {
          console.error("Erreur lors du marquage comme payé :", error);
          alert("Une erreur est survenue lors du marquage de l'abonnement.");
        });
    }
  };

  const updateStats = () => {
    if (subscriptions.length > 0) {
      const newStats = {
        totalActifs: subscriptions.filter((sub) => sub.isActive && !sub.isTrial).length,
        totalEssais: subscriptions.filter((sub) => sub.isTrial && sub.isActive).length,
        expirés: 0, // Pas d'expirés dans cette liste car seuls les actifs sont récupérés
        revenusMensuels: subscriptions.reduce((acc, sub) => {
          if (sub.isActive && !sub.isTrial) {
            const price = sub.plan === "Premium" ? 500 : sub.plan === "Gratuit" ? 0 : 200;
            return acc + price;
          }
          return acc;
        }, 0),
      };
      setStats(newStats);
    }
  };

  useEffect(() => {
    updateStats();
  }, [subscriptions]);

  return (
    <>
      <div className="max-w-7xl w-full">
        <div className="rounded-[15px] bg-white p-10">
          <div className="flex items-center gap-4">
            <svg
              width="36"
              height="31"
              viewBox="0 0 47 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.56005 8.14858C1.16823 8.44317 0.247609 9.86029 0.542196 11.2521L5.37104 34.0666C5.66562 35.4584 7.08146 36.381 8.47328 36.0865L44.4125 28.4797C45.8043 28.1851 46.7266 26.7676 46.432 25.3758L41.6031 2.5613C41.3085 1.16948 39.8911 0.247229 38.4992 0.541816L2.56005 8.14858ZM3.76219 11.138L38.6114 3.76197L43.2102 25.4898L8.36102 32.8658L3.76219 11.138Z"
                fill="#7A20DA"
              />
              <path
                d="M3.27518 15.2305C2.41787 15.4119 1.87003 16.2542 2.05126 17.1116C2.23271 17.9689 3.07502 18.5167 3.93238 18.3355L41.6286 10.3569C42.4863 10.1763 43.035 9.33455 42.8544 8.47681C42.8543 8.47634 42.8542 8.47588 42.8541 8.47541C42.6726 7.61787 41.8301 7.07009 40.9728 7.25154C40.9723 7.25164 40.9718 7.25174 40.9714 7.25184L3.27518 15.2305Z"
                fill="#7A20DA"
              />
              <path
                d="M10.8689 27.2935C10.0116 27.4749 9.46378 28.3172 9.64501 29.1746C9.82646 30.0319 10.6688 30.5797 11.5261 30.3985L13.1991 30.0444C14.0564 29.863 14.6042 29.0207 14.423 28.1633C14.2415 27.306 13.3992 26.7582 12.5419 26.9394L10.8689 27.2935Z"
                fill="#7A20DA"
              />
              <path
                d="M32.3787 22.7407C31.5214 22.9222 30.9736 23.7645 31.1548 24.6219C31.3362 25.4792 32.1785 26.027 33.0359 25.8458L39.3661 24.5059C40.2235 24.3245 40.7713 23.4822 40.5901 22.6248C40.4086 21.7675 39.5663 21.2197 38.7089 21.4009L32.3787 22.7407Z"
                fill="#7A20DA"
              />
              <path
                d="M4.82976 34.2212C2.70222 34.2212 0.941406 35.982 0.941406 38.1095C0.941406 40.2371 2.70222 41.9998 4.82976 41.9998H33.9926C34.8697 41.9998 35.581 41.2887 35.581 40.4116C35.581 40.4116 35.581 40.4116 35.581 40.4114C35.5808 39.5646 34.9166 38.8671 34.0707 38.8254H4.82976C4.40635 38.8254 4.11629 38.533 4.11629 38.1095C4.11629 37.6861 4.40635 37.3961 4.82976 37.3961H41.8044C42.2278 37.3961 42.5183 37.6861 42.5183 38.1095C42.5183 38.533 42.2278 38.8254 41.8044 38.8254H39.6006C38.7433 38.8518 38.062 39.5539 38.061 40.4114C38.061 41.2885 38.7721 41.9998 39.6492 41.9998H41.8044C43.9319 41.9998 45.6932 40.2371 45.6932 38.1095C45.6932 35.982 43.9319 34.2212 41.8044 34.2212H4.82976Z"
                fill="#7A20DA"
              />
            </svg>
            <h1 className="text-2xl font-bold text-[#8929E0]">
              Statistiques Globales
            </h1>
          </div>
          <div className="border-[1px] my-4 border-[#8929E0]"></div>
          <h4 className="py-4">Statistiques des Abonnements</h4>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex w-1/3">
              <div className="w-2 rounded-l-[20px] bg-[#2A9D8F]"></div>
              <div className="bg-white rounded-r-[20px] p-4 shadow-md flex-1 text-center">
                <h3 className="text-[#4E4E4E] text-left font-semibold">
                  Abonnements Actifs
                </h3>
                <div className="flex items-center py-4 justify-between">
                  <p className="text-4xl font-bold text-[#7A20DA]">{stats?.totalActifs}</p>
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 63 63"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M31.5 0C14.1031 0 0 14.1031 0 31.5C0 48.8969 14.1031 63 31.5 63C48.8969 63 63 48.8969 63 31.5C63 14.1031 48.8969 0 31.5 0ZM42.5891 32.8933L27.2489 43.3362C26.7327 43.6875 26.0644 43.7247 25.5124 43.4328C24.9604 43.1407 24.615 42.5674 24.615 41.9429V21.0571C24.615 20.4326 24.9604 19.8593 25.5124 19.5672C26.0644 19.2753 26.7327 19.3123 27.2489 19.6638L42.5891 30.1067C43.0501 30.4206 43.3262 30.9422 43.3262 31.5C43.3262 32.0578 43.0503 32.5794 42.5891 32.8933Z"
                      fill="#2A9D8F"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex w-1/3">
              <div className="w-2 rounded-l-[20px] bg-[#2A9D8F]"></div>
              <div className="bg-white rounded-r-[20px] p-4 shadow-md flex-1 text-center">
                <h3 className="text-[#4E4E4E] text-left font-semibold">
                  Périodes d'Essai Actives
                </h3>
                <div className="flex items-center py-4 justify-between">
                  <p className="text-4xl font-bold text-[#7A20DA]">{stats?.totalEssais}</p>
                  <svg
                    width="28"
                    height="33"
                    viewBox="0 0 58 63"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.4197 60.6905H0V57.3313H22.7346C22.2397 58.411 22.1347 59.5808 22.4197 60.6905Z"
                      fill="#EDC12E"
                    />
                    <path
                      d="M24.2497 57.6761C23.6199 58.7558 23.6049 60.0005 24.1748 61.0953C24.2047 61.1402 24.2197 61.1852 24.2497 61.2302C24.8946 62.3549 26.0193 62.9998 27.324 62.9998H54.3776C55.6822 62.9998 56.792 62.3549 57.4518 61.2302C58.0967 60.1055 58.0967 58.8158 57.4518 57.6911L45.8746 37.6408L43.925 34.2666C43.2802 33.1419 42.1555 32.4971 40.8508 32.4971C39.5461 32.4971 38.4364 33.1419 37.7765 34.2666L24.2497 57.6761ZM39.2012 42.2897H42.5004L43.2052 52.7272H38.4813L39.2012 42.2897ZM43.2652 59.4007H38.4364V55.8615H43.2652V59.4007Z"
                      fill="#EDC12E"
                    />
                    <path d="M0 0H49.6682V3.3592H0V0Z" fill="#EDC12E" />
                    <path
                      d="M45.7832 34.4767L47.2828 37.0711V4.84375H45.7832V34.4767Z"
                      fill="#EDC12E"
                    />
                    <path
                      d="M35.4671 12.7919C35.3321 15.6262 32.0929 18.7454 30.1883 20.3651C29.1086 21.2648 27.0991 23.0644 25.5994 25.2539V35.4215C27.1141 37.6109 29.1086 39.4105 30.1883 40.3103C30.5932 40.6552 31.1481 41.1351 31.748 41.72L30.9682 43.0696L28.3738 47.5386L27.504 49.0382H14.982C14.5921 49.0382 14.2771 48.7383 14.2321 48.3634C14.2171 48.2134 14.2171 48.0485 14.2171 47.8985C14.3521 45.0642 17.5763 41.9449 19.4959 40.3253C20.5756 39.4255 22.5852 37.6259 24.0848 35.4365V25.2839C22.5852 23.0944 20.5756 21.2948 19.4959 20.3951C17.5763 18.7754 14.3521 15.6562 14.2171 12.8219C14.2022 12.6719 14.2171 12.5069 14.2321 12.357C14.2621 11.9671 14.5921 11.6821 14.982 11.6821H34.7023C35.0922 11.6821 35.4071 11.9821 35.4521 12.357C35.4671 12.4919 35.4671 12.6419 35.4671 12.7919Z"
                      fill="#EDC12E"
                    />
                    <path
                      d="M27.8325 30.3377C27.8325 32.4822 31.4466 35.9613 32.8413 37.1161C33.1862 37.416 33.5311 37.7159 33.8611 38.0158L33.0962 39.3505C32.7063 38.9756 32.3014 38.6157 31.8815 38.2558C31.3267 37.7909 26.3328 33.5619 26.3328 30.3377C26.3328 27.1134 31.3117 22.8844 31.8815 22.4046C35.8856 18.9704 38.0451 15.6112 38.09 12.6719C38.12 10.6924 37.2202 9.43266 36.8153 8.98276H12.8511C12.4462 9.43266 11.5464 10.6924 11.5764 12.6719C11.6214 15.6112 13.7808 18.9854 17.7999 22.4046C18.3547 22.8694 23.3486 27.0984 23.3486 30.3227C23.3486 33.5469 18.3697 37.7759 17.7999 38.2558C13.7958 41.69 11.6364 45.0492 11.5914 47.9885C11.5614 49.968 12.4612 51.2277 12.8661 51.6776H25.9729L25.1031 53.1772L23.5885 55.8166H11.7863V52.7423C11.2464 52.1425 10.0467 50.5229 10.0767 48.0185C10.1217 44.5693 12.3862 40.9101 16.8251 37.1161C18.2348 35.9463 21.8489 32.4822 21.8489 30.3377C21.8489 28.1932 18.2348 24.714 16.8401 23.5593C12.4012 19.7652 10.1217 16.0911 10.0917 12.6569C10.0617 10.1375 11.2614 8.53287 11.8013 7.93301V4.84375H37.9101V7.93301C38.45 8.53287 39.6497 10.1525 39.6197 12.6569C39.5747 16.1061 37.3102 19.7652 32.8713 23.5593C31.4616 24.729 27.8325 28.1932 27.8325 30.3377Z"
                      fill="#EDC12E"
                    />
                    <path
                      d="M2.40039 4.84375H3.90003V55.8316H2.40039V4.84375Z"
                      fill="#EDC12E"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex w-1/3">
              <div className="w-2 rounded-l-[20px] bg-[#2A9D8F]"></div>
              <div className="bg-white rounded-r-[20px] p-4 shadow-md flex-1 text-center">
                <h3 className="text-[#4E4E4E] text-left font-semibold">
                  Abonnements Expirés
                </h3>
                <div className="flex items-center py-4 justify-between">
                  <p className="text-4xl font-bold text-[#7A20DA]">{stats?.expirés}</p>
                  <svg
                    width="33"
                    height="33"
                    viewBox="0 0 63 63"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M31.5 0C14.1031 0 0 14.1031 0 31.5C0 48.8969 14.1031 63 31.5 63C48.8969 63 63 48.8969 63 31.5C63 14.1031 48.8969 0 31.5 0ZM42.5891 32.8933L27.2489 43.3362C26.7327 43.6875 26.0644 43.7247 25.5124 43.4328C24.9604 43.1407 24.615 42.5674 24.615 41.9429V21.0571C24.615 20.4326 24.9604 19.8593 25.5124 19.5672C26.0644 19.2753 26.7327 19.3123 27.2489 19.6638L42.5891 30.1067C43.0501 30.4206 43.3262 30.9422 43.3262 31.5C43.3262 32.0578 43.0503 32.5794 42.5891 32.8933Z"
                      fill="#FF0000"
                    />
                    <rect x="17" y="17" width="29" height="29" rx="5" fill="white" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[20px] py-2 px-6 shadow-md border-[1px] border-[#C4C4C4] mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <h3 className="text-[#4E4E4E] font-semibold">Type d’abonnement</h3>
              <select
                defaultValue=""
                className="p-2 pr-6 border border-[#F1F1F1] text-[#4C4C4C] rounded-[15px] w-full sm:w-[250px]"
              >
                <option value="">Tous</option>
              </select>
              <h3 className="text-[#4E4E4E] font-semibold">Secteur</h3>
              <select className="p-2 border border-[#F1F1F1] text-[#4C4C4C] rounded-[15px] w-full sm:w-[250px]">
                <option value="">Tous</option>
              </select>
              <div className="flex items-center w-full sm:w-auto space-x-2">
                <input
                  type="text"
                  placeholder="Recherche par..."
                  className="p-2 border border-[#F1F1F1] rounded-[15px] w-full sm:w-[250px]"
                />
                <button className="">
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 153 53"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="153" height="53" rx="5" fill="#7A20DA" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M81.0277 31.7095C82.6485 29.8944 83.4335 27.5903 83.2214 25.2712C83.0092 22.952 81.816 20.794 79.8871 19.2409C77.9582 17.6879 75.4402 16.8578 72.8509 16.9214C70.2617 16.985 67.7979 17.9374 65.9663 19.5828C64.1348 21.2283 63.0746 23.4416 63.0038 25.7677C62.933 28.0939 63.857 30.3559 65.5858 32.0888C67.3145 33.8217 69.7167 34.8936 72.2982 35.0842C74.8797 35.2748 77.4444 34.5696 79.4649 33.1135L89.1011 41.7694C89.203 41.8642 89.3249 41.9397 89.4596 41.9917C89.5944 42.0437 89.7393 42.0711 89.886 42.0723C90.0326 42.0734 90.178 42.0483 90.3138 41.9984C90.4495 41.9485 90.5728 41.8748 90.6765 41.7817C90.7802 41.6885 90.8622 41.5777 90.9178 41.4558C90.9733 41.3339 91.0012 41.2032 91 41.0715C90.9987 40.9397 90.9682 40.8095 90.9103 40.6885C90.8524 40.5674 90.7683 40.458 90.6628 40.3664L81.0277 31.7095ZM73.131 33.1304C71.5654 33.1304 70.035 32.7133 68.7333 31.9319C67.4316 31.1506 66.4171 30.04 65.818 28.7406C65.2189 27.4412 65.0621 26.0114 65.3676 24.6320C65.673 23.2526 66.4269 21.9855 67.5339 20.9910C68.6409 19.9965 70.0513 19.3193 71.5867 19.0449C73.1222 18.7705 74.7137 18.9113 76.1601 19.4496C77.6065 19.9878 78.8427 20.8992 79.7125 22.0686C80.5822 23.2380 81.0465 24.6129 81.0465 26.0193C81.0456 27.9050 80.2114 29.7133 78.7271 31.0467C77.2429 32.3801 75.23 33.1296 73.131 33.1304Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {loading && <p className="text-center text-gray-500">Chargement...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && subscriptions.length > 0 && (
            <div className="bg-white p-4 rounded-[15px] border-[1px] border-[#C4C4C4] shadow-md">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-6 px-6">Type</th>
                    <th className="py-6 px-6">Nom/Entreprise</th>
                    <th className="py-6 px-6">Email</th>
                    {/* <th className="py-6 px-6">Type d’abonnement</th> */}
                    <th className="py-6 px-6">Date de début</th>
                    <th className="py-6 px-6">Date d’expiration</th>
                    <th className="py-6 px-6">Statut</th>
                    <th className="py-6 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription) => (
                    <tr
                      key={subscription.type === "candidate" ? `${subscription.firstName}-${subscription.lastName}` : subscription.companyName}
                      className="border-b text-[#4C4C4C] border-gray-200 odd:bg-white even:bg-[#F6F6F6]"
                    >
                      <td className="py-6 px-6">{subscription.type === "candidate" ? "Candidat" : "Employeur"}</td>
                      <td className="py-6 px-6">
                        {subscription.type === "candidate"
                          ? `${subscription.firstName || "N/A"} ${subscription.lastName || ""}`
                          : subscription.companyName || "N/A"}
                      </td>
                      <td className="py-6 px-6">{subscription.email || "N/A"}</td>
                      {/* <td className="py-6 px-6">{subscription.plan}</td> */}
                      <td className="py-6 px-6">
                        {subscription.startDate
                          ? new Date(subscription.startDate).toLocaleDateString("fr-FR")
                          : "N/A"}
                      </td>
                      <td className="py-6 px-6">
                        {subscription.endDate
                          ? new Date(subscription.endDate).toLocaleDateString("fr-FR")
                          : "N/A"}
                      </td>
                      <td className="py-6 px-6 text-[#2A9D8F]">
                        {subscription.isTrial ? (
                          <div className="flex items-center gap-2">
                            <svg
                              width="25"
                              height="27"
                              viewBox="0 0 25 27"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.60832 26.01H0V24.5703H9.74329C9.5312 25.0331 9.48621 25.5344 9.60832 26.01Z"
                                fill="#EDC12E"
                              />
                              <path
                                d="M10.3927 24.7186C10.1228 25.1814 10.1164 25.7148 10.3606 26.184C10.3735 26.2032 10.3799 26.2225 10.3927 26.2418C10.6691 26.7238 11.1511 27.0002 11.7103 27.0002H23.3045C23.8637 27.0002 24.3393 26.7238 24.6221 26.2418C24.8984 25.7598 24.8984 25.2071 24.6221 24.725L19.6604 16.1322L18.8249 14.6861C18.5486 14.2041 18.0665 13.9277 17.5074 13.9277C16.9483 13.9277 16.4727 14.2041 16.1899 14.6861L10.3927 24.7186ZM16.8004 18.1245H18.2144L18.5164 22.5977H16.4919L16.8004 18.1245ZM18.5421 25.4577H16.4727V23.941H18.5421V25.4577Z"
                                fill="#EDC12E"
                              />
                              <path d="M0 0H21.2861V1.43964H0V0Z" fill="#EDC12E" />
                              <path
                                d="M19.6211 14.7749L20.2638 15.8868V2.0752H19.6211V14.7749Z"
                                fill="#EDC12E"
                              />
                              <path
                                d="M15.2015 5.48243C15.1436 6.69713 13.7554 8.03394 12.9392 8.72805C12.4764 9.11367 11.6152 9.88491 10.9725 10.8232V15.1807C11.6217 16.1191 12.4764 16.8903 12.9392 17.2759C13.1127 17.4237 13.3505 17.6294 13.6076 17.8801L13.2734 18.4585L12.1615 20.3737L11.7888 21.0164H6.42223C6.25513 21.0164 6.12017 20.8879 6.10089 20.7272C6.09446 20.6629 6.09446 20.5922 6.09446 20.528C6.1523 19.3133 7.5341 17.9765 8.35675 17.2823C8.81949 16.8967 9.68071 16.1255 10.3234 15.1872V10.8361C9.68071 9.89776 8.81949 9.12652 8.35675 8.74091C7.5341 8.04679 6.1523 6.70998 6.09446 5.49529C6.08803 5.43102 6.09446 5.36032 6.10089 5.29605C6.11374 5.12895 6.25513 5.00684 6.42223 5.00684H14.8737C15.0408 5.00684 15.1758 5.13538 15.1951 5.29605C15.2015 5.35389 15.2015 5.41816 15.2015 5.48243Z"
                                fill="#EDC12E"
                              />
                              <path
                                d="M11.9281 13.001C11.9281 13.9201 13.477 15.4112 14.0747 15.906C14.2226 16.0346 14.3704 16.1631 14.5118 16.2917L14.184 16.8637C14.0169 16.703 13.8434 16.5487 13.6634 16.3945C13.4256 16.1952 11.2854 14.3828 11.2854 13.001C11.2854 11.6192 13.4192 9.80684 13.6634 9.60118C15.3794 8.1294 16.3049 6.68976 16.3242 5.43007C16.337 4.58171 15.9514 4.04185 15.7779 3.84904H5.50759C5.33406 4.04185 4.94844 4.58171 4.96129 5.43007C4.98057 6.68976 5.90606 8.13583 7.62849 9.60118C7.86628 9.80041 10.0065 11.6128 10.0065 12.9946C10.0065 14.3764 7.87271 16.1888 7.62849 16.3945C5.91248 17.8663 4.987 19.3059 4.96772 20.5656C4.95487 21.4139 5.34048 21.9538 5.51401 22.1466H11.1312L10.7584 22.7893L10.1093 23.9205H5.05127V22.6029C4.8199 22.3459 4.30574 21.6517 4.3186 20.5784C4.33788 19.1002 5.30835 17.5321 7.21073 15.906C7.81487 15.4047 9.36377 13.9201 9.36377 13.001C9.36377 12.082 7.81487 10.5909 7.21716 10.0961C5.31478 8.47003 4.33788 6.89542 4.32502 5.42365C4.31217 4.34392 4.82633 3.65623 5.0577 3.39915V2.0752H16.2471V3.39915C16.4784 3.65623 16.9926 4.35034 16.9797 5.42365C16.9604 6.90185 15.99 8.47003 14.0876 10.0961C13.4835 10.5974 11.9281 12.082 11.9281 13.001Z"
                                fill="#EDC12E"
                              />
                              <path
                                d="M1.0293 2.0752H1.67199V23.9269H1.0293V2.0752Z"
                                fill="#EDC12E"
                              />
                            </svg>
                            En essai
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600">
                            <svg
                              width="18"
                              height="19"
                              viewBox="0 0 28 29"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_63_3918)">
                                <path
                                  d="M28 14.4125C28 22.0394 21.7319 28.222 14 28.222C6.26801 28.222 0 22.0394 0 14.4125C0 6.78577 6.26801 0.603027 14 0.603027C21.7319 0.603027 28 6.78577 28 14.4125Z"
                                  fill="#F6F6F6"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M14 26.1506C20.5722 26.1506 25.9 20.8953 25.9 14.4125C25.9 7.92978 20.5722 2.67445 14 2.67445C7.42781 2.67445 2.1 7.92978 2.1 14.4125C2.1 20.8953 7.42781 26.1506 14 26.1506ZM14 28.222C21.7319 28.222 28 22.0394 28 14.4125C28 6.78577 21.7319 0.603027 14 0.603027C6.26801 0.603027 0 6.78577 0 14.4125C0 22.0394 6.26801 28.222 14 28.222Z"
                                  fill="#2A9D8F"
                                />
                                <path
                                  d="M9.84324 15.0613L11.5548 16.7497C12.8932 13.9729 14.4449 12.1785 15.7593 11.044C16.5204 10.3872 17.1959 9.95673 17.6948 9.68604C17.9442 9.55076 18.1491 9.4555 18.2986 9.39185C18.3733 9.36003 18.434 9.33612 18.4795 9.31905C18.5023 9.31051 18.5212 9.30369 18.5362 9.29844L18.5555 9.29175L18.563 9.28926L18.566 9.28822L18.5687 9.28731C19.1189 9.10644 19.7135 9.39971 19.8969 9.94237C20.0794 10.4824 19.785 11.0662 19.24 11.2501L19.2263 11.2551C19.2089 11.2616 19.1767 11.2741 19.1311 11.2936C19.0399 11.3324 18.8949 11.399 18.7067 11.501C18.3307 11.7051 17.7812 12.0514 17.1422 12.6029C15.8687 13.7021 14.215 15.6376 12.8757 18.9403C12.7446 19.2634 12.4576 19.5001 12.1119 19.5701C11.7662 19.6402 11.4079 19.5341 11.1583 19.288L8.35832 16.5261C7.94827 16.1216 7.94827 15.4658 8.35832 15.0613C8.76836 14.6569 9.43319 14.6569 9.84324 15.0613Z"
                                  fill="#2A9D8F"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_63_3918">
                                  <rect width="28" height="29" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                            Actif
                          </div>
                        )}
                      </td>
                      <td className="py-6 px-6 flex space-x-2">
                        {subscription.isTrial && (
                          <button
                            onClick={() => handleMarkAsPaid(subscription.type === "employer" ? subscription.employerId?.toString() || "" : "")}
                            className="bg-[#4DD5FF] flex items-center gap-1 text-white px-2 py-1 rounded-md"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z"
                                fill="white"
                              />
                            </svg>
                            Marquer comme payé
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}