
function extractItem(value) {
    const match = value.match(/{@item (.*?)\|.+}/);
    return match ? match[1] : value;
  }



function parseText(value) {

  value = value.replace('{@h}', '')

  value = value.replace(/{@([^ ]+)( ([^}]+))?}/g, function(match, tagName, _, tagValue) {
    tagValue = tagValue.trim();
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
      default:
        return match; // if no matching tag, return the original string
    }
  });

  return value;

}

function convertDice(value) {
  const displayValue = value
  return `<button ref="rollButton" class="btn btn-xs btn-outline btn-secondary font-bold">${displayValue}</button>`;
}

function convertDamage(value) {
  const displayValue = value
  return `<button ref="rollButton" class="btn btn-xs btn-outline btn-secondary font-bold">${displayValue}</button>`;
}

function convertHit(value) {
  const displayValue = value >= 0 ? `+${value}` : value;
  return `<button ref="rollButton" class="btn btn-xs btn-outline btn-secondary font-bold">${displayValue}</button>`;
}

function convertDC(value) {
  return `<span class="font-bold text-primary">DC ${value}</span>`;
}

function convertCreature(value) {
  return `<span class="text-primary">${value}</span>`;
}

function convertStatus(value) {
  let displayValue = value;
  
  if (value.includes('||')) {
    const parts = value.split('||');
    displayValue = parts.pop();
  }
  return `<span class="text-primary">${displayValue}</span>`;
}

function convertCondition(value) {
  return `<span class="text-primary">${value}</span>`;
}

function convertItem(value) {
  return `<span class="text-primary">${value}</span>`;
}

function convertSpell(value) {
  return `<span class="text-primary">${value}</span>`;
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




export { extractItem, parseText };