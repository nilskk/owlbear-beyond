<script setup>
import { computed } from 'vue';
import { capitalize } from '../parseFunctions';
import { useRollButtonListeners } from '../composables/useRollButtonListeners';

const props = defineProps({
    monster: Object
})

const emit = defineEmits(['rollDiceSkill'])

// Parse skill value to extract all modifiers (base and conditionals)
const parseSkillValue = (skillValue) => {
    // Find all modifiers in the format +X or -X
    const modifierRegex = /([+-]\d+)/g;
    const modifiers = [];
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = modifierRegex.exec(skillValue)) !== null) {
        // Add text before this modifier as plain text
        if (match.index > lastIndex) {
            const textBefore = skillValue.substring(lastIndex, match.index);
            if (textBefore.trim()) {
                parts.push({ type: 'text', value: textBefore });
            }
        }
        
        // Add the modifier as a button
        parts.push({ type: 'button', value: match[1] });
        lastIndex = match.index + match[1].length;
    }
    
    // Add any remaining text after the last modifier
    if (lastIndex < skillValue.length) {
        const textAfter = skillValue.substring(lastIndex);
        if (textAfter.trim()) {
            parts.push({ type: 'text', value: textAfter });
        }
    }
    
    return {
        parts,
        hasButtons: parts.some(p => p.type === 'button')
    };
}

// Compute parsed skills once
const parsedSkills = computed(() => {
    if (!props.monster.skill) return [];
    
    return Object.entries(props.monster.skill).map(([key, value]) => ({
        name: key,
        originalValue: value,
        parsed: parseSkillValue(value)
    }));
});

useRollButtonListeners(emit, 'rollDiceSkill');

</script>

<template>
    <div class="px-2 pt-2 space-y-2">
        <!-- Skills -->
        <p v-if="props.monster.skill" class="w-full break-words space-x-1">
            <span class="font-bold">Skills:</span>
            <span v-for="skill in parsedSkills" :key="skill.name" class="break-words space-x-1">
                <span class="">{{ capitalize(skill.name) }}</span>
                <template v-if="skill.parsed.hasButtons">
                    <template v-for="(part, index) in skill.parsed.parts" :key="index">
                        <button v-if="part.type === 'button'" class="btn btn-xs btn-outline btn-secondary font-bold rollButton">{{ part.value }}</button>
                        <span v-else class="text-sm text-base-content/70">{{ part.value }}</span>
                    </template>
                </template>
                <span v-else class="text-primary">{{ skill.originalValue }}</span>
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