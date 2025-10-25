<script setup>
import ArmorSpeedComponent from './components/ArmorSpeedComponent.vue';
import AttributesComponent from './components/AttributesComponent.vue';
import SkillsComponent from './components/SkillsComponent.vue';
import TraitsComponent from './components/TraitsComponent.vue';
import ActionsComponent from './components/ActionsComponent.vue';
import BonusActionsComponent from './components/BonusActionsComponent.vue';
import ReactionsComponent from './components/ReactionsComponent.vue';
import LegendaryActionsComponent from './components/LegendaryActionsComponent.vue';
import LinkTokenModal from './components/LinkTokenModal.vue';
import NavbarComponent from './components/NavbarComponent.vue';
import GlobalRollContextMenu from './components/GlobalRollContextMenu.vue';
import DiceRollDisplay from './components/DiceRollDisplay.vue';
import { ref, computed, onMounted } from 'vue'
import { db } from './db'
import { rollDiceWithDiceRoller } from './diceFunctions';
import OBR from '@owlbear-rodeo/sdk';


const ID = 'com.nilskk.owlbear-beyond';

const linkTokenModal = ref(null);
const playerSelection = ref(null)
const selectedMonster = ref(null);
const groupedBestiary = ref({});
const diceRollResult = ref(null);
const lastDiceRolls = ref([]); // Array to store last rolls with monster info
const diceRollsVisible = ref(false); // Simple visibility state for dice rolls
let timeoutId = null;

onMounted(async () => {
    const bestiary = await db.bestiary.toArray();
    groupedBestiary.value = bestiary.reduce((acc, monster) => {
        if (!acc[monster.source]) {
            acc[monster.source] = [];
        }
        acc[monster.source].push(monster);
        return acc;
    }, {});
    if (bestiary.length > 0) {
        selectedMonster.value = bestiary[0];
    }
});

const showDiceRolls = () => {
    // Show dice rolls
    diceRollsVisible.value = true;
};

const addRollToHistory = (rollResult, monster) => {
    const rollWithMonster = {
        ...rollResult,
        monster: { name: monster.name, id: monster.name } // Store monster info
    };
    
    // Add to beginning of array and keep only last 3
    lastDiceRolls.value.unshift(rollWithMonster);
    if (lastDiceRolls.value.length > 3) {
        lastDiceRolls.value = lastDiceRolls.value.slice(0, 3);
    }
};

const toggleDiceRolls = () => {
    if (diceRollsVisible.value) {
        // Currently showing rolls, so hide them
        diceRollsVisible.value = false;
    } else if (lastDiceRolls.value.length > 0) {
        // Show rolls manually (no timer for manual toggle)
        diceRollsVisible.value = true;
    }
};

const rollDice = (value, rollMode) => {
    // Clear any existing dice result when starting a new roll
    diceRollResult.value = null;
    
    const result = rollDiceWithDiceRoller(value, rollMode, value);
    console.log(result);
    
    // Store simple result for backward compatibility
    diceRollResult.value = result.simple;
    
    // Add detailed result to history
    if (result.detailed && selectedMonster.value) {
        addRollToHistory(result.detailed, selectedMonster.value);
    }
    
    // Show dice rolls
    showDiceRolls();
    
    if (timeoutId) {
        clearTimeout(timeoutId); // Clear the existing timeout
    }
    timeoutId = setTimeout(() => {
        diceRollResult.value = null;
        timeoutId = null; // Reset the timeout ID
    }, 5000); // Hide the result after 5 seconds
};

const selectMonster = (monster) => {
    selectedMonster.value = monster;
    // Auto-close dice rolls when switching monsters
    diceRollsVisible.value = false;
    diceRollResult.value = null;
    // Keep roll history across monsters (now stores monster info with each roll)
};

let lastCreature = null;

function handlePlayerChange(player) {
    if(!player.selection) {
        playerSelection.value = null;
        return;
    } 
    OBR.scene.items.getItems(Array.isArray(player.selection) && player.selection.length > 0 ? [player.selection[0]] : []).then((items) => {
    if (items.length > 0) {
        // console.log(items);
        showMonsterSheet(items[0]);
        if (items[0].layer == 'CHARACTER') {
            playerSelection.value = items[0]; 
        }
    }
}); 
}

function handleGrimoireInitiaveChange(items) {
    if (!items) return;
    let grimoireIndicator = items.filter(item => item.name == "GM's Grimoire - Indicator")[0];
    if (!grimoireIndicator) return; // Add this check
    // console.log(grimoireIndicator);
    OBR.scene.items.getItems([grimoireIndicator.attachedTo]).then((items) => {
        // console.log(items);
        showMonsterSheet(items[0]);
    }); 
}

function showMonsterSheet(item) {
    if (!item || !item.metadata[`${ID}/monstersheet`]) return;
  
    const dndbeyond = item.metadata[`${ID}/monstersheet`];
    if (dndbeyond === lastCreature) return;
  
    lastCreature = dndbeyond;
    selectedMonster.value = dndbeyond;
    
}

OBR.player.onChange(handlePlayerChange);
OBR.scene.items.onChange(handleGrimoireInitiaveChange);

const updateTokens = () => {
    linkTokenModal.value.openModal();
};

const compositeString = computed(() => {
    if (!selectedMonster.value || !diceRollResult.value) return '';
    return `${selectedMonster.value.name} rolls ${diceRollResult.value[0]}`;
});

</script>

<template>
    <!-- Old simple dice roll display (kept for backward compatibility) -->
    <div class="stats bg-neutral z-50 fixed bottom-1 right-1" v-if="diceRollResult !== null && lastDiceRolls.length === 0">
        <div class="stat">
            <div class="stat-title">{{ compositeString }}</div>
            <div class="stat-value text-primary">{{ diceRollResult[2] }}</div>
            <div class="stat-desc">{{ diceRollResult[1] }}</div>
        </div>
    </div>
    
    <LinkTokenModal 
        ref="linkTokenModal"
        :playerSelection="playerSelection" 
        :selectedMonster="selectedMonster" 
    />
    <GlobalRollContextMenu />
    <div class="flex flex-col">
        <NavbarComponent 
            :selectedMonster="selectedMonster"
            :groupedBestiary="groupedBestiary"
            :playerSelection="playerSelection"
            @selectMonster="selectMonster"
            @updateTokens="updateTokens"
        />
        <div v-if="selectedMonster">
            <div v-if="selectedMonster._copy">
                <p class="text-primary text-5xl font-bold">
                    Creature can't be shown, because it is dependent on other creatures. Use 5e.tools to get the full creature.
                </p>
            </div>
            <div v-else>
                <ArmorSpeedComponent :monster="selectedMonster" />
                <div class="divider divider-accent font-bold mb-0">Attributes</div>
                <AttributesComponent :monster="selectedMonster" @rollDiceAttribute="rollDice" />
                <div class="divider divider-accent font-bold mb-0">Skills</div>
                <SkillsComponent :monster="selectedMonster" @rollDiceSkill="rollDice" />
                <TraitsComponent :monster="selectedMonster" @rollDiceTrait="rollDice" />
                <ActionsComponent :monster="selectedMonster" @rollDiceAction="rollDice" />
                <BonusActionsComponent :monster="selectedMonster" @rollDiceBonusAction="rollDice" />
                <ReactionsComponent :monster="selectedMonster" @rollDiceReaction="rollDice" />
                <LegendaryActionsComponent :monster="selectedMonster" @rollDiceLegendaryAction="rollDice" />
            </div>
        </div>
    </div>
    
    <!-- Round D20 Toggle Button -->
    <div class="fixed bottom-8 right-8 z-20">
        <button @click="toggleDiceRolls" 
                class="btn btn-circle btn-lg btn-primary shadow-lg hover:shadow-xl transition-all"
                :class="{ 
                    'btn-active': diceRollsVisible,
                    'btn-disabled opacity-50': lastDiceRolls.length === 0
                }"
                :disabled="lastDiceRolls.length === 0">
            <!-- D20 Icosahedron SVG from dice CSS -->
            <svg width="28" height="31" viewBox="0 0 28 31" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                <path d="M14 0L0 7.5V22.7L14 30.2L27 23.2L28 22.6V7.5L14 0ZM12 8.3L6.1 17.1L2.4 9.1L12 8.3ZM8 18L14 8.9L20 18H8ZM21.8 17.1L16 8.3L25.5 9L21.8 17.1ZM15 2.8L22.4 6.8L15 6.2V2.8ZM13 2.8V6.2L5.6 6.8L13 2.8ZM2 12.8L4.7 18.8L2 20.4V12.8ZM3 22.1L5.7 20.5L10.1 26L3 22.1ZM8 20H19L14 27.5L8 20ZM17.9 25.9L22.3 20.4L25 22L17.9 25.9ZM23.5 18.9L23.3 18.8L26 12.8V20.4L23.5 18.9Z" />
            </svg>
        </button>
    </div>

    <!-- New detailed dice roll display -->
    <DiceRollDisplay 
        :diceRollsVisible="diceRollsVisible"
        :lastDiceRolls="lastDiceRolls"
    />
</template>

<style scoped>

</style>
