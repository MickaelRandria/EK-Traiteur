# Bao poulet : vue éclatée interactive

La fiche du bao remplace le diaporama 360 par une vue éclatée : clic sur le produit ou sur « Découvrir les ingrédients », dézoom du produit assemblé, apparition progressive des éléments séparés et de leurs étiquettes. Un second clic réassemble le bao. Les boutons fonctionnent au clavier et le réglage de réduction des animations est respecté.

La recette provient de `src/data/menuData.ts`, confirmée par le texte fourni par l'utilisateur. Concombre et carottes ont chacun leur visuel. Les mini buns sont présentés comme accompagnement, conformément à la description de la fiche. La recette originale est conservée.

Les visuels sont des reconstitutions générées, pas des photographies des ingrédients réels ni un modèle 3D. La sauce représente visuellement une sauce laquée sans prétendre révéler sa recette.

- Référence : `public/products/cutouts/bao-poulet-isolated.webp`.
- Génération : outil intégré `image_gen`, fond transparent.
- Source : `assets/product-exploded/bao-poulet/ingredients-atlas.png`.
- Visuels utilisés : `public/products/exploded/bao-poulet/{bao,poulet,concombre,carottes,sauce,buns}.webp`.
- Extraction des cellules et optimisation : `node scripts/prepare-bao-exploded.cjs`.
- Composant : `src/components/ui/ProductExploded.tsx`.
- Validation navigateur : `node scripts/verify-bao-exploded.cjs` (BASE_URL optionnel).

## Prompt de génération

Create ONE transparent PNG sprite atlas for an interactive exploded ingredient view of the exact chicken bao in reference. Product photography, match reference ivory bun, dark reddish-brown glossy crispy chicken, green cucumber slices, orange carrot strips, soft studio lighting and three-quarter view. Canvas square, STRICT 2 columns x 3 rows of equally sized cells. Each isolated object fits centered inside its cell with generous transparent padding; no object crosses cell boundaries. Reading order: top-left EMPTY open folded ivory steamed bao bun with absolutely no filling; top-right the isolated crispy glazed chicken portion without bun or vegetables; middle-left 3 overlapping fresh cucumber slices; middle-right small cluster of thin pickled carrot strips; bottom-left small glossy dark amber-red dollop of chef glaze sauce, no container; bottom-right two small golden baked brioche mini buns, accompanying product. All six independent cutouts, transparent background, no plate, utensils, text, lines, labels, grid, checkerboard, or cast shadow outside objects. These are actual ingredient assets for a website, not a finished diagram.
