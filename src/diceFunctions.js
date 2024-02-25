import OBR from "@owlbear-rodeo/sdk"

function rollDiceWithRumble(diceString) {
    diceString = convertDiceString(diceString);
    OBR.player.setMetadata({
        'com.battle-system.friends/metadata_diceroll': {
          notation: diceString,
          created: new Date().toISOString(),
          sender: 'owlbear-beyond',
          targetId: OBR.player.id
        }
      })
}

function convertDiceString(value) {
    return (value.startsWith('+') || value.startsWith('-')) ? `1d20${value}` : value;
}

export { rollDiceWithRumble }