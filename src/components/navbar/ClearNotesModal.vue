<script setup>
import { ref } from 'vue'

const props = defineProps({
    notesCount: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['clearNotes'])

const myModal = ref(null)

const openModal = () => {
    myModal.value.showModal()
}

const confirmClear = () => {
    emit('clearNotes')
    myModal.value.close()
}

defineExpose({ openModal })
</script>

<template>
    <!-- Trash icon button -->
    <button @click="openModal" class="btn btn-primary btn-square btn-ghost" :disabled="notesCount === 0">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
    </button>

    <!-- Confirmation modal -->
    <dialog ref="myModal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Clear All Notes</h3>
            <p class="py-4">Are you sure you want to delete all {{ notesCount }} note{{ notesCount !== 1 ? 's' : '' }}? This action cannot be undone.</p>
            <div class="modal-action">
                <button @click="confirmClear" class="btn btn-error">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </svg>
                    Delete All
                </button>
                <form method="dialog">
                    <button class="btn">Cancel</button>
                </form>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<style scoped>

</style>
