"use client";

type LieuCardProps = {
  lieu: {
    id: number;
    slug?: string | null;
    nom: string;
    ville?: string | null;
    categorie?: string | null;
    description?: string | null;
    image_url?: string | null;
  };
};

export default function LieuCard({ lieu }: LieuCardProps) {
  const handleClick = () => {
    if (lieu.slug) {
      window.location.href = `/lieu/${lieu.slug}`; // ✅ slug valide
    } else {
      alert("Ce lieu n’a pas encore de lien valide (slug manquant).");
    }
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={
          lieu.image_url ||
          "https://res.cloudinary.com/diccvjf98/image/upload/v1730364100/fallback.jpg"
        }
        alt={lieu.nom}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{lieu.nom}</h3>
        <p className="text-sm text-gray-500">{lieu.ville}</p>

        {lieu.categorie && (
          <p className="mt-2 text-xs inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {lieu.categorie}
          </p>
        )}

        {lieu.description && (
          <p className="mt-3 text-sm text-gray-700 line-clamp-3">
            {lieu.description}
          </p>
        )}
      </div>
    </div>
  );
}
