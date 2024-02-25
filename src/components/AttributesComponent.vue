<script setup>
import { ref, toRefs } from 'vue'

const props = defineProps({
    monster: Object
})

const { monster } = toRefs(props)

const attributeModifier = (attribute) => Math.floor((attribute - 10) / 2);

const emit = defineEmits(['rollDice'])
const handleButtonClick = (event) => {
    console.log(event.target.innerText);
    emit('rollDice', event.target.innerText);
};
</script>

<template>
    <div class="join w-full justify-evenly">
        <!-- STR -->
        <div class="font-bold join-item flex flex-col items-center space-y-1">
            <div class="">STR</div>
            <div class="text-primary ">{{ monster.str }}</div>
            <button class="btn btn-sm btn-outline btn-secondary font-bold" @click="handleButtonClick">
                {{attributeModifier(monster.str) >= 0 ? '+' : '' }}{{attributeModifier(monster.str) }}
            </button>
        </div>
        <div class="divider divider-horizontal m-0"></div>
        <!-- DEX -->
        <div class="font-bold join-item flex flex-col items-center space-y-1">
            <div class="">DEX</div>

            <div class="text-primary">{{ monster.dex }}</div>
            <button class="btn btn-sm btn-outline btn-secondary font-bold" @click="handleButtonClick">
                {{attributeModifier(monster.dex) >= 0 ? '+' : '' }}{{attributeModifier(monster.dex) }}
            </button>

        </div>
        <div class="divider divider-horizontal m-0"></div>
        <!-- CON -->
        <div class="font-bold join-item flex flex-col items-center space-y-1">
            <div class="">CON</div>

            <div class="text-primary">{{ monster.con }}</div>
            <button class="btn btn-sm btn-outline btn-secondary font-bold" @click="handleButtonClick">
                {{attributeModifier(monster.con) >= 0 ? '+' : '' }}{{attributeModifier(monster.con) }}
            </button>

        </div>
        <div class="divider divider-horizontal m-0"></div>
        <!-- INT -->
        <div class="font-bold join-item flex flex-col items-center space-y-1">
            <div class="">INT</div>

            <div class="text-primary">{{ monster.int }}</div>
            <button class="btn btn-sm btn-outline btn-secondary font-bold" @click="handleButtonClick">
                {{attributeModifier(monster.int) >= 0 ? '+' : '' }}{{attributeModifier(monster.int) }}
            </button>

        </div>
        <div class="divider divider-horizontal m-0"></div>
        <!-- WIS -->
        <div class="font-bold join-item flex flex-col items-center space-y-1">
            <div class="">WIS</div>

            <div class="text-primary">{{ monster.wis }}</div>
            <button class="btn btn-sm btn-outline btn-secondary font-bold" @click="handleButtonClick">
                {{attributeModifier(monster.wis) >= 0 ? '+' : '' }}{{attributeModifier(monster.wis) }}
            </button>

        </div>
        <div class="divider divider-horizontal m-0"></div>
        <!-- CHA -->
        <div class="font-bold join-item flex flex-col items-center space-y-1">
            <div class="">CHA</div>

            <div class="text-primary">{{ monster.cha }}</div>
            <button class="btn btn-sm btn-outline btn-secondary font-bold" @click="handleButtonClick">
                {{attributeModifier(monster.cha) >= 0 ? '+' : '' }}{{attributeModifier(monster.cha) }}
            </button>

    </div>
</div></template>

<style scoped></style>