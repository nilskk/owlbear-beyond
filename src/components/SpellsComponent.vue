<script setup>
import { defineProps } from 'vue';
import { parseText } from '../parseFunctions';

const props = defineProps({
    spells: Array
});
</script>

<template>
    <p v-for="(item, index) in spells" :key="index" class="w-full break-words space-x-1 space-y-2">
        <span v-html="parseText(item.name)" class="font-bold"></span>
        <span v-for="header in item.headerEntries" :key="header" v-html="parseText(header)" class="w-full break-words space-x-1"></span>
        <p v-if="item.will" class="w-full break-words space-x-1">
            <span class="font-semibold">At will:</span>
            <span v-for="spell in item.will" :key="spell" class="w-full break-words space-x-1">
                <span v-html="parseText(spell)" class="w-full break-words space-x-1"></span>
                <span>,</span>
            </span>
        </p>
        <p v-for="(value, key) in item.daily" :key="key" class="w-full break-words space-x-1">
            <span v-if="key == '1e'" class="font-semibold">1/day each:</span>
            <span v-else-if="key == '2e'" class="font-semibold">2/day each:</span>
            <span v-else-if="key == '3e'" class="font-semibold">3/day each:</span>
            <span v-else-if="key == '4e'" class="font-semibold">4/day each:</span>
            <span v-else-if="key == '5e'" class="font-semibold">5/day each:</span>
            <span v-else-if="key == '6e'" class="font-semibold">6/day each:</span>
            <span v-else-if="key == '7e'" class="font-semibold">7/day each:</span>
            <span v-else-if="key == '8e'" class="font-semibold">8/day each:</span>
            <span v-else-if="key == '9e'" class="font-semibold">9/day each:</span>
            <span v-else-if="key == '1'" class="font-semibold">1/day:</span>
            <span v-else-if="key == '2'" class="font-semibold">2/day:</span>
            <span v-else-if="key == '3'" class="font-semibold">3/day:</span>
            <span v-else-if="key == '4'" class="font-semibold">4/day:</span>
            <span v-else-if="key == '5'" class="font-semibold">5/day:</span>
            <span v-else-if="key == '6'" class="font-semibold">6/day:</span>
            <span v-else-if="key == '7'" class="font-semibold">7/day:</span>
            <span v-else-if="key == '8'" class="font-semibold">8/day:</span>
            <span v-else-if="key == '9'" class="font-semibold">9/day:</span>
            <span v-for="spell in value" :key="spell" class="w-full break-words space-x-1">
                <span v-html="parseText(spell)" class="w-full break-words space-x-1"></span>
                <span>,</span>
            </span>
        </p>
        <p v-for="(value, key) in item.charges" :key="key" class="w-full break-words space-x-1">
            <span v-if="key == '1e'" class="font-semibold">1 charge each:</span>
            <span v-else-if="key == '2e'" class="font-semibold">2 charges:</span>
            <span v-else-if="key == '3e'" class="font-semibold">3 charges:</span>
            <span v-else-if="key == '4e'" class="font-semibold">4 charges:</span>
            <span v-else-if="key == '5e'" class="font-semibold">5 charges:</span>
            <span v-else-if="key == '6e'" class="font-semibold">6 charges:</span>
            <span v-else-if="key == '7e'" class="font-semibold">7 charges:</span>
            <span v-else-if="key == '8e'" class="font-semibold">8 charges:</span>
            <span v-else-if="key == '9e'" class="font-semibold">9 charges:</span>
            <span v-else-if="key == '1'" class="font-semibold">1/day:</span>
            <span v-else-if="key == '2'" class="font-semibold">2/day:</span>
            <span v-else-if="key == '3'" class="font-semibold">3/day:</span>
            <span v-else-if="key == '4'" class="font-semibold">4/day:</span>
            <span v-else-if="key == '5'" class="font-semibold">5/day:</span>
            <span v-else-if="key == '6'" class="font-semibold">6/day:</span>
            <span v-else-if="key == '7'" class="font-semibold">7/day:</span>
            <span v-else-if="key == '8'" class="font-semibold">8/day:</span>
            <span v-else-if="key == '9'" class="font-semibold">9/day:</span>
            <span v-for="spell in value" :key="spell" class="w-full break-words space-x-1">
                <span v-html="parseText(spell)" class="w-full break-words space-x-1"></span>
                <span>,</span>
            </span>
        </p>
        <p v-for="(value, key) in item.spells" :key="key" class="w-full break-words space-x-1">
            <span v-if="key == '0'" class="font-semibold">Cantrips (at will):</span>
            <span v-else-if="key == '1'" class="font-semibold">1st level ({{ value.slots }} slots):</span>
            <span v-else-if="key == '2'" class="font-semibold">2nd level ({{ value.slots }} slots):</span>
            <span v-else-if="key == '3'" class="font-semibold">3rd level ({{ value.slots }} slots):</span>
            <span v-else-if="key == '4'" class="font-semibold">4th level ({{ value.slots }} slots):</span>
            <span v-else-if="key == '5'" class="font-semibold">5th level ({{ value.slots }} slots):</span>
            <span v-else-if="key == '6'" class="font-semibold">6th level ({{ value.slots }} slots):</span>
            <span v-else-if="key == '7'" class="font-semibold">7th level ({{ value.slots }} slots):</span>
            <span v-else-if="key == '8'" class="font-semibold">8th level ({{ value.slots }} slots):</span>
            <span v-else-if="key == '9'" class="font-semibold">9th level ({{ value.slots }} slots):</span>
            <span v-for="spell in value.spells" :key="spell" class="w-full break-words space-x-1">
                <span v-html="parseText(spell)" class="w-full break-words space-x-1"></span>
                <span>,</span>
            </span>
        </p>
        <p v-for="header in item.footerEntries" :key="header" v-html="parseText(header)" class="w-full break-words space-x-1"></p>
    </p>
</template>

<style scoped></style>