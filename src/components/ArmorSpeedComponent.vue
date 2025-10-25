<script setup>
import { ref, toRefs } from 'vue'
import { parseText } from '../parseFunctions';

const props = defineProps({
    monster: Object
})

const isBoolean = (value) => {
    return typeof value === 'boolean';
};

</script>

<template>
    <!-- Armor, HP, Speed, and CR in a vertical layout -->
    <div class="flex flex-col gap-2 px-2 py-2 bg-base-200 rounded-lg text-sm">
        <!-- Armor Class -->
        <div class="flex items-baseline gap-1">
            <span class="font-bold flex-shrink-0">🛡️</span>
            <span class="inline-flex items-baseline flex-wrap gap-1">
                <span v-for="ac_elem in props.monster.ac" class="inline-flex items-baseline flex-wrap gap-1">
                    <span v-if="ac_elem.ac" class="text-primary font-bold whitespace-nowrap">{{ ac_elem.ac }}</span>
                    <span v-else-if="ac_elem.special" class="text-primary font-bold whitespace-nowrap">{{ ac_elem.special }}</span>
                    <span v-else class="text-primary font-bold whitespace-nowrap">{{ ac_elem }}</span>

                    <span v-if="ac_elem.from" class="whitespace-nowrap">
                        (<span v-for="(item, index) in ac_elem.from">
                            <span v-html="parseText(item)"></span><span v-if="index < ac_elem.from.length - 1">, </span>
                        </span>)
                    </span>

                    <span v-if="ac_elem.condition" class="whitespace-nowrap" v-html="parseText(ac_elem.condition)"></span>
                </span>
            </span>
        </div>

        <!-- Hit Points -->
        <div class="flex items-baseline gap-1">
            <span class="font-bold flex-shrink-0">❤️</span>
            <span class="inline-flex items-baseline flex-wrap gap-1">
                <span v-if="props.monster.hp.average" class="text-primary font-bold whitespace-nowrap">{{ props.monster.hp.average }}</span>
                <span v-if="props.monster.hp.formula" class="opacity-70 whitespace-nowrap">({{ props.monster.hp.formula }})</span>
                <span v-if="props.monster.hp.special" class="text-primary font-bold">{{ props.monster.hp.special }}</span>
            </span>
        </div>

        <!-- Speed -->
        <div class="flex items-baseline gap-1">
            <span class="font-bold flex-shrink-0">👟</span>
            <template v-for="(item, key, index) in props.monster.speed">
                <span v-if="!isBoolean(item)" class="inline-flex items-baseline">
                    <span v-if="key !== 'walk'" class="mr-1 whitespace-nowrap">{{ key }}</span>
                    <span class="text-primary font-bold whitespace-nowrap">
                        <span v-if="item.number">{{ item.number }}</span>
                        <span v-else>{{ item }}</span>
                    </span>
                    <span class="ml-1 whitespace-nowrap">ft.</span>
                    <span v-if="item.condition" class="opacity-70 ml-1 whitespace-nowrap">{{ item.condition }}</span>
                    <span v-if="index < Object.keys(props.monster.speed).length - 1" class="mx-1">;</span>
                </span>
            </template>
        </div>

        <!-- Challenge Rating -->
        <div v-if="props.monster.cr" class="flex items-baseline gap-1">
            <span class="font-bold flex-shrink-0">⚔️</span>
            <span v-if="props.monster.cr.cr" class="font-bold text-primary whitespace-nowrap">{{ props.monster.cr.cr }}</span>
            <span v-else class="font-bold text-primary whitespace-nowrap">{{ props.monster.cr }}</span>
        </div>
    </div>
</template>

<style scoped></style>