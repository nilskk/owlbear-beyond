import OBR from "@owlbear-rodeo/sdk"

function rollDiceWithRumble(diceString, rollMode="normal") {
    diceString = convertDiceString(diceString, rollMode);
    OBR.player.setMetadata({
        'com.battle-system.friends/metadata_diceroll': {
            notation: diceString,
            created: new Date().toISOString(),
            sender: 'owlbear-beyond',
            targetId: OBR.player.id
        }
      })
}

function convertDamageToCritRoll(damageString) {
    const diceRegex = /^(\d+)d(\d+)(.*)$/;
    const match = damageString.match(diceRegex);

    if (match) {
        const numDice = parseInt(match[1], 10);
        const diceType = match[2];
        const modifier = match[3] || '';

        // Double the number of dice
        const doubledNumDice = numDice * 2;

        // Reconstruct the dice notation with the doubled number of dice
        const doubledDiceString = `${doubledNumDice}d${diceType}${modifier}`;

        return doubledDiceString;
    }

    return damageString;
}

function convertDiceString(value, rollMode) {
    if (rollMode === 'advantage') {
        return (value.startsWith('+') || value.startsWith('-')) ? `2d20kh${value}` : convertDamageToCritRoll(value);
    }
    if (rollMode === 'disadvantage') {
        return (value.startsWith('+') || value.startsWith('-')) ? `2d20kl${value}` : convertDamageToCritRoll(value);
    }
    if (rollMode === 'normal') {
        return (value.startsWith('+') || value.startsWith('-')) ? `1d20${value}` : value;
    }
}

export { rollDiceWithRumble }