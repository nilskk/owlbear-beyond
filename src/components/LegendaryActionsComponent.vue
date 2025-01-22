<script setup>
import { onMounted, ref, toRefs, onUpdated, nextTick  } from 'vue'
import { parseText } from '../parseFunctions';
import { useRollButtonListeners } from '../composables/useRollButtonListeners';

const props = defineProps({
    monster: Object
})
const { monster } = toRefs(props)

const emit = defineEmits(['rollDice'])

const attachListeners = async () => {
    await nextTick();
    const handleButtonClick = (event) => {
        emit('rollDice', event.target.innerText, "normal");
    };

    const handleButtonRightClick = (event) => {
        emit('rollDice', event.target.innerText, "advantage");
    };

    const handleButtonMiddleClick = (event) => {
        emit('rollDice', event.target.innerText, "disadvantage");
    };

    const buttons = document.getElementsByClassName('rollButton');
    Array.from(buttons).forEach(button => {
        button.addEventListener('click', handleButtonClick);
        button.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            handleButtonRightClick(event);
        });
        button.addEventListener('mousedown', (event) => {
            if (event.button === 1) {
                event.preventDefault();
                handleButtonMiddleClick(event);
            }
        });
    });
};
onMounted(attachListeners);
onUpdated(attachListeners);

</script>

<template>
    <div class="px-2 pt-2 space-y-2">
        <!-- Legendary Actions -->
        <p v-if="monster.legendary" class="w-full break-words space-x-1">
            This creature can take 3 legendary actions, choosing from the options below.
            Only one legendary action option can be used at a time and only at the end of another creature's turn.
            The creature regains spent legendary actions at the start of its turn.
        </p>
        <p v-for="item in monster.legendary" class="w-full break-words space-x-1">
            <span v-html="parseText(item.name)" class="font-bold"></span>
        <p v-for="subitem in item.entries" class="w-full break-words space-x-1">
        <p v-if="subitem.items" class="space-y-2 ps-6">
        <p v-for="subsubitem in subitem.items" class="w-full break-words space-x-1">
            <span v-html="parseText(subsubitem.name)" class="font-semibold"></span>
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