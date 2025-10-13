# API BAN - Autocomplétion d'adresses françaises 🇫🇷

Script JavaScript pour ajouter l'autocomplétion d'adresses françaises sur votre site web via l'API de la Base Adresse Nationale (BAN).

## Installation

Ajoutez simplement cette ligne dans votre HTML :

```html
<script src="https://cdn.jsdelivr.net/npm/@nicolastizioco/scrypts@latest/src/api-ban/api-ban.js"></script>
```

### Version minifiée

```html
<script src="https://cdn.jsdelivr.net/npm/@nicolastizioco/scrypts@latest/src/api-ban/api-ban-min.js"></script>
```

## Utilisation de base

### HTML Structure

```html
<div data-ban-wrapper>
  <!-- Champ de saisie pour l'adresse -->
  <input type="text" data-ban-input placeholder="Entrez une adresse..." />

  <!-- Conteneur des résultats -->
  <div data-ban-results>
    <div data-ban-item></div>
  </div>
</div>
```

## Fonctionnalités

### Attributs disponibles

#### `data-ban-wrapper`
Conteneur principal. Valeur optionnelle : `"log"` pour activer les logs console.

```html
<div data-ban-wrapper="log">
  <!-- Active les logs de débogage -->
</div>
```

#### `data-ban-input`
Champ de saisie de l'adresse. Valeur optionnelle : `"split"` pour ne garder que la rue.

```html
<!-- Adresse complète -->
<input type="text" data-ban-input />

<!-- Uniquement la rue -->
<input type="text" data-ban-input="split" />
```

#### `data-ban-results`
Conteneur des suggestions. Valeur optionnelle : CSS box-shadow personnalisée ou `"no-css"`.

```html
<!-- Avec shadow par défaut -->
<div data-ban-results></div>

<!-- Shadow personnalisée -->
<div data-ban-results="0 4px 10px rgba(0,0,0,0.3)"></div>

<!-- Sans styles CSS automatiques -->
<div data-ban-results="no-css"></div>
```

**Attribut supplémentaire** : `data-ban-results-count` pour limiter le nombre de résultats (1-15, défaut: 5)

```html
<div data-ban-results data-ban-results-count="10"></div>
```

#### `data-ban-item`
Template pour un résultat. Valeur optionnelle : `"no-css"` pour désactiver les styles.

```html
<div data-ban-item></div>
<!-- ou -->
<div data-ban-item="no-css"></div>
```

#### `data-ban-city` et `data-ban-zipcode`
Champs optionnels pour remplir automatiquement la ville et le code postal.

```html
<input type="text" data-ban-zipcode placeholder="Code postal" />
<input type="text" data-ban-city placeholder="Ville" />
```

## Exemples complets

### Exemple simple

```html
<div data-ban-wrapper>
  <input type="text" data-ban-input placeholder="Adresse" />
  <div data-ban-results>
    <div data-ban-item></div>
  </div>
</div>
```

### Exemple avec champs séparés

```html
<div data-ban-wrapper>
  <input type="text" data-ban-input="split" placeholder="Rue" />
  <input type="text" data-ban-zipcode placeholder="Code postal" />
  <input type="text" data-ban-city placeholder="Ville" />

  <div data-ban-results data-ban-results-count="7">
    <div data-ban-item></div>
  </div>
</div>
```

### Exemple avec styles personnalisés

```html
<div data-ban-wrapper="log">
  <input type="text" data-ban-input placeholder="Adresse" />

  <div data-ban-results="no-css" class="custom-results">
    <div data-ban-item="no-css" class="custom-item"></div>
  </div>
</div>

<style>
.custom-results {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.custom-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
}
</style>
```

## Navigation au clavier

- **Flèches haut/bas** : Naviguer entre les suggestions
- **Entrée** : Sélectionner la suggestion active
- **Échap** : Fermer les suggestions

## Styles CSS par défaut

Le script injecte automatiquement des styles CSS de base. Pour les désactiver, utilisez `data-ban-results="no-css"` et `data-ban-item="no-css"`.

### Variable CSS personnalisable

```css
[data-ban-results] {
  --ban-box-shadow: 0 2px 5px 0 rgba(0,0,0,0.2);
}
```

## API Utilisée

Ce script utilise l'API de géocodage de la Base Adresse Nationale :
- Endpoint : `https://data.geopf.fr/geocodage/completion/`
- Type : `StreetAddress`
- Gratuit et sans clé API

## Compatibilité

- Navigateurs modernes (ES6+)
- Compatible Webflow, WordPress, sites statiques, etc.

## Auteur

Made by [nicolastizio.co](https://nicolastizio.co)

## YAML Completion

Un fichier `completion.yaml` est disponible pour l'autocomplétion dans les éditeurs de code qui supportent les attributs HTML personnalisés.
