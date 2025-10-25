<script setup>
import { computed } from 'vue'
import { parseText } from '../parseFunctions';
import { useRollButtonListeners } from '../composables/useRollButtonListeners';
import SpellsComponent from './SpellsComponent.vue';

const props = defineProps({
    monster: Object
})

const emit = defineEmits(['rollDiceTrait'])

const spellsWithoutDisplayAs = computed(() => {
    return props.monster.spellcasting ? props.monster.spellcasting.filter(item => !('displayAs' in item)) : [];
});

useRollButtonListeners(emit, 'rollDiceTrait');



</script>

<template>
    <div v-if="props.monster.trait || spellsWithoutDisplayAs.length" class="divider divider-accent text-sm font-bold mb-0 mt-1">Traits</div>
    <div v-if="props.monster.trait || spellsWithoutDisplayAs.length" class="px-2 pt-2 space-y-2">
        <!-- Traits -->
        <p v-for="item in props.monster.trait" class="w-full break-words space-x-1">
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
        <!-- Spells -->
        <SpellsComponent :spells="spellsWithoutDisplayAs" />
    </div>
</template>

<style scoped></style>