<script setup>
import { ref, computed } from 'vue'
import { vOnClickOutside } from '@vueuse/components'

const props = defineProps({
    selectedMonster: Object,
    groupedBestiary: Object
})

const emit = defineEmits(['selectMonster'])

const searchInput = ref('');

const filteredGroupedBestiary = computed(() => {
    if (!searchInput.value) {
        return props.groupedBestiary;
    }
    const filtered = {};
    for (const source in props.groupedBestiary) {
        filtered[source] = props.groupedBestiary[source].filter(monster =>
            monster.name.toLowerCase().includes(searchInput.value.toLowerCase())
        );
    }
    return filtered;
});

const clearInput = () => {
    searchInput.value = '';
};

const selectMonster = (monster) => {
    emit('selectMonster', monster);
    clearInput();
};
</script>

<template>
    <div v-if="selectedMonster" class="dropdown dropdown-begin z-50" v-on-click-outside="clearInput">
        <input tabindex="0" type="search" class="input m-1" :placeholder="selectedMonster.name"
            v-model="searchInput" @focus="$event.target.select()">
        <ul tabindex="0"
            class="dropdown-content menu menu-vertical p-2 shadow-2xl bg-base-100 rounded-box">
            <div className="overflow-y-auto max-h-96 w-64">
                <li v-for="(monsters, source) in filteredGroupedBestiary" :key="source">
                    <details open>
                        <summary>{{ source }}</summary>
                        <ul>
                            <li v-for="monster in monsters" :key="monster.name">
                                <a @click="selectMonster(monster)">{{ monster.name }}</a>
                            </li>
                        </ul>
                    </details>
                    
                </li>
            </div>
        </ul>
    </div>
</template>

<style scoped>

</style>
