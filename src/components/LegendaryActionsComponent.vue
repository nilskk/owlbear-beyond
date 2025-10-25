<script setup>
import { computed } from 'vue'
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

useRollButtonListeners(emit, 'rollDiceLegendaryAction');



</script>

<template>
    <div v-if="props.monster.legendary || spellsAsLegendaryActions.length" class="divider divider-accent text-sm font-bold mb-0 mt-1">Legendary Actions</div>
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