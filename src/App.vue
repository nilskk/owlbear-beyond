<script setup>
import ArmorSpeedComponent from './components/ArmorSpeedComponent.vue';
import AttributesComponent from './components/AttributesComponent.vue';
import SkillsComponent from './components/SkillsComponent.vue';
import TraitsComponent from './components/TraitsComponent.vue';
import ActionsComponent from './components/ActionsComponent.vue';
import BonusActionsComponent from './components/BonusActionsComponent.vue';
import ReactionsComponent from './components/ReactionsComponent.vue';
import LegendaryActionsComponent from './components/LegendaryActionsComponent.vue';
import { ref, toRefs, reactive, computed } from 'vue'
import { vOnClickOutside } from '@vueuse/components'
import bestiary from './assets/bestiary-mm.json'
import { rollDiceWithRumble } from './diceFunctions';

const searchInput = ref('');

const state = reactive({
    selectedMonster: bestiary.monster[0] || null // set the default value to the first monster or null if the monsters array is empty
});
const selectMonster = (monster) => {
    state.selectedMonster = monster;
};

const filteredMonsters = computed(() => {
    if (!searchInput.value) {
        return bestiary.monster;
    }
    return bestiary.monster.filter(monster =>
        monster.name.toLowerCase().includes(searchInput.value.toLowerCase())
    );
});

const clearInput = () => {
    searchInput.value = '';
};



</script>

<template>
    <div class="navbar bg-base-300">
        <div class="flex-1 justify-center">
            <div class="dropdown dropdown-begin" v-on-click-outside="clearInput">
                <input tabindex="0" type="search" class="input m-1" :placeholder="state.selectedMonster.name"
                    v-model="searchInput" @focus="$event.target.select()">
                <ul tabindex="0"
                    class="dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-box w-64 h-64 overflow-auto">
                    <li><a v-for="item in filteredMonsters" @click="selectMonster(item)">{{ item.name }}</a></li>
                </ul>
            </div>
        </div>
        <div class="flex-1 justify-center">
            <input type="text" :value="state.selectedMonster.hp.average" class="input input-sm input-bordered w-16"
                @focus="$event.target.select()" />
            <a class="text-xl">&nbsp;/&nbsp;</a>
            <a class="text-primary text-xl font-bold">{{ state.selectedMonster.hp.average }}</a>
        </div>
        <div class="flex-none">
            <button class="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="inline-block w-5 h-5 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16">
                    </path>
                </svg>
            </button>
        </div>
    </div>
    <ArmorSpeedComponent :monster="state.selectedMonster" />
    <div class="divider divider-accent font-bold mb-0">Attributes</div>
    <AttributesComponent :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)"/>
    <div class="divider divider-accent font-bold mb-0">Skills</div>
    <SkillsComponent :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)" />
    <div v-if="state.selectedMonster.trait" class="divider divider-accent font-bold mb-0">Traits</div>
    <TraitsComponent :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)" />
    <div v-if="state.selectedMonster.action" class="divider divider-accent font-bold mb-0">Actions</div>
    <ActionsComponent :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)" />
    <div v-if="state.selectedMonster.bonus" class="divider divider-accent font-bold mb-0">Bonus Actions</div>
    <BonusActionsComponent :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)" />
    <div v-if="state.selectedMonster.reaction" class="divider divider-accent font-bold mb-0">Reactions</div>
    <ReactionsComponent :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)" />
    <div v-if="state.selectedMonster.legendary" class="divider divider-accent font-bold mb-0">Legendary Actions</div>
    <LegendaryActionsComponent :monster="state.selectedMonster" @rollDice="(value) => rollDiceWithRumble(value)" />
</template>

<style scoped></style>
