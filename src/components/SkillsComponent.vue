<script setup>
import { ref, toRefs } from 'vue'
import { capitalize } from '../parseFunctions';
import { useRollButtonListeners } from '../composables/useRollButtonListeners';

const props = defineProps({
    monster: Object
})
const {monster} = toRefs(props)

const emit = defineEmits(['rollDice'])
useRollButtonListeners(emit)

</script>

<template>
    <div class="px-2 pt-2 space-y-2">
        <!-- Skills -->
        <p v-if="monster.skill" class="w-full break-words space-x-1">
            <span class="font-bold">Skills:</span>
            <span v-for="(item, key) in monster.skill" class="break-words space-x-1">
                <span class="">{{ capitalize(key) }}</span>
                <button class="btn btn-xs btn-outline btn-secondary font-bold rollButton">{{ item }}</button>
                <span class="">,</span>
            </span>
        </p>
        <!-- Damage Vulnerabilities -->
        <p v-if="monster.vulnerable" class="w-full break-words space-x-1">
            <span class="font-bold">Damage</span>
            <span class="font-bold">Vulnerabilities:</span>
            <span v-for="item in monster.vulnerable" class="break-words space-x-1">
                <span v-if="item.vulnerable" class="break-words space-x-1">
                    <span v-for="(subitem, subindex) in item.vulnerable" class="">{{ capitalize(subitem) }},</span>
                    <span class="">{{ item.note }};</span>
                </span>
                <span v-else-if="item.special" class="">{{ capitalize(item.special) }};</span>
                <span v-else class="">{{ capitalize(item) }};</span>
            </span>
        </p>
        <!-- Damage Resistances -->
        <p v-if="monster.resist" class="w-full break-words space-x-1">
            <span class="font-bold">Damage</span>
            <span class="font-bold">Resistances:</span>
            <span v-for="item in monster.resist" class="break-words space-x-1">
                <span v-if="item.resist" class="break-words space-x-1">
                    <span v-for="(subitem, subindex) in item.resist" class="">{{ capitalize(subitem) }},</span>
                    <span class="">{{ item.note }};</span>
                </span>
                <span v-else-if="item.special" class="">{{ capitalize(item.special) }};</span>
                <span v-else class="">{{ capitalize(item) }};</span>
            </span>
        </p>
        <!-- Damage Immunities -->
        <p v-if="monster.immune" class="w-full break-words space-x-1">
            <span class="font-bold">Damage</span>
            <span class="font-bold">Immunities:</span>
            <span v-for="item in monster.immune" class="break-words space-x-1">
                <span v-if="item.immune" class="break-words space-x-1">
                    <span v-for="(subitem, subindex) in item.immune" class="">{{ capitalize(subitem) }},</span>
                    <span class="">{{ item.note }};</span>
                </span>
                <span v-else-if="item.special" class="">{{ capitalize(item.special) }};</span>
                <span v-else class="">{{ capitalize(item) }};</span>
            </span>
        </p>
        <!-- Condition Immunities -->
        <p v-if="monster.conditionImmune" class="w-full break-words space-x-1">
            <span class="font-bold">Condition</span>
            <span class="font-bold">Immunities:</span>
            <span v-for="item in monster.conditionImmune" class="break-words space-x-1">
                <span v-if="item.conditionImmune" class="break-words space-x-1">
                    <span v-for="(subitem, subindex) in item.conditionImmune" class="break-words space-x-1">
                        {{ capitalize(subitem) }},
                    </span>
                    <span class="">{{ item.note }};</span>
                </span>
                <span v-else-if="item.special" class="">{{ capitalize(item.special) }};</span>
                <span v-else class="">{{ capitalize(item) }};</span>
            </span>
        </p>
        <!-- Senses -->
        <p v-if="monster.senses || monster.passive" class="w-full break-words space-x-1">
            <span class="font-bold">Senses:</span>
            <span v-if="monster.senses" class="w-full break-words space-x-1">
                <span v-for="item in monster.senses" class="break-words space-x-1">
                    <span class="">{{ capitalize(item) }},</span>
                </span>
            </span>
            <span v-if="monster.passive" class="w-full break-words space-x-1">
                <span class="">Passive Perception</span>
                <span class="font-bold text-primary">{{ monster.passive }}</span>
            </span>   
        </p>
        <!-- Languages -->
        <p v-if="monster.languages" class="w-full break-words space-x-1">
            <span class="font-bold">Languages:</span>
            <span v-for="item in monster.languages" class="break-words space-x-1">
                <span class="">{{ capitalize(item) }},</span>
            </span>
        </p>
    </div>
</template>

<style scoped></style>