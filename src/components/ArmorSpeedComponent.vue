<script setup>
import { ref, toRefs } from 'vue'
import { parseText } from '../parseFunctions';

const props = defineProps({
    monster: Object
})

const { monster } = toRefs(props)

const isBoolean = (value) => {
    return typeof value === 'boolean';
};

</script>

<template>
    <!-- Armor -->
    <div class="px-2">
        <p class="w-full break-words space-x-1">
            <span class="font-bold">Armor</span>
            <span class="font-bold">Class:</span>
            <span v-for="ac_elem in monster.ac" class="break-words space-x-1">
                <span v-if="ac_elem.ac" class="text-primary font-bold">{{ ac_elem.ac }}</span>
                <span v-else-if="ac_elem.special" class="text-primary font-bold">{{ ac_elem.special }}</span>
                <span v-else class="text-primary font-bold">{{ ac_elem }}</span>

                <span v-for="(item, index) in ac_elem.from" >
                    <span v-html="parseText(item)" class="break-words space-x-1"></span>
                    <span v-if="index < ac_elem.from.length - 1">,</span>
                </span>

                <span v-if="ac_elem.condition" v-html="parseText(ac_elem.condition)"></span>
                <span>;</span>
            </span>
        </p>
        <!-- Hit points -->
        <p class="w-full break-words space-x-1">
            <span class="font-bold">Hit</span>
            <span class="font-bold">Points:</span>
            <span v-if="monster.hp.average" class="text-primary font-bold">{{ monster.hp.average }}</span>
            <span v-if="monster.hp.formula" class="">({{ monster.hp.formula }})</span>
            <span v-if="monster.hp.special" class="text-primary font-bold">{{ monster.hp.special }}</span>
        </p>
        <!-- Speed -->
        <p class="w-full break-words space-x-1">
            <span class="font-bold">Speed:</span>
            <span v-for="(item, key) in monster.speed" class="break-words space-x-1">
                <span v-if="!isBoolean(item)" class="space-x-1">
                    <span class="text-primary font-bold" v-if="item.number">{{ item.number }} ft.</span>
                    <span class="text-primary font-bold" v-else>{{ item }} ft.</span>
                    <span class="">{{ key }}</span>
                    <span v-if="item.number">{{ item.condition }}</span>
                    <span>;</span>
                </span>
            </span>
        </p>
        <!-- Challenge Rating -->
        <p v-if="monster.cr" class="w-full break-words space-x-1">
            <span class="font-bold">Challenge:</span>
            <span v-if="monster.cr.cr" class="font-bold text-primary">{{ monster.cr.cr }}</span>
            <span v-else class="font-bold text-primary">{{ monster.cr }}</span>
        </p>
    </div>
</template>

<style scoped></style>