<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CONDITIONS, HAZARDS } from '../../glossary.js'

const myModal = ref(null)
const tooltipState = ref({ visible: false, description: '' })

const openModal = () => {
    myModal.value.showModal()
}

// Combine CONDITIONS and HAZARDS into one object
const allConditions = { ...CONDITIONS, ...HAZARDS }

// Tooltip handlers for modal content
const showModalTooltip = (event) => {
    if (event.target.classList.contains('game-term')) {
        const description = event.target.getAttribute('data-description')
        tooltipState.value = { visible: true, description }
    }
}

const hideModalTooltip = (event) => {
    if (event.target.classList.contains('game-term')) {
        tooltipState.value.visible = false
    }
}

onMounted(() => {
    const modal = myModal.value
    if (modal) {
        modal.addEventListener('mouseenter', showModalTooltip, true)
        modal.addEventListener('mouseleave', hideModalTooltip, true)
    }
})

onUnmounted(() => {
    const modal = myModal.value
    if (modal) {
        modal.removeEventListener('mouseenter', showModalTooltip, true)
        modal.removeEventListener('mouseleave', hideModalTooltip, true)
    }
})

defineExpose({ openModal })
</script>

<template>
    <!-- Book icon button -->
    <button @click="openModal" class="btn btn-primary btn-square btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm0-80h480v-640h-80v280l-100-60-100 60v-280H240v640Zm0 0v-640 640Zm200-360 100-60 100 60-100-60-100 60Z"/>
        </svg>
    </button>

    <!-- Glossary modal -->
    <dialog ref="myModal" class="modal">
        <div class="modal-box max-w-4xl max-h-[80vh] relative">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 class="font-bold text-lg mb-4">Glossary</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[calc(80vh-8rem)] overflow-y-auto">
                <div 
                    v-for="(description, name) in allConditions" 
                    :key="name"
                    class="p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-help game-term"
                    :data-term="name"
                    :data-description="description"
                >
                    <h4 class="font-bold text-accent capitalize">{{ name }}</h4>
                </div>
            </div>
            
            <!-- Tooltip for modal content -->
            <div v-if="tooltipState.visible" 
                 class="absolute alert alert-info alert-soft shadow-lg p-3 w-full pointer-events-none"
                 style="left: 0; bottom: 0; z-index: 10;">
                <div class="text-sm leading-relaxed" v-html="tooltipState.description"></div>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<style scoped>

</style>
