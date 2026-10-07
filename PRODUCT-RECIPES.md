# Ingrédients décomposés de la carte

Les six fiches utilisent `ProductExploded` : un appui sur « Découvrir les ingrédients » décompose la création et affiche simultanément chaque nom et description. Le bouton permet ensuite de la réassembler. La présentation du bao est conservée.

Les configurations sont dans `src/data/productIngredients.ts`, à partir des recettes de `src/data/menuData.ts` : bao poulet, poulet dynamite, plateau signature, verrine aux graines germées, mignardises sucrées et Number cake. Les accompagnements et le contenant sont identifiés dans les légendes. Le Number cake conserve sa demande sur mesure.

## Visuels

Les cinq nouvelles séries sont des reconstitutions illustratives générées avec l'outil intégré `image_gen`, sur fond transparent, à partir des photographies existantes. Les images sources restent intactes.

Chaque dossier `assets/product-exploded/<identifiant>/` contient `ingredients-atlas.png` et `manifest.json`. Le manifeste conserve le prompt exact, les références utilisées et le mode de génération. Les éléments WebP utilisés par les fiches sont dans `public/products/exploded/<identifiant>/`.

Pour extraire à nouveau les éléments à partir des atlas conservés :

```sh
node scripts/prepare-recipe-exploded.cjs
```

## Vérification

Avec le serveur local sur le port 3000 et Chrome installé :

```sh
node scripts/verify-recipe-exploded.cjs
```

Le parcours vérifie les six fiches à 320, 390 et 1440 px : chargement des éléments, légendes, absence de chevauchement ou de débordement horizontal, interaction tactile et clavier, réassemblage et préférence de mouvement réduit. Les captures sont enregistrées dans `output/recipe-exploded/`.

Validation effectuée : parcours navigateur, lint et compilation de production réussis. Modifications locales, sans déploiement pour cette extension.
