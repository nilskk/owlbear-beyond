
function capitalize(value) {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

function parseText(value) {
  if (!value) return value;

  value = value.replaceAll('{@h}', '')

  value = value.replace(/{@([^ ]+)( ([^}]+))?}/g, function(match, tagName, _, tagValue) {
    if (tagValue) {
      tagValue = tagValue.trim();
    }
    switch (tagName) {
      case 'dice':
        return convertDice(tagValue);
      case 'damage':
        return convertDamage(tagValue);
      case 'item':
        return convertItem(tagValue);
      case 'spell':
        return convertSpell(tagValue);
      case 'atk':
        return convertAtk(tagValue);
      case 'hit':
        return convertHit(tagValue);
      case 'creature':
        return convertCreature(tagValue);
      case 'status':
        return convertStatus(tagValue);
      case 'condition':
        return convertCondition(tagValue);
      case 'dc':
        return convertDC(tagValue);
      case 'skill':
        return convertSkill(tagValue);
      case 'quickref':
        return convertQuickRef(tagValue);
      case 'recharge':
        return convertRecharge(tagValue);
      case 'action':
        return convertAction(tagValue);
      case 'filter':
        return convertFilter(tagValue);
      default:
        return match; // if no matching tag, return the original string
    }
  });

  return value;

}

function convertDice(value) {
  const displayValue = value
  return `<button id="rollButton" class="btn btn-xs btn-outline btn-secondary font-bold">${displayValue}</button>`;
}

function convertDamage(value) {
  const displayValue = value
  return `<button id="rollButton" class="btn btn-xs btn-outline btn-secondary font-bold">${displayValue}</button>`;
}

function convertHit(value) {
  const displayValue = value >= 0 ? `+${value}` : value;
  return `<button id="rollButton" class="btn btn-xs btn-outline btn-secondary font-bold">${displayValue}</button>`;
}

function convertDC(value) {
  return `<span class="font-bold text-primary">DC ${value}</span>`;
}

function convertCreature(value) {
  let displayValue = value;
  let linkValue = value;
  
  if (value.includes('|')) {
    const parts = value.split('|');
    linkValue = parts[0];
    displayValue = parts[parts.length - 1];
  }
  linkValue = linkValue.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, '-');
  return `<a href="https://www.dndbeyond.com/monsters/${linkValue}" target="_blank" class="link link-primary">${displayValue}</a>`;
}

function convertStatus(value) {
  let displayValue = value;
  
  if (value.includes('|')) {
    const parts = value.split('|');
    displayValue = parts[parts.length - 1];
  }
  return `<span class="text-primary">${displayValue}</span>`;
}

function convertCondition(value) {
  const linkValue = capitalize(value.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, '-'));
  return `<a href="https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#${linkValue}" target="_blank" class="link link-primary">${value}</a>`;
}

function convertItem(value) {
  let displayValue = value;
  
  if (value.includes('|')) {
    const parts = value.split('|');
    displayValue = parts[0];
  }
  return `<span class="text-primary">${displayValue}</span>`;
}

function convertSpell(value) {
  const linkValue = value.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, '-');
  return `<a href="https://www.dndbeyond.com/spells/${linkValue}" target="_blank" class="link link-primary">${value}</a>`;
}

function convertSkill(value) {
  return `<span class="text-primary">${value}</span>`;
}

function convertQuickRef(value) {
  let displayValue = value;
  
  if (value.includes('|')) {
    const parts = value.split('|');
    displayValue = parts[0];
  }
  return `<span class="text-primary">${displayValue}</span>`;
}

function convertAtk(value) {
  const displayValue = value
  .replace('mw', 'Meele Weapon')
  .replace('rw', 'Ranged Weapon')
  .replace('ms', 'Meele Spell')
  .replace('rs', 'Ranged Spell')
  .replace(',', ', ');
  return `<span class="text-primary">${displayValue}:</span>`;
}

function convertRecharge(value) {
  if(!value) {
    return `<span class="">(Recharge 6)</span>`;
  }
  return `<span class="">(Recharge ${value}-6)</span>`;
}

function convertAction(value) {
  let displayValue = value;
  
  if (value.includes('|')) {
    const parts = value.split('|');
    displayValue = parts[parts.length - 1];
  }
  return `<span class="text-primary">${displayValue}</span>`;
}

function convertFilter(value) {
  let displayValue = value;
  
  if (value.includes('|')) {
    const parts = value.split('|');
    displayValue = parts[0];
  }
  return `<span class="text-primary">${displayValue}</span>`;
}




export { parseText, capitalize };