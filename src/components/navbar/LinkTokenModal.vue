<script setup>
import { ref } from 'vue'
import { parseSpecialHp, parseSpecialAc } from '../../parseFunctions';
import OBR from '@owlbear-rodeo/sdk';

const ID = 'com.nilskk.owlbear-beyond';
const GRIMOIRE_ID = 'com.bitperfect-software.hp-tracker'

const props = defineProps({
    playerSelection: Object,
    selectedMonster: Object
})

const myModal = ref(null);

const openModal = () => {
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
                        item.metadata[`${ID}/monstersheet`] = JSON.parse(JSON.stringify(props.selectedMonster))
                        item.metadata[`${GRIMOIRE_ID}/data`] = {};
                        item.metadata[`${GRIMOIRE_ID}/data`]["acOnMap"] = false;
                        if(Number.isInteger(props.selectedMonster.ac[0])) {
                            item.metadata[`${GRIMOIRE_ID}/data`]["armorClass"] = props.selectedMonster.ac[0];
                        } 
                        else if (props.selectedMonster.ac[0].ac) {
                            item.metadata[`${GRIMOIRE_ID}/data`]["armorClass"] = props.selectedMonster.ac[0].ac;
                        }
                        else if (props.selectedMonster.ac[0].special) {
                            item.metadata[`${GRIMOIRE_ID}/data`]["armorClass"] = parseSpecialAc(props.selectedMonster.ac[0].special);
                        }
                        item.metadata[`${GRIMOIRE_ID}/data`]['equipment'] = {
                            "attuned": [],
                            "eqipped": [],
                        }
                        item.metadata[`${GRIMOIRE_ID}/data`]['hp'] = props.selectedMonster.hp.average || parseSpecialHp(props.selectedMonster.hp.special);
                        item.metadata[`${GRIMOIRE_ID}/data`]['hpBar'] = false;
                        item.metadata[`${GRIMOIRE_ID}/data`]['hpOnMap'] = false;
                        item.metadata[`${GRIMOIRE_ID}/data`]['hpTrackerActive'] = true;
                        item.metadata[`${GRIMOIRE_ID}/data`]["initiative"] = 10 + Math.floor((props.selectedMonster.dex - 10) / 2);
                        item.metadata[`${GRIMOIRE_ID}/data`]['maxHp'] = props.selectedMonster.hp.average || parseSpecialHp(props.selectedMonster.hp.special);
                        item.metadata[`${GRIMOIRE_ID}/data`]["playerList"] = false;
                        item.metadata[`${GRIMOIRE_ID}/data`]["playerMap"] = {
                            "hp": false,
                            "ac": false,
                        };
                        item.metadata[`${GRIMOIRE_ID}/data`]["ruleset"] = "e5";
                        item.metadata[`${GRIMOIRE_ID}/data`]["sheet"] = "";
                        item.metadata[`${GRIMOIRE_ID}/data`]["stats"] = {
                            "initial": true,
                            "initiativeBonus": Math.floor((props.selectedMonster.dex - 10) / 2),
                            "limits": [{"id": "Hit Dice", "max": 1, "resets": ["Long Rest"], "used": 0}],
                        }
                    }
                });
            });
        }
    });
    myModal.value.close();
};

defineExpose({ openModal });
</script>

<template>
    <!-- Button to trigger the modal -->
    <button @click="openModal" v-if="playerSelection" class="btn btn-primary btn-square btn-ghost">
        <!-- Update icon for existing token -->
        <svg v-if="playerSelection.metadata[`${ID}/monstersheet`]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        <!-- Link icon for new token -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
    </button>

    <!-- Modal dialog -->
    <dialog v-if="playerSelection" id="my_modal_2" class="modal" ref="myModal">
        <div class="modal-box">
            <div class="flex flex-col justify-center space-y-3">
                <h1 v-if="playerSelection.metadata[`${ID}/monstersheet`]" class="text-xl font-bold">Current: {{ playerSelection.metadata[`${ID}/monstersheet`].name }}</h1>
                <h1 class="text-xl font-bold">New: {{ selectedMonster.name }}</h1>
                <button @click="confirmTokenUpdate" class="btn btn-primary">
                    <!-- Update icon for existing token -->
                    <svg v-if="playerSelection.metadata[`${ID}/monstersheet`]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <!-- Link icon for new token -->
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>
                    <span v-if="playerSelection.metadata[`${ID}/monstersheet`]">Update Token</span>
                    <span v-else>Link Token</span>
                </button>
            </div>
            
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<style scoped>

</style>
