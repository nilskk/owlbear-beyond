export const CONDITIONS = {
    "blinded": `
        <strong>BLINDED</strong><br>
        <strong>Can't See:</strong> You can't see and automatically fail any ability check that requires sight.<br>
        <strong>Attacks Affected:</strong> Attack rolls against you have Advantage, and your attack rolls have Disadvantage.<br>
    `,
    "charmed": `
        <strong>CHARMED</strong><br>
        <strong>Can’t Harm the Charmer.</strong> You can’t attack the charmer or target the charmer with damaging abilities or magical effects.<br>
        <strong>Social Advantage.</strong> The charmer has Advantage on any ability check to interact with you socially.<br>
    `,
    "concentration": `
        <strong>CONCENTRATION</strong><br>
        <strong>Another Concentration Effect.</strong> You lose Concentration on an effect the moment you start casting a spell that requires Concentration or activate another effect that requires Concentration.<br>
        <strong>Damage.</strong> If you take damage, you must succeed on a Constitution saving throw to maintain Concentration. The DC equals 10 or half the damage taken (round down), whichever number is higher, up to a maximum DC of 30.<br>
        <strong>Incapacitated or Dead.</strong> Your Concentration ends if you have the Incapacitated condition or you die.<br>
    `,
    "deafened": `
        <strong>DEAFENED</strong><br>
        <strong>Can't Hear:</strong> You can't hear and automatically fail any ability check that requires hearing.<br>
    `,
    "exhaustion": `
        <strong>EXHAUSTION</strong><br>
        <strong>Exhaustion Levels.</strong> This condition is cumulative. Each time you receive it, you gain 1 Exhaustion level. You die if your Exhaustion level is 6.<br>
        <strong>D20 Tests Affected.</strong> When you make a D20 Test, the roll is reduced by 2 times your Exhaustion level.<br>
        <strong>Speed Reduced.</strong> Your Speed is reduced by a number of feet equal to 5 times your Exhaustion level.<br>
        <strong>Removing Exhaustion Levels.</strong> Finishing a Long Rest removes 1 of your Exhaustion levels. When your Exhaustion level reaches 0, the condition ends.<br>
    `,
    "frightened": `
        <strong>FRIGHTENED</strong><br>
        <strong>Ability Checks and Attacks Affected.</strong> You have Disadvantage on ability checks and attack rolls while the source of fear is within line of sight.<br>
        <strong>Can’t Approach.</strong> You can’t willingly move closer to the source of fear.<br>
    `,
    "grappled": `
        <strong>GRAPPLED</strong><br>
        <strong>Speed 0.</strong> Your Speed is 0 and can’t increase.<br>
        <strong>Attacks Affected.</strong> You have Disadvantage on attack rolls against any target other than the grappler.<br>
        <strong>Movable.</strong> The grappler can drag or carry you when it moves, but every foot of movement costs it 1 extra foot unless you are Tiny or two or more sizes smaller than it.<br>
    `,
    "incapacitated": `
        <strong>INCAPACITATED</strong><br>
        <strong>Inactive.</strong> You can’t take any action, Bonus Action, or Reaction.<br>
        <strong>No Concentration.</strong> Your Concentration is broken.<br>
        <strong>Speechless.</strong> You can’t speak.<br>
        <strong>Surprised.</strong> If you’re Incapacitated when you roll Initiative, you have Disadvantage on the roll.<br>
    `,
    "invisible": `
        <strong>INVISIBLE</strong><br>
        <strong>Surprise.</strong> If you’re Invisible when you roll Initiative, you have Advantage on the roll.
        <strong>Concealed.</strong> You aren’t affected by any effect that requires its target to be seen unless the effect’s creator can somehow see you. Any equipment you are wearing or carrying is also concealed.<br>
        <strong>Attacks Affected.</strong> Attack rolls against you have Disadvantage, and your attack rolls have Advantage. If a creature can somehow see you, you don’t gain this benefit against that creature.<br>
    `,
    "paralyzed": `
        <strong>PARALYZED</strong><br>
        <strong>Incapacitated.</strong> You have the Incapacitated condition.<br>
        <strong>Speed 0.</strong> Your Speed is 0 and can’t increase.<br>
        <strong>Saving Throws Affected.</strong> You automatically fail Strength and Dexterity saving throws.<br>
        <strong>Attacks Affected.</strong> Attack rolls against you have Advantage.<br>
        <strong>Automatic Critical Hits.</strong> Any attack roll that hits you is a Critical Hit if the attacker is within 5 feet of you.<br>
    `,
    "petrified": `
        <strong>PETRIFIED</strong><br>
        <strong>Turned to Inanimate Substance.</strong> You are transformed, along with any nonmagical objects you are wearing and carrying, into a solid inanimate substance (usually stone). Your weight increases by a factor of ten, and you cease aging.<br>
        <strong>Incapacitated.</strong> You have the Incapacitated condition.<br>
        <strong>Speed 0.</strong> Your Speed is 0 and can’t increase.<br>
        <strong>Attacks Affected.</strong> Attack rolls against you have Advantage.<br>
        <strong>Saving Throws Affected.</strong> You automatically fail Strength and Dexterity saving throws.<br>
        <strong>Resist Damage.</strong> You have Resistance to all damage.<br>
        <strong>Poison Immunity.</strong> You have Immunity to the Poisoned condition.<br>
    `,
    "poisoned": `
        <strong>POISONED</strong><br>
        <strong>Ability Checks and Attacks Affected.</strong> You have Disadvantage on attack rolls and ability checks.<br>
    `,
    "prone": `
        <strong>PRONE</strong><br>
        <strong>Restricted Movement.</strong> Your only movement options are to crawl or to spend an amount of movement equal to half your Speed (round down) to right yourself and thereby end the condition. If your Speed is 0, you can’t right yourself.<br>
        <strong>Attacks Affected.</strong> You have Disadvantage on attack rolls. An attack roll against you has Advantage if the attacker is within 5 feet of you. Otherwise, that attack roll has Disadvantage.<br>
    `,
    "restrained": `
        <strong>RESTRAINED</strong><br>
        <strong>Speed 0.</strong> Your Speed is 0 and can’t increase.<br>
        <strong>Attacks Affected.</strong> Attack rolls against you have Advantage, and your attack rolls have Disadvantage.<br>
        <strong>Saving Throws Affected.</strong> You have Disadvantage on Dexterity saving throws.<br>
    `,
    "stunned": `
        <strong>STUNNED</strong><br>
        <strong>Incapacitated.</strong> You have the Incapacitated condition.<br>
        <strong>Saving Throws Affected.</strong> You automatically fail Strength and Dexterity saving throws.<br>
        <strong>Attacks Affected.</strong> Attack rolls against you have Advantage.<br>
    `,
    "unconscious": `
        <strong>UNCONSCIOUS</strong><br>
        <strong>Inert.</strong> You have the Incapacitated and Prone conditions, and you drop whatever you’re holding. When this condition ends, you remain Prone.<br>
        <strong>Speed 0.</strong> Your Speed is 0 and can’t increase.<br>
        <strong>Attacks Affected.</strong> Attack rolls against you have Advantage.<br>
        <strong>Saving Throws Affected.</strong> You automatically fail Strength and Dexterity saving throws.<br>
        <strong>Automatic Critical Hits.</strong> Any attack roll that hits you is a Critical Hit if the attacker is within 5 feet of you.<br>
        <strong>Unaware.</strong> You're unaware of your surroundings.<br>
    `,
}

export const HAZARDS = {
    "burning": `
        <strong>BURNING</strong><br>
        A burning creature or object takes 1d4 Fire damage at the start of each of its turns. As an action, you can extinguish fire on yourself by giving yourself the Prone condition and rolling on the ground. The fire also goes out if it is doused, submerged, or suffocated.<br>
    `,
}