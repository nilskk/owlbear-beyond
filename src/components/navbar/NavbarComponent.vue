<script setup>
import UploadModal from './UploadModal.vue';
import LinkTokenModal from './LinkTokenModal.vue';
import MonsterSearchDropdown from './MonsterSearchDropdown.vue';
import ClearNotesModal from './ClearNotesModal.vue';
import GlossaryModal from './GlossaryModal.vue';

const ID = 'com.nilskk.owlbear-beyond';

const props = defineProps({
    selectedMonster: Object,
    groupedBestiary: Object,
    playerSelection: Object,
    isGmView: {
        type: Boolean,
        default: true
    },
    notesCount: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['selectMonster', 'clearNotes'])

const selectMonster = (monster) => {
    emit('selectMonster', monster);
};

const clearNotes = () => {
    emit('clearNotes');
};
</script>

<template>
    <div class="navbar bg-base-300 flex-shrink-0">
        <div  class="flex-1 justify-start">
            <MonsterSearchDropdown 
                v-if="isGmView"
                :selectedMonster="selectedMonster" 
                :groupedBestiary="groupedBestiary"
                @selectMonster="selectMonster"
            />
            <h1 v-else class="text-xl font-bold ml-4">My Custom Rolls</h1>
        </div>
        <div class="flex-none">
            <LinkTokenModal v-if="isGmView" :playerSelection="playerSelection" :selectedMonster="selectedMonster" />
            <UploadModal v-if="isGmView" />
            <ClearNotesModal v-if="!isGmView" :notesCount="notesCount" @clearNotes="clearNotes" />
            <GlossaryModal />
        </div>
    </div>
</template>

<style scoped>

</style>
