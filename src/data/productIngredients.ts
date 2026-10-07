export interface IngredientPart {
  id: string;
  title: string;
  note: string;
  x: number;
  y: number;
  width: number;
  angle: number;
  labelX: number;
  labelY: number;
  side: 'left' | 'right';
  anchorX: number;
  anchorY: number;
}

export interface ExplodedRecipe {
  resetLabel: string;
  parts: IngredientPart[];
}

type IngredientCopy = { id: string; title: string; note: string; width: number };

// Each element has its own space and a persistent caption, as on the bao.
function recipe(resetLabel: string, ingredients: IngredientCopy[]): ExplodedRecipe {
  const rows = ingredients.length === 4 ? [20, 43, 66, 85] : [18, 36, 54, 71, 87];
  const labels = ingredients.length === 4 ? [6, 31, 56, 79] : [4, 23, 43, 62, 80];
  return { resetLabel, parts: ingredients.map((ingredient, index) => {
    const side = index % 2 === 0 ? 'left' : 'right';
    const x = side === 'left' ? 43 : 55;
    return {
      ...ingredient, x, y: rows[index], angle: side === 'left' ? -7 : 7,
      labelX: side === 'left' ? 0 : 73, labelY: labels[index], side,
      anchorX: side === 'left' ? x - 4 : x + 4, anchorY: rows[index],
    };
  }) };
}

export const EXPLODED_RECIPES: Record<string, ExplodedRecipe> = {
  'bao-poulet': {
    resetLabel: 'Réassembler le bao',
    parts: [
      { id: 'bao', title: 'Bao vapeur', note: 'Artisanal, ultra-moelleux', x: 42, y: 22, width: 38, angle: -8, labelX: 0, labelY: 5, side: 'left', anchorX: 38, anchorY: 20 },
      { id: 'poulet', title: 'Poulet fermier', note: 'Croustillant & laqué', x: 54, y: 42, width: 39, angle: 6, labelX: 73, labelY: 29, side: 'right', anchorX: 62, anchorY: 40 },
      { id: 'concombre', title: 'Concombre frais', note: 'Tout en fraîcheur', x: 41, y: 59, width: 28, angle: -12, labelX: 0, labelY: 48, side: 'left', anchorX: 37, anchorY: 58 },
      { id: 'carottes', title: 'Carottes marinées', note: 'Croquantes', x: 54, y: 72, width: 29, angle: 8, labelX: 73, labelY: 65, side: 'right', anchorX: 60, anchorY: 73 },
      { id: 'sauce', title: 'Sauce laquée', note: 'Le secret du chef', x: 38, y: 85, width: 20, angle: -8, labelX: 0, labelY: 80, side: 'left', anchorX: 34, anchorY: 86 },
      { id: 'buns', title: 'Mini buns briochés', note: 'Dorés au four · à côté', x: 82, y: 80, width: 23, angle: 0, labelX: 68, labelY: 88, side: 'right', anchorX: 82, anchorY: 81 },
    ],
  },
  'poulet-dynamite': recipe('Réassembler la barquette', [
    { id: 'volaille', title: 'Volaille française', note: 'Aiguillettes croustillantes', width: 36 },
    { id: 'sauce', title: 'Sauce dynamite', note: 'Onctueuse & relevée', width: 24 },
    { id: 'sesame', title: 'Sésame doré', note: 'Graines torréfiées', width: 23 },
    { id: 'pousses', title: 'Jeunes pousses', note: 'Tout en fraîcheur', width: 27 },
    { id: 'barquette', title: 'Barquette en bambou', note: 'Un écrin écologique', width: 29 },
  ]),
  'plateau-signature': recipe('Recomposer le plateau', [
    { id: 'navette', title: 'Navettes briochées', note: 'Dorées au sésame', width: 32 },
    { id: 'wrap', title: 'Mini wraps', note: 'Croustillants & assortis', width: 29 },
    { id: 'briochettes', title: 'Briochettes salées', note: 'Garnies du chef', width: 34 },
    { id: 'mousseline', title: 'Mousselines', note: 'Tartinables artisanaux', width: 24 },
  ]),
  'verrine-graines-germees': recipe('Réassembler la verrine', [
    { id: 'veloute', title: 'Velouté crémeux', note: 'Fraîcheur maison', width: 31 },
    { id: 'graines', title: 'Graines germées', note: 'Bio & croquantes', width: 32 },
    { id: 'burger', title: 'Mini burgers', note: 'Briochés, snackés minute', width: 31 },
    { id: 'huile', title: 'Huile d’herbes', note: 'Fraîches & infusées', width: 25 },
  ]),
  'mignardises-sucrees': recipe('Recomposer le duo', [
    { id: 'sable', title: 'Pâte sablée', note: 'Artisanale, pur beurre', width: 33 },
    { id: 'fruits', title: 'Fruits de saison', note: 'Rouges & exotiques', width: 29 },
    { id: 'mascarpone', title: 'Mascarpone', note: 'Une crème onctueuse', width: 26 },
    { id: 'caramel', title: 'Coulis de caramel', note: 'Au beurre salé', width: 24 },
    { id: 'speculoos', title: 'Spéculoos', note: 'Éclats croustillants', width: 27 },
  ]),
  'number-cake': recipe('Réassembler le gâteau', [
    { id: 'sable', title: 'Sablé amande', note: 'Croustillant, au chiffre choisi', width: 27 },
    { id: 'ganache', title: 'Ganache montée', note: 'Vanille de Madagascar', width: 28 },
    { id: 'fruits', title: 'Fruits rouges', note: 'Fraises, framboises, myrtilles & mûres', width: 29 },
    { id: 'macarons', title: 'Macarons', note: 'Artisanaux & assortis', width: 29 },
    { id: 'fleurs', title: 'Fleurs comestibles', note: 'Bio & décors dorés', width: 27 },
  ]),
};
