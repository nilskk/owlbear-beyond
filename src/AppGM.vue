<script setup>
import ArmorSpeedComponent from './components/ArmorSpeedComponent.vue';
import AttributesComponent from './components/AttributesComponent.vue';
import SkillsComponent from './components/SkillsComponent.vue';
import TraitsComponent from './components/TraitsComponent.vue';
import ActionsComponent from './components/ActionsComponent.vue';
import BonusActionsComponent from './components/BonusActionsComponent.vue';
import ReactionsComponent from './components/ReactionsComponent.vue';
import LegendaryActionsComponent from './components/LegendaryActionsComponent.vue';
import RollComponent from './components/RollComponent.vue';
import { ref, computed, onMounted } from 'vue'
import { vOnClickOutside } from '@vueuse/components'
import { db } from './db'
import { writeBulkToTable, clearTable } from './dbFunctions'
import { rollDiceWithDiceRoller } from './diceFunctions';
import { parseSpecialHp, parseSpecialAc } from './parseFunctions';
import OBR from '@owlbear-rodeo/sdk';


const ID = 'com.nilskk.owlbear-beyond';
const CLASH_ID = 'com.battle-system.clash';
const GRIMOIRE_ID = 'com.bitperfect-software.hp-tracker'
const CLASH_LABEL_ID = '56d6b2c4-cd17-11ed-afa1-0242ac120002';

const searchInput = ref('');
const fileInput = ref(null);
const myModal = ref(null);
const playerSelection = ref(null)
const selectedMonster = ref(null);
const groupedBestiary = ref({});
const diceRollResult = ref(null);
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

const rollDice = (value, rollMode) => {
    diceRollResult.value = rollDiceWithDiceRoller(value, rollMode);
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
};

const filteredGroupedBestiary = computed(() => {
    if (!searchInput.value) {
        return groupedBestiary.value;
    }
    const filtered = {};
    for (const source in groupedBestiary.value) {
        filtered[source] = groupedBestiary.value[source].filter(monster =>
            monster.name.toLowerCase().includes(searchInput.value.toLowerCase())
        );
    }
    return filtered;
});

const clearInput = () => {
    searchInput.value = '';
};

const saveJson = () => {
  const files = fileInput.value.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = JSON.parse(e.target.result);
      const monster_list = json.monster;
      writeBulkToTable(monster_list);
    };
    reader.readAsText(file);
  }
};

const deleteData = () => {
    clearTable();
};

let lastCreature = null;

function handlePlayerChange(player) {
    if(!player.selection) {
        playerSelection.value = null;
        return;
    } 
    OBR.scene.items.getItems([player.selection[0]]).then((items) => {
        // console.log(items);
        showMonsterSheet(items[0]);
        if (items[0].layer == 'CHARACTER') {
            playerSelection.value = items[0]; 
        }
    }); 
}

function handleGrimoireInitiaveChange(items) {
    if (!items) return;
    let grimoireIndicator = items.filter(item => item.name == "GM's Grimoire - Indicator")[0];
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
    myModal.value.showModal();
};

const confirmTokenUpdate = () => {
    OBR.player.getSelection().then((itemIds) => {
        console.log(itemIds);
        if (itemIds.length > 0) {
            OBR.scene.items.getItems(itemIds).then((items) => {
                console.log(items);
                OBR.scene.items.updateItems(items, (items2) => {
                    for (let item of items2) {
                        item.metadata[`${ID}/monstersheet`] = JSON.parse(JSON.stringify(selectedMonster.value))
                        // if(Number.isInteger(selectedMonster.value.ac[0])) {
                        //     item.metadata[`${CLASH_ID}/clash_armorClass`] = selectedMonster.value.ac[0];
                        // } 
                        // else if (selectedMonster.value.ac[0].ac) {
                        //     item.metadata[`${CLASH_ID}/clash_armorClass`] = selectedMonster.value.ac[0].ac;
                        // }
                        // else if (selectedMonster.value.ac[0].special) {
                        //     item.metadata[`${CLASH_ID}/clash_armorClass`] = parseSpecialAc(selectedMonster.value.ac[0].special);
                        // }
                        // item.metadata[`${CLASH_ID}/clash_maxHP`] = selectedMonster.value.hp.average || parseSpecialHp(selectedMonster.value.hp.special);
                        // item.metadata[`${CLASH_ID}/clash_currentHP`] = selectedMonster.value.hp.average || parseSpecialHp(selectedMonster.value.hp.special);
                        // item.metadata[`${CLASH_ID}/clash_dexSave`] = Math.floor((selectedMonster.value.dex - 10) / 2);
                        // item.metadata[`${CLASH_ID}/clash_dexScore`] = selectedMonster.value.dex
                        // item.metadata[`${CLASH_ID}/clash_initiative`] = 10 + Math.floor((selectedMonster.value.dex - 10) / 2);
                        // item.metadata[`${CLASH_ID}/clash_unitName`] = selectedMonster.value.name;
                        // // Set Clash ID to have a the metadata applied directly
                        // item.metadata[`${CLASH_ID}/clash_id`] = item.id;
                        item.metadata[`${GRIMOIRE_ID}/data`] = {};
                        item.metadata[`${GRIMOIRE_ID}/data`]["acOnMap"] = false;
                        if(Number.isInteger(selectedMonster.value.ac[0])) {
                            item.metadata[`${GRIMOIRE_ID}/data`]["armorClass"] = selectedMonster.value.ac[0];
                        } 
                        else if (selectedMonster.value.ac[0].ac) {
                            item.metadata[`${GRIMOIRE_ID}/data`]["armorClass"] = selectedMonster.value.ac[0].ac;
                        }
                        else if (selectedMonster.value.ac[0].special) {
                            item.metadata[`${GRIMOIRE_ID}/data`]["armorClass"] = parseSpecialAc(selectedMonster.value.ac[0].special);
                        }
                        item.metadata[`${GRIMOIRE_ID}/data`]['equipment'] = {
                            "attuned": [],
                            "eqipped": [],
                        }
                        item.metadata[`${GRIMOIRE_ID}/data`]['hp'] = selectedMonster.value.hp.average || parseSpecialHp(selectedMonster.value.hp.special);
                        item.metadata[`${GRIMOIRE_ID}/data`]['hpBar'] = false;
                        item.metadata[`${GRIMOIRE_ID}/data`]['hpOnMap'] = false;
                        item.metadata[`${GRIMOIRE_ID}/data`]['hpTrackerActive'] = true;
                        item.metadata[`${GRIMOIRE_ID}/data`]["initiative"] = 10 + Math.floor((selectedMonster.value.dex - 10) / 2);
                        item.metadata[`${GRIMOIRE_ID}/data`]['maxHp'] = selectedMonster.value.hp.average || parseSpecialHp(selectedMonster.value.hp.special);
                        item.metadata[`${GRIMOIRE_ID}/data`]["playerList"] = false;
                        item.metadata[`${GRIMOIRE_ID}/data`]["playerMap"] = {
                            "hp": false,
                            "ac": false,
                        };
                        item.metadata[`${GRIMOIRE_ID}/data`]["ruleset"] = "e5";
                        item.metadata[`${GRIMOIRE_ID}/data`]["sheet"] = "";
                        item.metadata[`${GRIMOIRE_ID}/data`]["stats"] = {
                            "initial": true,
                            "initiativeBonus": Math.floor((selectedMonster.value.dex - 10) / 2),
                            "limits": [{"id": "Hit Dice", "max": 1, "resets": ["Long Rest"], "used": 0}],
                        }
                    }
                });
            });
        }
    });
    myModal.value.close();
};

const compositeString = computed(() => {
    if (!selectedMonster.value || !diceRollResult.value) return '';
    return `${selectedMonster.value.name} rolls ${diceRollResult.value[0]}`;
});

</script>

<template>
    <div class="stats bg-neutral z-50 fixed bottom-1 right-1" v-if="diceRollResult !== null">
        <div class="stat">
            <div class="stat-title">{{ compositeString }}</div>
            <div class="stat-value text-primary">{{ diceRollResult[2] }}</div>
            <div class="stat-desc">{{ diceRollResult[1] }}</div>
        </div>
    </div>
    <dialog v-if="playerSelection" id="my_modal_2" class="modal" ref="myModal">
        <div class="modal-box">
            <div class="flex flex-col justify-center space-y-3">
                <h1 v-if="playerSelection.metadata[`${ID}/monstersheet`]" class="text-xl font-bold">Current: {{ playerSelection.metadata[`${ID}/monstersheet`].name }}</h1>
                <h1 class="text-xl font-bold">New: {{ selectedMonster.name }}</h1>
                <button @click="confirmTokenUpdate" class="btn btn-primary">Confirm</button>
            </div>
            
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
    <div class="drawer drawer-end">
        <input id="my-drawer-1" type="checkbox" class="drawer-toggle" /> 
        <div class="drawer-content flex flex-col">
            <div class="navbar bg-base-300">
                <div  class="flex-1 justify-start">
                    <div v-if="selectedMonster" class="dropdown dropdown-begin z-50" v-on-click-outside="clearInput">
                        <input tabindex="0" type="search" class="input m-1" :placeholder="selectedMonster.name"
                            v-model="searchInput" @focus="$event.target.select()">
                        <ul tabindex="0"
                            class="dropdown-content menu menu-vertical p-2 shadow-2xl bg-base-100 rounded-box">
                            <div className="overflow-y-auto max-h-96 w-64">
                                <li v-for="(monsters, source) in filteredGroupedBestiary" :key="source">
                                    <details open>
                                        <summary>{{ source }}</summary>
                                        <ul>
                                            <li v-for="monster in monsters" :key="monster.name">
                                                <a @click="selectMonster(monster)">{{ monster.name }}</a>
                                            </li>
                                        </ul>
                                    </details>
                                    
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>
                <div class="flex-none">
                    <button @click="updateTokens" v-if="playerSelection" class="btn btn-primary">
                        <a v-if="playerSelection.metadata[`${ID}/monstersheet`]">Update Token</a>
                        <a v-else>Link Token</a>
                    </button>
                    <label for="my-drawer-1" class="drawer-button btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            class="inline-block w-5 h-5 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16">
                            </path>
                        </svg>
                    </label>
                </div>
            </div>
            <div v-if="selectedMonster">
                <div v-if="selectedMonster._copy">
                    <p class="text-primary text-5xl font-bold">
                        Creature can't be shown, because it is dependent on other creatures. Use 5e.tools to get the full creature.
                    </p>
                </div>
                <div v-else>
                    <ArmorSpeedComponent :monster="selectedMonster" />
                    <div class="divider divider-accent font-bold mb-0">Attributes</div>
                    <AttributesComponent :monster="selectedMonster" />
                    <div class="divider divider-accent font-bold mb-0">Skills</div>
                    <SkillsComponent :monster="selectedMonster"  />
                    <TraitsComponent :monster="selectedMonster"  />
                    <ActionsComponent :monster="selectedMonster" />
                    <BonusActionsComponent :monster="selectedMonster"  />
                    <ReactionsComponent :monster="selectedMonster"  />
                    <LegendaryActionsComponent :monster="selectedMonster" />
                    <RollComponent :monster="selectedMonster" @rollDice="(value, rollMode) => rollDice(value, rollMode)" />
                </div>
            </div>
        </div>
        <div class="drawer-side">
            <label for="my-drawer-1" aria-label="close sidebar" class="drawer-overlay"></label>
            <div class="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col">
                <!-- Sidebar content here -->
                <div class="flex-grow space-y-2">
                    <p class="font-bold">Upload JSON Monster file</p>
                    <input type="file" multiple ref="fileInput" class="file-input file-input-bordered file-input-sm w-full max-w-xs" />
                    <button @click="saveJson" class="btn btn-primary w-full">Save</button>
                    <button @click="deleteData" class="btn btn-error w-full">Delete all data</button>
                </div> 
            </div> 
        </div>
    </div>
</template>

<style scoped>

</style>
