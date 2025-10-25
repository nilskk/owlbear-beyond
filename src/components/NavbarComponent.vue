<script setup>
import { ref, computed } from 'vue'
import UploadModal from './UploadModal.vue';

const ID = 'com.nilskk.owlbear-beyond';

const props = defineProps({
    selectedMonster: Object,
    groupedBestiary: Object,
    playerSelection: Object
})

const emit = defineEmits(['selectMonster', 'updateTokens'])

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

const selectMonster = (monster) => {
    emit('selectMonster', monster);
};

const updateTokens = () => {
    emit('updateTokens');
};
</script>

<template>
    <div class="navbar bg-base-300">
        <div  class="flex-1 justify-start">
            <div v-if="selectedMonster" class="dropdown dropdown-begin z-50">
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
        </div>
        <div class="flex-none">
            <button @click="updateTokens" v-if="playerSelection" class="btn btn-primary">
                <a v-if="playerSelection.metadata[`${ID}/monstersheet`]">Update Token</a>
                <a v-else>Link Token</a>
            </button>
            <UploadModal />
        </div>
    </div>
</template>

<style scoped>

</style>
