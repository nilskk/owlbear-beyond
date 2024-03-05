<script setup>
import ArmorSpeedComponent from './components/ArmorSpeedComponent.vue';
import AttributesComponent from './components/AttributesComponent.vue';
import SkillsComponent from './components/SkillsComponent.vue';
import TraitsComponent from './components/TraitsComponent.vue';
import SpellsComponent from './components/SpellsComponent.vue';
import ActionsComponent from './components/ActionsComponent.vue';
import BonusActionsComponent from './components/BonusActionsComponent.vue';
import ReactionsComponent from './components/ReactionsComponent.vue';
import LegendaryActionsComponent from './components/LegendaryActionsComponent.vue';
import { ref, toRefs, reactive, computed, onMounted, onBeforeMount, onUpdated, toRaw } from 'vue'
import { vOnClickOutside } from '@vueuse/components'
import { db } from './db'
import { writeBulkToTable, clearTable } from './dbFunctions'
import { rollDiceWithRumble } from './diceFunctions';
import OBR from '@owlbear-rodeo/sdk';

const ID = 'com.nilskk.owlbear-beyond';
const CLASH_LABEL_ID = '56d6b2c4-cd17-11ed-afa1-0242ac120002';

const searchInput = ref('');
const fileInput = ref(null);
const myModal = ref(null);
const playerSelection = ref(null)

const state = reactive({
    // selectedMonster: bestiary.monster[0] || null
    selectedMonster: null
});

const bestiaryTable = ref([]);
onMounted(async () => {
    bestiaryTable.value = await db.bestiary.toArray();
    if (bestiaryTable.value.length > 0) {
        state.selectedMonster = bestiaryTable.value[0];
    }
});

const selectMonster = (monster) => {
    state.selectedMonster = monster;
};

const filteredMonsters = computed(() => {
    if (!searchInput.value) {
        // return bestiary.monster;
        return bestiaryTable.value;
    }
    // return bestiary.monster.filter(monster =>
    //     monster.name.toLowerCase().includes(searchInput.value.toLowerCase())
    // );
    return bestiaryTable.value.filter(monster =>
        monster.name.toLowerCase().includes(searchInput.value.toLowerCase())
    );
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
      writeBulkToTable(monster_list, db.bestiary);
    };
    reader.readAsText(file);
  }
};

const deleteData = () => {
    clearTable(db.bestiary);
};

let lastCreature = null;

function showMonsterSheet(item) {
    if (!item || !item.metadata[`${ID}/monstersheet`]) return;
  
    const dndbeyond = item.metadata[`${ID}/monstersheet`];
    if (dndbeyond === lastCreature) return;
  
    lastCreature = dndbeyond;
    state.selectedMonster = dndbeyond
    
}

function handlePlayerChange(player) {
    if(!player.selection) {
        playerSelection.value = null;
        return;
    } 
    OBR.scene.items.getItems([player.selection[0]]).then((items) => {
        console.log(items);
        showMonsterSheet(items[0]);
        if (items[0].layer == 'CHARACTER') {
            playerSelection.value = items[0]; 
        }
    }); 
}
  
  
function handleClashLabelChange(items) {
    if (!items) return;
    let clashLabelItem = items.filter(item => item.id == CLASH_LABEL_ID)[0];
    console.log(clashLabelItem);
    OBR.scene.items.getItems([clashLabelItem.attachedTo]).then((items) => {
        // console.log(items);
        showMonsterSheet(items[0]);
    }); 
}

OBR.player.onChange(handlePlayerChange);
OBR.scene.local.onChange(handleClashLabelChange);

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
                        item.metadata[`${ID}/monstersheet`] = toRaw(state.selectedMonster);
                    }
                });
            });
        }
    });
    myModal.value.close();
};
</script>

<template>
    <dialog v-if="playerSelection" id="my_modal_2" class="modal" ref="myModal">
        <div class="modal-box">
            <div class="flex flex-col justify-center space-y-3">
                <h1 class="text-xl font-bold">Current: {{ playerSelection.metadata[`${ID}/monstersheet`].name }}</h1>
                <h1 class="text-xl font-bold">New: {{ state.selectedMonster.name }}</h1>
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
                    <div v-if="state.selectedMonster" class="dropdown dropdown-begin" v-on-click-outside="clearInput">
                        <input tabindex="0" type="search" class="input m-1" :placeholder="state.selectedMonster.name"
                            v-model="searchInput" @focus="$event.target.select()">
                        <ul tabindex="0"
                            class="dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-box w-64 h-96 overflow-auto">
                            <li><a v-for="item in filteredMonsters" @click="selectMonster(item)">{{ item.name }}</a></li>
                        </ul>
                    </div>
                </div>
                <div class="flex-none">
                    <button @click="updateTokens" v-if="playerSelection" class="btn btn-primary">Update Token</button>
                    <label for="my-drawer-1" class="drawer-button btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            class="inline-block w-5 h-5 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16">
                            </path>
                        </svg>
                    </label>
                </div>
            </div>
            <div v-if="state.selectedMonster">
                <ArmorSpeedComponent :monster="state.selectedMonster" />
                <div class="divider divider-accent font-bold mb-0">Attributes</div>
                <AttributesComponent :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)"/>
                <div class="divider divider-accent font-bold mb-0">Skills</div>
                <SkillsComponent :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)" />
                <div v-if="state.selectedMonster.trait" class="divider divider-accent font-bold mb-0">Traits</div>
                <TraitsComponent v-if="state.selectedMonster.trait" :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)" />
                <div v-if="state.selectedMonster.spellcasting" class="divider divider-accent font-bold mb-0">Spells</div>
                <SpellsComponent v-if="state.selectedMonster.spellcasting" :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)" />
                <div v-if="state.selectedMonster.action" class="divider divider-accent font-bold mb-0">Actions</div>
                <ActionsComponent v-if="state.selectedMonster.action" :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)" />
                <div v-if="state.selectedMonster.bonus" class="divider divider-accent font-bold mb-0">Bonus Actions</div>
                <BonusActionsComponent v-if="state.selectedMonster.bonus" :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)" />
                <div v-if="state.selectedMonster.reaction" class="divider divider-accent font-bold mb-0">Reactions</div>
                <ReactionsComponent v-if="state.selectedMonster.reaction" :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)" />
                <div v-if="state.selectedMonster.legendary" class="divider divider-accent font-bold mb-0">Legendary Actions</div>
                <LegendaryActionsComponent v-if="state.selectedMonster.legendary" :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)" />
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
                </div>
                <div>
                    <button @click="deleteData" class="btn btn-error w-full">Delete all data</button>
                </div>
            </div> 
        </div>
    </div>
</template>

<style scoped></style>
