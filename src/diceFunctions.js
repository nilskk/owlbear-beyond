import { DiceRoll } from '@dice-roller/rpg-dice-roller';

function rollDiceWithDiceRoller(diceString, rollMode="normal", originalNotation="") {
    const convertedString = convertDiceString(diceString, rollMode);
    
    if (!convertedString || convertedString.trim() === '') {
        return {
            simple: ['Error', 'Invalid dice notation', '0'],
            detailed: null
        };
    }
    
    const roll = new DiceRoll(convertedString);
    
    return processRollSimple(roll, originalNotation, rollMode);
}

// Keep for legacy reasons
function processDetailedRoll(roll, originalNotation, convertedString, rollMode) {
    const dice = [];
    let modifier = 0;
    
    // Extract modifier from ORIGINAL notation (before conversion)
    const originalDiceTypeMatch = convertedString.match(/(\d+)d(\d+)(.*)$/);
    const originalModifier = originalDiceTypeMatch ? originalDiceTypeMatch[3] : '';

    // Extract dice type from converted string for exploding dice logic
    const diceTypeMatch = convertedString.match(/(\d+)d(\d+)(.*)$/);
    const diceType = diceTypeMatch ? parseInt(diceTypeMatch[2], 10) : 20;
    
    // Process each roll in the dice roll
    roll.rolls.forEach(rollGroup => {
        if (rollGroup.calculationValue !== undefined) {
            // This is a modifier
            modifier += rollGroup.calculationValue;
        } else if (rollGroup.rolls) {
            // This is a dice group
            rollGroup.rolls.forEach(die => {
                dice.push({
                    value: die.calculationValue || die.value,
                    isMaxValue: die.value === diceType,
                    isMinValue: die.value === 1,
                    isDropped: die.modifierFlags && die.modifierFlags.includes('d')
                });
            });
        }
    });
    
    return {
        total: roll.total,
        notation: roll.notation,
        originalNotation: convertedString,
        rollMode: rollMode,
        dice: dice,
        modifier: originalModifier,
        breakdown: createBreakdownString(dice, originalModifier)
    };
}

function processRollSimple(roll, originalNotation, rollMode) {
    const outputParts = roll.output.split(':').map(part => part.trim());
    
    return {
        total: roll.total,
        notation: outputParts[0] || roll.output, // The dice notation part (e.g., "2d20dl1+5")
        breakdown: outputParts[1] || '', // The breakdown part (e.g., "[12, 3]+5 = 15")
        originalNotation: originalNotation,
        rollMode: rollMode,
    };
}

function createBreakdownString(diceList, modifier) {
    const diceValues = diceList.map(die => die.value).join(', ');
    return `[${diceValues}]${modifier}`;
}

function convertDamageToCritRoll(damageString) {
    // Remove spaces from the string for easier processing
    const cleanString = damageString.replace(/\s+/g, '');
    
    // Match dice notation like "2d6+3" or "1d8"
    const diceRegex = /(\d+)d(\d+)/g;
    
    // Check if there are any dice in the string
    if (!diceRegex.test(cleanString)) {
        return damageString;
    }
    
    // Reset regex since test() moved the pointer
    const finalRegex = /(\d+)d(\d+)/g;
    
    // Replace each dice notation with normal dice + max value
    // For example: 2d6 becomes 2d6+12 (roll 2d6 and add 12, which is 2*6)
    const critString = cleanString.replace(finalRegex, (match, numDice, diceType) => {
        const num = parseInt(numDice, 10);
        const die = parseInt(diceType, 10);
        const maxValue = num * die;
        return `${numDice}d${diceType}+${maxValue}`;
    });

    return critString || damageString; // Fallback to original if something goes wrong
}

function convertDiceString(value, rollMode) {
    if (!value || value.trim() === '') {
        return '1d20'; // Default fallback
    }
    
    if (rollMode === 'advantage') {
        return (value.startsWith('+') || value.startsWith('-')) ? `2d20dl1${value}` : value;
    }
    if (rollMode === 'disadvantage') {
        return (value.startsWith('+') || value.startsWith('-')) ? `2d20dh1${value}` : value;
    }
    if (rollMode === 'crit') {
        return convertDamageToCritRoll(value);
    }
    if (rollMode === 'normal') {
        return (value.startsWith('+') || value.startsWith('-')) ? `1d20${value}` : value;
    }
    return value;
}

export { rollDiceWithDiceRoller }