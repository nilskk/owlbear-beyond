<script setup>
import { ref, toRefs } from 'vue'
import { parseText } from '../parseFunctions';

const props = defineProps({
    monster: Object
})
const { monster } = toRefs(props)

const emit = defineEmits(['rollDice'])
const handleButtonClick = (event) => {
    console.log(event.target.innerText);
    emit('rollDice', event.target.innerText);
};
</script>

<template>
    <div class="px-2 pt-2 space-y-2" @click="handleButtonClick">
        <!-- Legendary Actions -->
        <p v-if="monster.legendary" class="w-full break-words space-x-1">
            This creature can take 3 legendary actions, choosing from the options below.
            Only one legendary action option can be used at a time and only at the end of another creature's turn.
            The creature regains spent legendary actions at the start of its turn.
        </p>
        <p v-for="item in monster.legendary" class="w-full break-words space-x-1">
            <span class="font-bold">{{ item.name }}</span>
        <p v-for="subitem in item.entries" class="w-full break-words space-x-1">
        <p v-if="subitem.items" class="space-y-2 ps-6">
        <p v-for="subsubitem in subitem.items" class="w-full break-words space-x-1">
            <span class="font-semibold">{{ subsubitem.name }}:</span>
            <span v-for="subsubsubitem in subsubitem.entries" v-html="parseText(subsubsubitem)"
                class="w-full break-words space-x-1 "></span>
            <span v-html="parseText(subsubitem.entry)"></span>
        </p>

        </p>
        <span v-else v-html="parseText(subitem)"></span>
        </p>
        </p>
    </div>
</template>

<style scoped></style>