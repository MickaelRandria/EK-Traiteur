# Ena's Kitchen — EK Traiteur

Application (PWA) de prise de commande de pièces cocktail pour Ena's Kitchen, traiteur à Bordeaux.

## Lancer en local

Prérequis : Node.js

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de production dans dist/
npm run lint    # vérification TypeScript
```

## Fonctionnement des commandes

Il n'y a pas de backend : à la validation, l'app ouvre WhatsApp avec le récapitulatif complet de la commande
pré-rempli. La commande n'est transmise que lorsque le client envoie ce message.

## Où modifier quoi

- **Catalogue, prix, photos** : `src/data/menuData.ts` (photos dans `public/products/`).
  Une création avec `priceDisplay: 'Sur devis'` n'a ni prix ni minimum de 20 pièces.
- **Numéro WhatsApp, délai minimum avant l'événement, minimum de pièces** : constantes en haut de `src/utils/order.ts`.
- **Filtres de régime** : `DIET_FILTERS` dans `src/data/menuData.ts`. Un filtre (ou une catégorie) n'est affiché
  que si au moins une création y correspond.

Le panier, les favoris et les coordonnées du client sont mémorisés sur l'appareil (localStorage).

## Direction artistique — Atelier culinaire

L’accueil, la collection et les fiches utilisent les produits transparents sur des fonds ivoire,
sauge et abricot. Les photos originales restent visibles dans les fiches et la présentation des plateaux.
Les titres courts et les phrases de présentation se modifient dans `src/data/productPresentation.ts` ;
les noms complets, recettes, allergènes et prix restent dans le catalogue.

Les fiches inclinent uniquement le produit pendant l’interaction. Les préférences de réduction
des mouvements sont respectées et les panneaux gardent le focus clavier.

## Vérification visuelle et parcours

Avec le serveur local lancé sur le port 3001 :

```bash
npm run dev -- --port 3001
npm run verify:atelier
```

Le script vérifie le parcours de réception sur quatre tailles d’écran, puis les catégories,
favoris et filtres. Les captures sont dans `output/atelier/`. Le récapitulatif WhatsApp est
intercepté dans le navigateur de test : aucun message n’est envoyé.

Pour vérifier le fonctionnement hors ligne après compilation :

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 3002
npm run verify:pwa
```

Les scripts utilisent Chrome installé sur Windows ou le navigateur Chromium de Playwright
(`npx playwright install chromium`). `ATELIER_BROWSER` permet d’indiquer un autre exécutable,
et `ATELIER_URL` une autre URL locale. Le worker PWA est dans `src/sw.ts` ; Vite le compile
directement, ce qui évite le problème d’apostrophe dans le chemin du projet.
