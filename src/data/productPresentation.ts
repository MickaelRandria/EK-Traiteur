/** Titres courts pour la collection ; le catalogue conserve les noms complets. */
export const PRODUCT_PRESENTATION: Record<string, { title: string; note: string; tone: string }> = {
  'bao-poulet': { title: 'Le bao laqué', note: 'Moelleux, croquant, juste irrésistible.', tone: 'peach' },
  'poulet-dynamite': { title: 'Le poulet dynamite', note: 'Une bouchée croustillante, un caractère bien à lui.', tone: 'cream' },
  'plateau-signature': { title: 'Les pièces signature', note: 'Navettes, wraps et briochettes à partager.', tone: 'sage' },
  'verrine-graines-germees': { title: 'La verrine fraîcheur', note: 'De la douceur, des pousses, de la fraîcheur.', tone: 'cream' },
  'mignardises-sucrees': { title: 'L’instant sucré', note: 'Caramel, spéculoos et petites douceurs.', tone: 'peach' },
  'number-cake': { title: 'Le gâteau de vos moments', note: 'Une création sur mesure pour marquer l’occasion.', tone: 'sage' },
};

export const presentationFor = (item: { id: string; name: string; description: string }) =>
  PRODUCT_PRESENTATION[item.id] ?? { title: item.name, note: item.description, tone: 'cream' };
