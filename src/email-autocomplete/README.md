# Email Autocomplete - Autocomplétion d'emails

Script JavaScript pour ajouter l'autocomplétion d'adresses email sur votre site web avec suggestions de domaines populaires.

## Installation

Ajoutez simplement cette ligne dans votre HTML :

```html
<script src="https://cdn.jsdelivr.net/npm/@nicolastizioco/scrypts@latest/src/email-autocomplete/email-autocomplete.js"></script>
```

## Utilisation de base

### HTML Structure

```html
<div data-email-wrapper>
  <!-- Champ de saisie pour l'email -->
  <input type="email" data-email-input placeholder="Entrez votre email..." />

  <!-- Conteneur des résultats -->
  <div data-email-results>
    <div data-email-item></div>
  </div>
</div>
```

## Fonctionnalités

### Attributs disponibles

#### `data-email-wrapper`
Conteneur principal qui englobe l'input et les résultats.

```html
<div data-email-wrapper>
  <!-- Contenu -->
</div>
```

#### `data-email-input`
Champ de saisie de l'email.

**Attributs optionnels :**
- `data-email-domains` : Liste de domaines personnalisés (séparés par des virgules)
- `data-email-validate` : Active la validation du domaine à la soumission du formulaire
- `data-email-error` : Message d'erreur personnalisé pour la validation

```html
<!-- Email simple -->
<input type="email" data-email-input />

<!-- Avec domaines personnalisés -->
<input type="email" data-email-input data-email-domains="entreprise.com, societe.fr" />

<!-- Avec validation -->
<input type="email" data-email-input data-email-validate data-email-error="Utilisez un email autorisé : " />
```

#### `data-email-results`
Conteneur des suggestions. Valeur optionnelle : CSS box-shadow personnalisée ou `"no-css"`.

```html
<!-- Avec shadow par défaut -->
<div data-email-results></div>

<!-- Shadow personnalisée -->
<div data-email-results="0 4px 10px rgba(0,0,0,0.3)"></div>

<!-- Sans styles CSS automatiques -->
<div data-email-results="no-css"></div>
```

#### `data-email-item`
Template pour un résultat. Valeur optionnelle : `"no-css"` pour désactiver les styles.

```html
<div data-email-item></div>
<!-- ou -->
<div data-email-item="no-css"></div>
```

## Exemples complets

### Exemple simple

```html
<div data-email-wrapper>
  <input type="email" data-email-input placeholder="Email" />
  <div data-email-results>
    <div data-email-item></div>
  </div>
</div>
```

### Exemple avec domaines personnalisés

```html
<div data-email-wrapper>
  <input
    type="email"
    data-email-input
    data-email-domains="entreprise.com, societe.fr, company.net"
    placeholder="Email professionnel"
  />
  <div data-email-results>
    <div data-email-item></div>
  </div>
</div>
```

### Exemple avec validation de formulaire

```html
<form>
  <div data-email-wrapper>
    <input
      type="email"
      data-email-input
      data-email-validate
      data-email-domains="entreprise.com, societe.fr"
      data-email-error="Veuillez utiliser un email d'entreprise autorisé : "
      placeholder="Email"
      required
    />
    <div data-email-results>
      <div data-email-item></div>
    </div>
  </div>
  <button type="submit">Envoyer</button>
</form>
```

### Exemple avec styles personnalisés

```html
<div data-email-wrapper>
  <input type="email" data-email-input placeholder="Email" />

  <div data-email-results="no-css" class="custom-results">
    <div data-email-item="no-css" class="custom-item"></div>
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

## Domaines par défaut

Si aucun domaine personnalisé n'est spécifié, les domaines suivants sont utilisés :
- gmail.com
- hotmail.com
- icloud.com
- outlook.com
- yahoo.com

## Navigation au clavier

- **Flèches haut/bas** : Naviguer entre les suggestions
- **Entrée** : Sélectionner la suggestion active
- **Échap** : Fermer les suggestions

## Validation de formulaire

Lorsque `data-email-validate` est présent, le script empêchera la soumission du formulaire si le domaine de l'email ne correspond pas à l'un des domaines autorisés.

## Styles CSS par défaut

Le script injecte automatiquement des styles CSS de base. Pour les désactiver, utilisez `data-email-results="no-css"` et `data-email-item="no-css"`.

### Variable CSS personnalisable

```css
[data-email-results] {
  --email-box-shadow: 0 2px 5px 0 rgba(0,0,0,0.2);
}
```

## Compatibilité

- Navigateurs modernes (ES6+)
- Compatible Webflow, WordPress, sites statiques, etc.

## Auteur

Made by [nicolastizio.co](https://nicolastizio.co)
