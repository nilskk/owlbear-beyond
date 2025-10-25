<script setup>
import { computed } from 'vue'
import { parseText } from '../parseFunctions';
import { useRollButtonListeners } from '../composables/useRollButtonListeners';
import SpellsComponent from './SpellsComponent.vue';

const props = defineProps({
    monster: Object
})

const emit = defineEmits(['rollDiceReaction'])

const spellsAsReactions = computed(() => {
    return props.monster.spellcasting ? props.monster.spellcasting.filter(item => item.displayAs && item.displayAs == 'reaction') : [];
});

useRollButtonListeners(emit, 'rollDiceReaction');



</script>

<template>
    <div v-if="props.monster.reaction || spellsAsReactions.length" class="divider divider-accent font-bold mb-0">Reactions</div>
    <div v-if="props.monster.reaction || spellsAsReactions.length" class="px-2 pt-2 space-y-2">
        <!-- Reactions -->
        <p v-for="item in props.monster.reaction" class="w-full break-words space-x-1">
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
        <!-- Spells as Reactions -->
        <SpellsComponent :spells="spellsAsReactions"/>
    </div>
</template>

<style scoped></style>