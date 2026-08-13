# Stack & Heap interactif (C#)

Outil pédagogique pour visualiser **pas à pas** le fonctionnement de la **stack** et du **heap** en C#.

## Démarrer

```bash
npm install
npm run course
```

Ouvre http://127.0.0.1:4173/

Le site est aussi publié automatiquement sur GitHub Pages à chaque push sur `main` :
https://fpluquet.github.io/csharp-interactif/

> Le script `course` fait un build puis un preview. Préférez-le si le dossier parent contient `C#` : le caractère `#` casse le mode `npm run dev` de Vite sous Windows.

Sinon, en chemin sans `#` :

```bash
npm run dev
```

## Scénarios

1. Variables locales — empilement sur la stack
2. Copie de types valeur — deux cases indépendantes
3. Types référence & heap — tableaux, `List`, `string`
4. Call stack & partage — appel de méthode + mutation partagée
5. Paramètres : valeur & référence — `int` vs `ref int`
6. Appels de plusieurs fonctions — call stack + return qui remplace l’appel
7. Fonctions & variables locales — locaux liés à la frame
8. Locales & globales — `static` persistante vs locaux éphémères
9. Réaffectation de référence — partage puis `b = new …`
10. `null` & référence perdue — objet orphelin / candidat GC
11. Appels imbriqués — `f(g(x))` et retours en cascade
12. Paramètre `out` — écriture forcée chez l’appelant
13. String immuable — concaténation = nouvel objet
14. Boxing / unboxing — `object o = 5`
15. Récursion courte — `Fact(3)` multi-frames

## Contrôles

- **← / →** ou **Espace** : précédent / suivant (étapes)
- **Home** : reset
- Barre sticky : scénario précédent / liste / scénario suivant
- En fin d’étapes : bouton **Scénario suivant**
