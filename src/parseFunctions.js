
import { CONDITIONS, HAZARDS } from './glossary.js';

function capitalize(value) {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

function removeMatchingElements(array, stringsToMatch) {
    return array.filter(element => !stringsToMatch.includes(element));
}

function handlePipe(value, mode="first") {
    if (value.includes('|')) {
        let parts = value.split('|');
        parts = removeMatchingElements(parts, ['XPHB']);
        if (mode === 'first') return parts[0];
        if (mode === 'last') return parts[parts.length - 1];
    }
    return value;
}

function parseSpecialHp(value) {
    if (typeof value === 'string') {
        const match = value.match(/\d+/);
        return match ? parseInt(match[0], 10) : value;
    }
    return value;
}

function parseSpecialAc(value) {
    if (typeof value === 'string') {
        const match = value.match(/\d+/);
        return match ? parseInt(match[0], 10) : value;
    }
    return value;
}

function parseText(value) {
    if (!value) return value;

    value = value.replaceAll('{@h}', '')
    value = value.replaceAll('{@actSaveFail}', '{@actSaveFail 1}')
    value = value.replaceAll('{@actSaveSuccess}', '{@actSaveSuccess 1}')
    value = value.replaceAll('{@actSaveSuccessOrFail}', '{@actSaveSuccessOrFail 1}')
    value = value.replaceAll('{@actTrigger}', '{@actTrigger 1}')
    value = value.replaceAll('{@actResponse}', '{@actResponse 1}')

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
            case 'atkr':
                return convertAtkRoll(tagValue);
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
            case 'actSave':
                return convertSave(tagValue);
            case 'hitYourSpellAttack':
                return convertToPrimaryText(tagValue);
            case 'variantrule':
                return convertVariantRule(tagValue);
            case 'actSaveFail':
                return convertSaveFail();
            case 'actSaveSuccess':
                return convertSaveSuccess();
            case 'actSaveSuccessOrFail':
                return convertSaveSuccessOrFail();
            case 'actTrigger':
                return convertTrigger();
            case 'actResponse':
                return convertResponse();
            default:
                return match; // if no matching tag, return the original string
        }
    });

    // Replace newlines with <br> tags for multiline display
    value = value.replace(/\n/g, '<br>');

    return value;

}

function convertToPrimaryText(value) {
    let displayValue = handlePipe(value);
    return `<span class="text-primary">${displayValue}</span>`;
}

function convertDice(value) {
    const displayValue = value
    return `<button class="btn btn-xs btn-outline btn-secondary font-bold rollButton">${displayValue}</button>`;
}

function convertDamage(value) {
    const displayValue = value
    return `<button class="btn btn-xs btn-outline btn-secondary font-bold rollButton">${displayValue}</button>`;
}

function convertHit(value) {
    const displayValue = value >= 0 ? `+${value}` : value;
    return `<button class="btn btn-xs btn-outline btn-secondary font-bold rollButton">${displayValue}</button>`;
}

function convertDC(value) {
    return `<span class="font-bold text-primary">DC ${value}</span>`;
}

function convertCreature(value) {
    let displayValue = handlePipe(value, 'last');
    let linkValue = handlePipe(value, 'first');
    linkValue = linkValue.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, '-');
    return `<a href="https://www.dndbeyond.com/search?q=${linkValue}&f=monsters&c=monsters" target="_blank" class="link link-primary">${displayValue}</a>`;
}

function convertStatus(value) {
    value = handlePipe(value, 'last');
    const conditionKey = value.toLowerCase().trim();
    
    // Check if this condition exists in our glossary
    const description = CONDITIONS[conditionKey] || HAZARDS[conditionKey];
    
    if (description) {
        // Use the full HTML description for the tooltip
        return `<span class="text-accent game-term cursor-help" data-term="${value}" data-description="${description}">${value}</span>`;
    }
    
    // Fallback to plain text if not in glossary
    return `<span class="text-primary">${value}</span>`;
}

function convertCondition(value) {
    value = handlePipe(value);
    const conditionKey = value.toLowerCase().trim();
    
    // Check if this condition exists in our glossary
    const description = CONDITIONS[conditionKey] || HAZARDS[conditionKey];
    
    if (description) {
        // Use the full HTML description for the tooltip
        return `<span class="text-accent game-term cursor-help" data-term="${value}" data-description="${description}">${value}</span>`;
    }
    
    // Fallback to plain text if not in glossary
    return `<span class="text-primary">${value}</span>`;
}

function convertItem(value) {
    let displayValue = handlePipe(value);
    return `<span class="text-primary">${displayValue}</span>`;
}

function convertSpell(value) {
    value = handlePipe(value);
    const linkValue = value.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, '-');
    return `<a href="https://www.dndbeyond.com/search?q=${linkValue}&f=spells&c=spells" target="_blank" class="link link-primary">${value}</a>`;
}

function convertSkill(value) {
    value = handlePipe(value);
    return `<span class="text-primary">${value}</span>`;
}

function convertQuickRef(value) {
    let displayValue = handlePipe(value);
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

function convertAtkRoll(value) {
    const displayValue = value
    .replace('m', 'Melee Attack Roll')
    .replace('r', 'Ranged Attack Roll')
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
    let displayValue = handlePipe(value, 'last');
    return `<span class="text-primary">${displayValue}</span>`;
}

function convertFilter(value) {
    let displayValue = handlePipe(value);
    return `<span class="text-primary">${displayValue}</span>`;
}

function convertSave(value) {
    const displayValue = value
    .replace('str', 'Strength')
    .replace('dex', 'Dexterity')
    .replace('con', 'Constitution')
    .replace('int', 'Intelligence')
    .replace('wis', 'Wisdom')
    .replace('cha', 'Charisma');
    return `<span class="text-primary">${displayValue} Saving Throw:</span>`;
}

function convertVariantRule(value) {
    let displayValue = handlePipe(value, "last");
    return `<span>${displayValue}</span>`;
}

function convertSaveFail() {
    return `<br><span class="font-bold">Failure:</span>`;
}

function convertSaveSuccess() {
    return `<br><span class="font-bold">Success:</span>`;
}

function convertSaveSuccessOrFail() {
    return `<br><span class="font-bold">Failure or Success:</span>`;
}

function convertTrigger() {
    return `<span class="font-bold">Trigger:</span>`;
}

function convertResponse() {
    return `<span class="font-bold">Response:</span>`;
}



export { parseText, capitalize, parseSpecialHp, parseSpecialAc };