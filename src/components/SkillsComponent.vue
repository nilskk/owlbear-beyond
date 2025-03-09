<script setup>
import { onMounted, ref, toRefs, onUpdated, nextTick } from 'vue'
import { capitalize } from '../parseFunctions';
import { useRollButtonListeners } from '../composables/useRollButtonListeners';

const props = defineProps({
    monster: Object
})

const emit = defineEmits(['rollDiceSkill'])

const attachListeners = async () => {
    await nextTick();
    const handleButtonClick = (event) => {
        emit('rollDiceSkill', event.target.innerText, "normal");
    };

    const handleButtonRightClick = (event) => {
        emit('rollDiceSkill', event.target.innerText, "advantage");
    };

    const handleButtonMiddleClick = (event) => {
        emit('rollDiceSkill', event.target.innerText, "disadvantage");
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
    <div class="px-2 pt-2 space-y-2">
        <!-- Skills -->
        <p v-if="props.monster.skill" class="w-full break-words space-x-1">
            <span class="font-bold">Skills:</span>
            <span v-for="(item, key) in props.monster.skill" class="break-words space-x-1">
                <span class="">{{ capitalize(key) }}</span>
                <button class="btn btn-xs btn-outline btn-secondary font-bold rollButton">{{ item }}</button>
                <span class="">,</span>
            </span>
        </p>
        <!-- Damage Vulnerabilities -->
        <p v-if="props.monster.vulnerable" class="w-full break-words space-x-1">
            <span class="font-bold">Damage</span>
            <span class="font-bold">Vulnerabilities:</span>
            <span v-for="item in props.monster.vulnerable" class="break-words space-x-1">
                <span v-if="item.vulnerable" class="break-words space-x-1">
                    <span v-for="(subitem, subindex) in item.vulnerable" class="">{{ capitalize(subitem) }},</span>
                    <span class="">{{ item.note }};</span>
                </span>
                <span v-else-if="item.special" class="">{{ capitalize(item.special) }};</span>
                <span v-else class="">{{ capitalize(item) }};</span>
            </span>
        </p>
        <!-- Damage Resistances -->
        <p v-if="props.monster.resist" class="w-full break-words space-x-1">
            <span class="font-bold">Damage</span>
            <span class="font-bold">Resistances:</span>
            <span v-for="item in props.monster.resist" class="break-words space-x-1">
                <span v-if="item.resist" class="break-words space-x-1">
                    <span v-for="(subitem, subindex) in item.resist" class="">{{ capitalize(subitem) }},</span>
                    <span class="">{{ item.note }};</span>
                </span>
                <span v-else-if="item.special" class="">{{ capitalize(item.special) }};</span>
                <span v-else class="">{{ capitalize(item) }};</span>
            </span>
        </p>
        <!-- Damage Immunities -->
        <p v-if="props.monster.immune" class="w-full break-words space-x-1">
            <span class="font-bold">Damage</span>
            <span class="font-bold">Immunities:</span>
            <span v-for="item in props.monster.immune" class="break-words space-x-1">
                <span v-if="item.immune" class="break-words space-x-1">
                    <span v-for="(subitem, subindex) in item.immune" class="">{{ capitalize(subitem) }},</span>
                    <span class="">{{ item.note }};</span>
                </span>
                <span v-else-if="item.special" class="">{{ capitalize(item.special) }};</span>
                <span v-else class="">{{ capitalize(item) }};</span>
            </span>
        </p>
        <!-- Condition Immunities -->
        <p v-if="props.monster.conditionImmune" class="w-full break-words space-x-1">
            <span class="font-bold">Condition</span>
            <span class="font-bold">Immunities:</span>
            <span v-for="item in props.monster.conditionImmune" class="break-words space-x-1">
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
        <p v-if="props.monster.senses || props.monster.passive" class="w-full break-words space-x-1">
            <span class="font-bold">Senses:</span>
            <span v-if="props.monster.senses" class="w-full break-words space-x-1">
                <span v-for="item in props.monster.senses" class="break-words space-x-1">
                    <span class="">{{ capitalize(item) }},</span>
                </span>
            </span>
            <span v-if="props.monster.passive" class="w-full break-words space-x-1">
                <span class="">Passive Perception</span>
                <span class="font-bold text-primary">{{ props.monster.passive }}</span>
            </span>   
        </p>
        <!-- Languages -->
        <p v-if="props.monster.languages" class="w-full break-words space-x-1">
            <span class="font-bold">Languages:</span>
            <span v-for="item in props.monster.languages" class="break-words space-x-1">
                <span class="">{{ capitalize(item) }},</span>
            </span>
        </p>
    </div>
</template>

<style scoped></style>