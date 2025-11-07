import { supabase } from "../../../lib/supabaseClient";
import LieuxClient from "../../lieux/LieuxClient";
import LieuCard from "../../components/LieuCard";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 0;

/* ============================================================
   🖼️ IMAGES PAR CATÉGORIE
   ============================================================ */
const categories = [
  { name: "Plages", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761918619/Plages_co%CC%82te_basque_hczizy.jpg" },
  { name: "Restaurants", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761918620/Restaurants_co%CC%82te_basque_bf6zir.jpg" },
  { name: "Randonnées", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761918620/Randonne%CC%81es_co%CC%82te_basque_gffivs.jpg" },
  { name: "Villages", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761918620/Villages_co%CC%82te_basque_gsu6gp.jpg" },
  { name: "Hébergements", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761918619/Hebergements_co%CC%82te_basque_ioz58z.jpg" },
  { name: "Culture & traditions", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761918619/Cultures_et_tradition_co%CC%82te_basque_czpj9h.jpg" },
  { name: "Activités", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761941411/activite%CC%81s_co%CC%82te_basque_dee5qx.jpg" },
  { name: "Activités enfants", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761941733/activite%CC%81s_enfants_co%CC%82te_basque_wutbh4.jpg" },
  { name: "Brunch", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761942132/Brunch_co%CC%82te_basque_mgcedp.jpg" },
];

/* ============================================================
   🧭 TEXTES SEO PAR CATÉGORIE
   ============================================================ */
export const categorySEO: Record<
  string,
  { intro: string; paragraph1: string; paragraph2: string; paragraph3?: string }
> = {
   /* ============================================================
     🏖️ PLAGES
  ============================================================ */
  "Plages": {
    intro:
      "Des plages mythiques de Biarritz aux criques préservées d’Hendaye, le littoral basque est un joyau naturel entre océan et falaises.",
    paragraph1: `
      <h2>Les plus belles plages du Pays Basque : entre océan et falaises</h2>
      <p>
        De Biarritz à Hendaye, le littoral basque offre une mosaïque de paysages à couper le souffle.
        Ici, les <strong>plages du Pays Basque</strong> alternent entre criques sauvages, longues bandes
        de sable doré et falaises plongeant dans l’océan Atlantique.
      </p>
      <h3>Des plages mythiques à Biarritz et Anglet</h3>
      <p>
        C’est à <a href="/lieu/plage-de-la-cote-des-basques" class="text-red-600 underline">la Côte des Basques</a> que le surf basque est né.
        Cette plage emblématique attire les surfeurs du monde entier et offre une vue imprenable sur les montagnes.
      </p>
    `,
    paragraph2: `
      <h3>Des coins paisibles pour les familles</h3>
      <p>
        À <strong>Saint-Jean-de-Luz</strong> ou <strong>Hendaye</strong>, la mer est plus calme et adaptée aux enfants.
        <a href="/lieu/bidart" class="text-red-600 underline">Bidart</a> et <a href="/lieu/guethary" class="text-red-600 underline">Guéthary</a> séduisent par leur authenticité et leur charme.
      </p>
      <h3>Entre culture, gastronomie et nature</h3>
      <p>
        Après la plage, on partage des <em>chipirons</em>, un <em>verre d’Irouléguy</em> ou des <em>pintxos</em> face à l’océan.
        Chaque village côtier raconte un pan de la culture basque.
      </p>
    `,
    paragraph3: `
      <div id="hidden-text" class="max-h-0 overflow-hidden transition-all duration-700 ease-in-out">
        <h3>Des spots de surf incontournables</h3>
        <p>
          Parlementia, Lafitenia, Marbella ou la Grande Plage sont les hauts lieux du surf basque.
        </p>
        <h3>Conseils pratiques</h3>
        <ul class="list-disc list-inside mb-4">
          <li>Privilégiez les plages surveillées</li>
          <li>Explorez la corniche d’Urrugne</li>
          <li>Protégez-vous du vent atlantique</li>
        </ul>
        <h3>Une expérience à vivre toute l’année</h3>
        <p>
          Été festif, automne pour le surf, hiver vivifiant : la côte basque se vit à chaque saison.
        </p>
      </div>
      <button 
        id="toggle-btn"
        onclick="
          const hidden=document.getElementById('hidden-text');
          const btn=document.getElementById('toggle-btn');
          if(hidden.classList.contains('max-h-0')){
            hidden.classList.remove('max-h-0');hidden.classList.add('max-h-[4000px]');btn.innerText='Voir moins';
          }else{
            hidden.classList.add('max-h-0');hidden.classList.remove('max-h-[4000px]');btn.innerText='Lire la suite';
          }"
        class="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-full text-red-700 font-medium transition"
      >Lire la suite</button>
    `,
  },

  /* ============================================================
     🥾 RANDONNÉES
  ============================================================ */
  "Randonnées": {
    intro:
      "Entre océan, collines et montagnes, le Pays Basque est un paradis pour les amoureux de nature et de marche.",
    paragraph1: `
      <h2>Les plus belles randonnées du Pays Basque</h2>
      <p>
        Le territoire basque regorge de <strong>sentiers panoramiques</strong> entre mer et montagnes.
        Les randonneurs profitent d’une nature préservée, de crêtes verdoyantes et de vues à couper le souffle.
      </p>
      <h3>La Rhune, le symbole du Pays Basque</h3>
      <p>
        Accessible à pied ou en train à crémaillère, <a href="/lieu/la-rhune" class="text-red-600 underline">la Rhune</a> offre un panorama unique sur l’océan et les Pyrénées.
      </p>
    `,
    paragraph2: `
      <h3>Des itinéraires pour tous les niveaux</h3>
      <p>
        Des crêtes d’Iparla au sentier du littoral entre Bidart et Hendaye, chaque marche raconte une histoire différente.
      </p>
      <h3>Entre culture et nature</h3>
      <p>
        Les <em>pottoks</em>, les bergeries et les chapelles perchées ponctuent les chemins, rappelant l’identité pastorale du Pays Basque.
      </p>
    `,
    paragraph3: `
      <div id="hidden-text" class="max-h-0 overflow-hidden transition-all duration-700 ease-in-out">
        <h3>Randonnées incontournables</h3>
        <ul class="list-disc list-inside mb-4">
          <li>Les crêtes d’Iparla</li>
          <li>Le col d’Ibardin</li>
          <li>Le pic d’Orhy</li>
          <li>Le sentier du littoral</li>
        </ul>
        <p>
          Quelle que soit la saison, les randonnées du Pays Basque offrent calme, déconnexion et vues époustouflantes.
        </p>
      </div>
      <button id="toggle-btn" onclick="
        const h=document.getElementById('hidden-text');
        const b=document.getElementById('toggle-btn');
        if(h.classList.contains('max-h-0')){h.classList.remove('max-h-0');h.classList.add('max-h-[4000px]');b.innerText='Voir moins';}
        else{h.classList.add('max-h-0');h.classList.remove('max-h-[4000px]');b.innerText='Lire la suite';}"
        class="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-full text-red-700 font-medium transition"
      >Lire la suite</button>
    `,
  },

  /* ============================================================
     🏘️ VILLAGES
  ============================================================ */
  "Villages": {
    intro:
      "Entre montagnes et océan, les villages du Pays Basque incarnent l’âme d’un territoire fier, chaleureux et authentique.",
    paragraph1: `
      <h2>Les plus beaux villages du Pays Basque</h2>
      <p>
        <strong>Espelette</strong>, <strong>Ainhoa</strong>, <strong>Sare</strong> ou <strong>La Bastide-Clairence</strong> font partie des plus beaux villages de France.
      </p>
      <h3>Un patrimoine vivant</h3>
      <p>
        Maisons à colombages, frontons, places fleuries : chaque village exprime la convivialité et l’histoire basque.
      </p>
    `,
    paragraph2: `
      <h3>Traditions et artisanat</h3>
      <p>
        Découvrez les marchés, les producteurs de fromage et les ateliers d’artisans dans les ruelles pittoresques.
      </p>
      <p>
        À <a href="/lieu/espelette" class="text-red-600 underline">Espelette</a>, le piment est roi, tandis qu’à <a href="/lieu/ainhoa" class="text-red-600 underline">Ainhoa</a>, on savoure la quiétude du terroir.
      </p>
    `,
    paragraph3: `
      <div id="hidden-text" class="max-h-0 overflow-hidden transition-all duration-700 ease-in-out">
        <h3>Villages à explorer</h3>
        <ul class="list-disc list-inside">
          <li>Sare et ses grottes préhistoriques</li>
          <li>La Bastide-Clairence, joyau d’architecture</li>
          <li>Itxassou et la vallée de la Nive</li>
        </ul>
        <p>
          Chaque halte est une rencontre : sourires, accents, senteurs et authenticité.
        </p>
      </div>
      <button id="toggle-btn" onclick="
        const h=document.getElementById('hidden-text');
        const b=document.getElementById('toggle-btn');
        if(h.classList.contains('max-h-0')){h.classList.remove('max-h-0');h.classList.add('max-h-[4000px]');b.innerText='Voir moins';}
        else{h.classList.add('max-h-0');h.classList.remove('max-h-[4000px]');b.innerText='Lire la suite';}"
        class="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-full text-red-700 font-medium transition"
      >Lire la suite</button>
    `,
  },

  /* ============================================================
     🍽️ RESTAURANTS
  ============================================================ */
  "Restaurants": {
    intro:
      "Le Pays Basque est une terre de saveurs : entre mer et montagne, la gastronomie y est aussi généreuse que raffinée.",
    paragraph1: `
      <h2>Restaurants et gastronomie basque</h2>
      <p>
        Des auberges familiales aux tables étoilées, le <strong>Pays Basque</strong> offre une cuisine sincère et savoureuse.
      </p>
      <h3>Des spécialités incontournables</h3>
      <p>
        <em>Axoa d’Espelette</em>, <em>chipirons</em>, <em>fromage de brebis</em> ou <em>gâteau basque</em> : chaque plat est un hommage à la région.
      </p>
    `,
    paragraph2: `
      <h3>Les adresses à ne pas manquer</h3>
      <p>
        À Biarritz ou Bayonne, on savoure des <em>pintxos</em> inspirés de la culture espagnole.
        À Saint-Jean-de-Luz, les poissonneries locales servent des produits d’une fraîcheur exceptionnelle.
      </p>
    `,
    paragraph3: `
      <div id="hidden-text" class="max-h-0 overflow-hidden transition-all duration-700 ease-in-out">
        <h3>Où manger selon vos envies</h3>
        <ul class="list-disc list-inside mb-4">
          <li>Bistrots de pêcheurs à Guéthary</li>
          <li>Restaurants gastronomiques à Arcangues</li>
          <li>Tavernes traditionnelles à Itxassou</li>
        </ul>
        <p>
          La cuisine basque est avant tout un moment de partage : un art de vivre.
        </p>
      </div>
      <button id="toggle-btn" onclick="
        const h=document.getElementById('hidden-text');
        const b=document.getElementById('toggle-btn');
        if(h.classList.contains('max-h-0')){h.classList.remove('max-h-0');h.classList.add('max-h-[4000px]');b.innerText='Voir moins';}
        else{h.classList.add('max-h-0');h.classList.remove('max-h-[4000px]');b.innerText='Lire la suite';}"
        class="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-full text-red-700 font-medium transition"
      >Lire la suite</button>
    `,
  },

  /* ============================================================
     🛏️ HÉBERGEMENTS
  ============================================================ */
  "Hébergements": {
    intro:
      "Dormir au Pays Basque, c’est s’offrir un moment suspendu entre mer et montagne.",
    paragraph1: `
      <h2>Les plus beaux hébergements du Pays Basque</h2>
      <p>
        De la maison d’hôtes au boutique-hôtel, chaque adresse incarne l’art de vivre basque.
      </p>
      <h3>Entre charme et authenticité</h3>
      <p>
        À <a href="/lieu/espelette" class="text-red-600 underline">Espelette</a> ou <a href="/lieu/saint-jean-de-luz" class="text-red-600 underline">Saint-Jean-de-Luz</a>,
        profitez d’un confort paisible et d’une hospitalité sincère.
      </p>
    `,
    paragraph2: `
      <h3>Des cadres d’exception</h3>
      <p>
        Vue mer, montagnes ou forêt : les hébergements basques s’adaptent à toutes les envies.
      </p>
    `,
    paragraph3: `
      <div id="hidden-text" class="max-h-0 overflow-hidden transition-all duration-700 ease-in-out">
        <h3>Conseils pour un séjour réussi</h3>
        <ul class="list-disc list-inside mb-4">
          <li>Réserver tôt en été</li>
          <li>Découvrir les gîtes ruraux à l’intérieur des terres</li>
          <li>Opter pour les hôtels avec table d’hôtes</li>
        </ul>
      </div>
      <button id="toggle-btn" onclick="
        const h=document.getElementById('hidden-text');
        const b=document.getElementById('toggle-btn');
        if(h.classList.contains('max-h-0')){h.classList.remove('max-h-0');h.classList.add('max-h-[4000px]');b.innerText='Voir moins';}
        else{h.classList.add('max-h-0');h.classList.remove('max-h-[4000px]');b.innerText='Lire la suite';}"
        class="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-full text-red-700 font-medium transition"
      >Lire la suite</button>
    `,
  },

  /* ============================================================
     🎭 CULTURE & TRADITIONS
  ============================================================ */
  "Culture & traditions": {
    intro:
      "Le Pays Basque, c’est une culture vivante et une identité forte.",
    paragraph1: `
      <h2>Culture et traditions basques</h2>
      <p>
        Fêtes, musique, pelote basque, danses et chants polyphoniques rythment la vie quotidienne.
      </p>
      <h3>Un patrimoine immatériel unique</h3>
      <p>
        Les <a href="/lieu/fetes-de-bayonne" class="text-red-600 underline">fêtes de Bayonne</a> en sont l’emblème.
      </p>
    `,
    paragraph2: `
      <h3>Transmission et authenticité</h3>
      <p>
        De village en village, les traditions sont transmises avec passion et respect.
      </p>
    `,
    paragraph3: `
      <div id="hidden-text" class="max-h-0 overflow-hidden transition-all duration-700 ease-in-out">
        <h3>À découvrir absolument</h3>
        <ul class="list-disc list-inside mb-4">
          <li>La pelote basque</li>
          <li>Les chants et danses traditionnelles</li>
          <li>Les fêtes patronales</li>
        </ul>
      </div>
      <button id="toggle-btn" onclick="
        const h=document.getElementById('hidden-text');
        const b=document.getElementById('toggle-btn');
        if(h.classList.contains('max-h-0')){h.classList.remove('max-h-0');h.classList.add('max-h-[4000px]');b.innerText='Voir moins';}
        else{h.classList.add('max-h-0');h.classList.remove('max-h-[4000px]');b.innerText='Lire la suite';}"
        class="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-full text-red-700 font-medium transition"
      >Lire la suite</button>
    `,
  },

  /* ============================================================
     👨‍👩‍👧 ACTIVITÉS ENFANTS
  ============================================================ */
  "Activités enfants": {
    intro:
      "En famille, le Pays Basque regorge d’activités pour petits et grands.",
    paragraph1: `
      <h2>Les meilleures activités enfants au Pays Basque</h2>
      <p>
        Plages familiales, parcs animaliers, musées interactifs et randonnées faciles : tout pour s’amuser.
      </p>
      <h3>Des expériences ludiques et éducatives</h3>
      <p>
        Balades à pottoks, fermes pédagogiques et descentes en pirogue raviront les enfants.
      </p>
    `,
    paragraph2: `
      <h3>Une destination nature et famille</h3>
      <p>
        De <strong>Biarritz</strong> à <strong>Saint-Pée-sur-Nivelle</strong>, les activités sont nombreuses et sécurisées.
      </p>
    `,
    paragraph3: `
      <div id="hidden-text" class="max-h-0 overflow-hidden transition-all duration-700 ease-in-out">
        <h3>À ne pas manquer</h3>
        <ul class="list-disc list-inside mb-4">
          <li>Le parc animalier d’Etxola</li>
          <li>Le petit train de la Rhune</li>
          <li>Les grottes de Sare</li>
        </ul>
      </div>
      <button id="toggle-btn" onclick="
        const h=document.getElementById('hidden-text');
        const b=document.getElementById('toggle-btn');
        if(h.classList.contains('max-h-0')){h.classList.remove('max-h-0');h.classList.add('max-h-[4000px]');b.innerText='Voir moins';}
        else{h.classList.add('max-h-0');h.classList.remove('max-h-[4000px]');b.innerText='Lire la suite';}"
        class="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-full text-red-700 font-medium transition"
      >Lire la suite</button>
    `,
  },

  /* ============================================================
     🥞 BRUNCH
  ============================================================ */
  "Brunch": {
    intro:
      "Entre océan et montagne, le brunch est devenu un rituel gourmand incontournable du Pays Basque.",
    paragraph1: `
      <h2>Les meilleurs brunchs du Pays Basque</h2>
      <p>
        Des adresses confidentielles aux terrasses branchées, chaque brunch célèbre la générosité locale.
      </p>
      <h3>Des produits frais et locaux</h3>
      <p>
        Œufs brouillés, fromage de brebis, confiture de cerise noire et café torréfié à <strong>Bayonne</strong>.
      </p>
    `,
    paragraph2: `
      <h3>Une ambiance conviviale</h3>
      <p>
        À <strong>Biarritz</strong>, <strong>Guéthary</strong> ou <strong>Saint-Jean-de-Luz</strong>,
        les brunchs se savourent face à l’océan.
      </p>
    `,
    paragraph3: `
      <div id="hidden-text" class="max-h-0 overflow-hidden transition-all duration-700 ease-in-out">
        <h3>Adresses à tester</h3>
        <ul class="list-disc list-inside mb-4">
          <li>Brunch La Plancha à Biarritz</li>
          <li>Café Basoa à Guéthary</li>
          <li>Chez Mima à Saint-Jean-de-Luz</li>
        </ul>
        <p>
          Entre modernité et terroir, le brunch basque conjugue plaisir, détente et authenticité.
        </p>
      </div>
      <button id="toggle-btn" onclick="
        const h=document.getElementById('hidden-text');
        const b=document.getElementById('toggle-btn');
        if(h.classList.contains('max-h-0')){h.classList.remove('max-h-0');h.classList.add('max-h-[4000px]');b.innerText='Voir moins';}
        else{h.classList.add('max-h-0');h.classList.remove('max-h-[4000px]');b.innerText='Lire la suite';}"
        class="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-full text-red-700 font-medium transition"
      >Lire la suite</button>
    `,
  },
};

/* ============================================================
   🧠 SEO DYNAMIQUE (METADATA)
   ============================================================ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  const seo = categorySEO[category] || {
    intro: `Découvrez les meilleurs ${category.toLowerCase()} du Pays Basque.`,
  };

  const categoryData = categories.find((c) => c.name === category);
  const image = categoryData?.image || "https://res.cloudinary.com/diccvjf98/image/upload/v1730364100/fallback.jpg";

  const title = `${category} au Pays Basque : les plus beaux endroits à découvrir 🇫🇷`;
  const description = seo.intro;
  const url = `https://decouvrirllepaysbasque.fr/categorie/${encodeURIComponent(category)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: `${category} au Pays Basque` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/* ============================================================
   🗺️ PAGE CATÉGORIE
   ============================================================ */
export default async function CategoriePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);

  const categoryData = categories.find((c) => c.name === category);
  const seo = categorySEO[category] || {
    intro: `Découvrez les meilleurs ${category.toLowerCase()} du Pays Basque.`,
    paragraph1: "",
    paragraph2: "",
    paragraph3: "",
  };

  const { data: lieux, error } = await supabase
    .from("lieux")
    .select("*")
    .eq("categorie", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur Supabase :", error);
    return <p>Erreur de chargement des lieux.</p>;
  }

  if (!lieux?.length) {
    return (
      <main className="p-6 text-center">
        <h1 className="text-3xl font-semibold mb-3">Catégorie introuvable</h1>
        <p className="text-gray-500">Aucun lieu trouvé pour cette catégorie.</p>
        <Link href="/" className="text-blue-600 underline mt-4 inline-block">
          Revenir à l’accueil
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-[#fafafa] text-gray-800">
      {/* === HERO === */}
      <section
        className="relative h-[280px] md:h-[400px] w-full mb-10 rounded-b-3xl overflow-hidden"
        style={{
          backgroundImage: `url(${categoryData?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-extrabold mb-4">{category}</h1>
          <p className="max-w-2xl text-center text-lg opacity-90">{seo.intro}</p>
        </div>
      </section>

      {/* === GRILLE DE LIEUX === */}
      <section className="max-w-6xl mx-auto px-6 py-8 bg-white rounded-3xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Tous les {category.toLowerCase()} à découvrir
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lieux.map((lieu) => (
           <LieuCard
           key={lieu.slug}
           lieu={{
             ...lieu,
             image_url:
               lieu.image_url ||
               lieu.image_urls?.[0] ||
               "https://res.cloudinary.com/diccvjf98/image/upload/v1730364100/fallback.jpg",
           }}
         />
         
          ))}
        </div>
      </section>

      {/* === CARTE === */}
      <section className="max-w-6xl mx-auto px-6 mt-16 mb-10 text-center">
        <h2 className="text-2xl font-semibold mb-3">🗺️ Explore-les sur la carte</h2>
        <p className="text-gray-500 mb-8">
          Visualise tous les {category.toLowerCase()} du Pays Basque directement sur la carte interactive :
        </p>
        <LieuxClient lieux={lieux} />
      </section>

      {/* === TEXTE SEO RICHE (HTML rendu, invisible visuellement) === */}
      <section
        className="max-w-4xl mx-auto px-6 py-10 text-gray-700 leading-relaxed text-justify prose prose-neutral"
        dangerouslySetInnerHTML={{
          __html: `
            <div class="sr-only">
              <h2>Pourquoi visiter ces ${category.toLowerCase()} au Pays Basque ?</h2>
            </div>
            ${seo.paragraph1 || ""}
            ${seo.paragraph2 || ""}
            ${seo.paragraph3 || ""}
          `,
        }}
      />

      {/* === JSON-LD STRUCTURÉ === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${category} au Pays Basque`,
            description: seo.intro,
            itemListElement: lieux.map((lieu, i) => ({
              "@type": "TouristAttraction",
              name: lieu.nom,
              url: `https://decouvrirllepaysbasque.fr/lieu/${lieu.slug}`,
              position: i + 1,
            })),
          }),
        }}
      />

      {/* === AUTRES CATÉGORIES === */}
      <section className="mt-16 border-t pt-10 max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Autres univers à découvrir</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/categorie/${encodeURIComponent(cat.name)}`}
              className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-sm"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
