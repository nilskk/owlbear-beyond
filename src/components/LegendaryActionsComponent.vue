<script setup>
import { onMounted, ref, toRefs, onUpdated, nextTick, computed  } from 'vue'
import { parseText } from '../parseFunctions';
import { useRollButtonListeners } from '../composables/useRollButtonListeners';
import SpellsComponent from './SpellsComponent.vue';

const props = defineProps({
    monster: Object
})

const emit = defineEmits(['rollDiceLegendaryAction'])

const spellsAsLegendaryActions = computed(() => {
    return props.monster.spellcasting ? props.monster.spellcasting.filter(item => item.displayAs && item.displayAs == 'legendary') : [];
});

const attachListeners = async () => {
    await nextTick();
    const handleButtonClick = (event) => {
        emit('rollDiceLegendaryAction', event.target.innerText, "normal");
    };

    const handleButtonRightClick = (event) => {
        emit('rollDiceLegendaryAction', event.target.innerText, "advantage");
    };

    const handleButtonMiddleClick = (event) => {
        emit('rollDiceLegendaryAction', event.target.innerText, "disadvantage");
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
    <div v-if="props.monster.legendary || spellsAsLegendaryActions.length" class="divider divider-accent font-bold mb-0">Legendary Actions</div>
    <div v-if="props.monster.legendary || spellsAsLegendaryActions.length" class="px-2 pt-2 space-y-2">
        <!-- Legendary Actions -->
        <p v-if="props.monster.legendary" class="w-full break-words space-x-1">
            This creature can take 3 legendary actions, choosing from the options below.
            Only one legendary action option can be used at a time and only at the end of another creature's turn.
            The creature regains spent legendary actions at the start of its turn.
        </p>
        <p v-for="item in props.monster.legendary" class="w-full break-words space-x-1">
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
        <!-- Spells as Legendary -->
        <SpellsComponent :spells="spellsAsLegendaryActions"/>
    </div>
</template>

<style scoped></style>