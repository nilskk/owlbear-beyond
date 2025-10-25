<script setup>
import { ref } from 'vue'
import { parseSpecialHp, parseSpecialAc } from '../parseFunctions';
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
</template>

<style scoped>

</style>
