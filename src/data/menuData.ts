import { MenuItem, CategoryType } from '../types';

/**
 * Catalogue officiel des créations artisanales Ena's Kitchen (Bordeaux)
 * Règle impérative : Minimum 20 pièces par variété (hors créations sur devis).
 */
export const MENU_DATA: MenuItem[] = [
  {
    id: 'bao-poulet',
    name: 'Bao moelleux au poulet laqué & mini buns',
    category: 'gourmet',
    categoryLabel: 'Baos & Buns Variés',
    price: 1.60,
    description: 'Pains vapeur ultra-moelleux garnis de poulet laqué croustillant, concombre frais et carottes marinées, accompagnés de mini buns dorés.',
    badges: ['Coup de Cœur', 'Gourmet', 'Fait Maison'],
    image: '/products/bao-poulet.jpg',
    cutout: '/products/cutouts/bao-poulet-isolated.webp',
    rating: 4.9,
    reviewsCount: 142,
    isTopPick: true,
    isChefCollection: true,
    ingredients: [
      'Bao vapeur artisanal ultra-moelleux',
      'Poulet fermier croustillant laqué',
      'Concombre frais & carottes marinées croquantes',
      'Mini buns briochés dorés au four',
      'Sauce laquée secrète du chef'
    ],
    allergens: ['Gluten', 'Sésame', 'Soja']
  },
  {
    id: 'poulet-dynamite',
    name: 'Barquette de poulet dynamite croustillant',
    category: 'gourmet',
    categoryLabel: 'Verrines & Bouchées Chaudes',
    price: 1.60,
    description: 'Aiguillettes de volaille laquées à la sauce dynamite maison, graines de sésame et jeunes pousses en barquette individuelle de bambou.',
    badges: ['Populaire', 'Chaud', 'Épicé Doux'],
    image: '/products/poulet-dynamite.jpg',
    cutout: '/products/cutouts/poulet-dynamite-isolated.webp',
    rating: 4.9,
    reviewsCount: 98,
    isChefCollection: true,
    ingredients: [
      'Aiguillettes de volaille française',
      'Sauce dynamite onctueuse et relevée',
      'Graines de sésame doré torréfiées',
      'Jeunes pousses fraîches',
      'Barquette écologique en bambou'
    ],
    allergens: ['Sésame', 'Œufs', 'Moutarde']
  },
  {
    id: 'plateau-signature',
    name: 'Plateau dégustation navettes, wraps & briochettes',
    category: 'classique',
    categoryLabel: 'Assortiment Traiteur',
    price: 1.50,
    description: 'Assortiment généreux de navettes briochées dorées au sésame, cornets de wraps croustillants et mini-bouchées salées du chef.',
    badges: ['Signature', 'Assortiment', 'Incontournable'],
    image: '/products/plateau-signature.jpg',
    cutout: '/products/cutouts/plateau-signature-isolated.webp',
    rating: 5.0,
    reviewsCount: 165,
    isChefCollection: true,
    ingredients: [
      'Navettes briochées dorées au sésame',
      'Mini wraps croustillants assortis',
      'Briochettes salées garnies du chef',
      'Mousselines & tartinables artisanaux'
    ],
    allergens: ['Gluten', 'Lait', 'Sésame']
  },
  {
    id: 'verrine-graines-germees',
    name: 'Verrine crémeuse aux graines germées & mini burgers',
    category: 'verrines',
    categoryLabel: 'Verrines Traiteur',
    price: 1.60,
    description: 'Velouté frais maison surmonté d\'un dôme de pousses germées croquantes, servi avec mini burgers briochés snackés minute.',
    badges: ['Fraîcheur', 'Verrine', 'Duo Créatif'],
    image: '/products/verrine-graines-germees.jpg',
    cutout: '/products/cutouts/verrine-graines-germees-isolated.webp',
    rating: 4.8,
    reviewsCount: 87,
    isChefCollection: true,
    ingredients: [
      'Velouté crémeux fraîcheur maison',
      'Graines germées croquantes bio',
      'Mini burgers briochés snackés minute',
      'Huile d\'herbes fraîches infusée'
    ],
    allergens: ['Gluten', 'Lait']
  },
  {
    id: 'mignardises-sucrees',
    name: 'Duo tartelettes fruits frais & verrines caramel spéculoos',
    category: 'gourmet',
    categoryLabel: 'Douceurs Sucrées',
    price: 1.60,
    description: 'Mini tartelettes sablées aux fruits de saison et verrines crémeuses au coulis de caramel fondant et éclats de spéculoos.',
    badges: ['Douceur', 'Pâtisserie', 'Gourmand'],
    image: '/products/mignardises-sucrees.jpg',
    cutout: '/products/cutouts/mignardises-sucrees-isolated.webp',
    isSweet: true,
    rating: 4.9,
    reviewsCount: 118,
    isChefCollection: true,
    ingredients: [
      'Pâte sablée pur beurre artisanale',
      'Fruits rouges et exotiques de saison',
      'Verrines onctueuses au mascarpone',
      'Coulis de caramel au beurre salé',
      'Éclats croustillants de spéculoos'
    ],
    allergens: ['Gluten', 'Lait', 'Œufs']
  },
  {
    id: 'number-cake',
    name: 'Number cake artisanal fruits rouges & macarons',
    category: 'gourmet',
    categoryLabel: 'Création d\'Exception',
    price: 0,
    priceDisplay: 'Sur devis',
    description: 'Pâte sablée croustillante, ganache montée vanille onctueuse, parterre de fruits rouges frais, macarons et fleurs comestibles.',
    badges: ['Sur Devis', 'Événementiel', 'Pièce Unique'],
    image: '/products/number-cake.jpg',
    cutout: '/products/cutouts/number-cake-isolated.webp',
    isSweet: true,
    rating: 5.0,
    reviewsCount: 76,
    isChefCollection: true,
    ingredients: [
      'Pâte sablée amande croustillante découpée au chiffre choisi',
      'Ganache montée vanille de Madagascar onctueuse',
      'Fraises, framboises, myrtilles et mûres fraîches',
      'Macarons artisanaux assortis',
      'Fleurs comestibles bio & décors dorés'
    ],
    allergens: ['Gluten', 'Lait', 'Œufs', 'Fruits à coque']
  }
];

export const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'all', label: 'Tout' },
  { id: 'gourmet', label: 'Gourmet & Créations' },
  { id: 'classique', label: 'Plateaux Salés' },
  { id: 'verrines', label: 'Verrines Traiteur' },
  { id: 'sucre', label: 'Douceurs Sucrées' },
  { id: 'evenementiel', label: 'Événementiel' },
  { id: 'vegetarien', label: 'Végétarien' },
];

export type DietFilter = 'all' | 'veggie' | 'fish' | 'meat';

const ingredientsMatch = (item: MenuItem, words: string[]) =>
  item.ingredients?.some((i) => words.some((w) => i.toLowerCase().includes(w))) ?? false;

/**
 * Filtres de régime. Une option n'est proposée que si au moins une création y correspond
 * (voir getAvailableDietFilters) : ajouter un badge « Végétarien » ou l'allergène « Poisson »
 * à un produit fait apparaître le filtre correspondant automatiquement.
 */
export const DIET_FILTERS: { id: DietFilter; label: string; matches: (item: MenuItem) => boolean }[] = [
  { id: 'all', label: 'Tous', matches: () => true },
  {
    id: 'veggie',
    label: '100% Végétarien',
    matches: (item) => item.category === 'vegetarien' || item.badges.includes('Végétarien'),
  },
  { id: 'fish', label: 'Poissons & Saumon', matches: (item) => item.allergens?.includes('Poisson') ?? false },
  {
    id: 'meat',
    label: 'Volaille & Viandes',
    matches: (item) => ingredientsMatch(item, ['bœuf', 'boeuf', 'poulet', 'volaille', 'canard']),
  },
];

export const getAvailableCategories = (items: MenuItem[]) =>
  CATEGORIES.filter((c) => c.id === 'all' || items.some((item) => item.category === c.id));

export const getAvailableDietFilters = (items: MenuItem[]) =>
  DIET_FILTERS.filter((d) => d.id === 'all' || items.some(d.matches));

