<script setup>
import { onMounted, ref, toRefs, onUpdated, nextTick, computed  } from 'vue'
import { parseText } from '../parseFunctions';
import { useRollButtonListeners } from '../composables/useRollButtonListeners';
import SpellsComponent from './SpellsComponent.vue';

const props = defineProps({
    monster: Object
})

const emit = defineEmits(['rollDice'])

const spellsAsBonusActions = computed(() => {
    return props.monster.spellcasting ? props.monster.spellcasting.filter(item => item.displayAs && item.displayAs == 'bonus') : [];
});

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
    <div v-if="props.monster.bonus || spellsAsBonusActions.length" class="divider divider-accent font-bold mb-0">Bonus Actions</div>
    <div v-if="props.monster.bonus || spellsAsBonusActions.length" class="px-2 pt-2 space-y-2">
        <!-- Bonus Actions -->
        <p v-for="item in props.monster.bonus" class="w-full break-words space-x-1">
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
        <!-- Spells as Bonus Actions -->
        <SpellsComponent :spells="spellsAsBonusActions"/>
    </div>
</template>

<style scoped></style>