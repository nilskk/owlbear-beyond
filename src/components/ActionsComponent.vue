<script setup>
import { ref, toRefs, onMounted } from 'vue'
import { parseText } from '../parseFunctions';
import { useRollButtonListeners } from '../composables/useRollButtonListeners';


const props = defineProps({
    monster: Object
})
const { monster } = toRefs(props)

const emit = defineEmits(['rollDice'])
useRollButtonListeners(emit)

</script>

<template>
    <div class="px-2 pt-2 space-y-2">
        <!-- Actions -->
        <p v-for="item in monster.action" class="w-full break-words space-x-1">
            <span v-html="parseText(item.name)" class="font-bold"></span>
        <p v-for="subitem in item.entries" class="w-full break-words space-x-1">
        <p v-if="subitem.items" class="space-y-1 ps-6">
        <p v-for="subsubitem in subitem.items" class="w-full break-words space-x-1">
            <span v-html="parseText(subsubitem.name)" class="font-semibold"></span>
            <span v-for="subsubsubitem in subsubitem.entries" v-html="parseText(subsubsubitem)"
                class="w-full break-words space-x-1 "></span>
            <span v-html="parseText(subsubitem.entry)" class=""></span>
        </p>

        </p>
        <span v-else v-html="parseText(subitem)" class=""></span>
        </p>
        </p>
    </div>
</template>

<style scoped></style>