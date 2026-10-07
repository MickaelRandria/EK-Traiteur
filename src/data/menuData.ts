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
    image: 'https://i.imgur.com/JqqBPoX.jpg',
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
    image: 'https://i.imgur.com/k2bK8fh.jpg',
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
    image: 'https://i.imgur.com/jkmR9kD.jpg',
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
    image: 'https://i.imgur.com/yDh2laF.jpg',
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
    image: 'https://i.imgur.com/KgBxFZ4.jpg',
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
    price: 3.50,
    description: 'Pâte sablée croustillante, ganache montée vanille onctueuse, parterre de fruits rouges frais, macarons et fleurs comestibles.',
    badges: ['Sur Devis', 'Événementiel', 'Pièce Unique'],
    image: 'https://i.imgur.com/Rmao4fN.jpg',
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
  { id: 'all', label: 'Tout le Catalogue' },
  { id: 'gourmet', label: 'Gourmet & Créations' },
  { id: 'classique', label: 'Plateaux Salés' },
  { id: 'verrines', label: 'Verrines Traiteur' },
];

