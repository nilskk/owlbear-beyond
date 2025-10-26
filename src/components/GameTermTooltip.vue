<template>
    <!-- Hover Tooltip for Game Terms -->
    <div v-if="tooltipState.visible" 
         class="fixed alert alert-info alert-soft shadow-lg p-3 w-full max-w-full pointer-events-none"
         style="left: 50%; bottom: 0; transform: translateX(-50%); z-index: 9999;">
        <div class="text-sm leading-relaxed" v-html="tooltipState.description"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Tooltip state
const tooltipState = ref({ visible: false, term: '', description: '', x: 0, y: 0 })

// Tooltip functions
const showTooltip = (event, term, description) => {
    // Center the tooltip horizontally and vertically in the viewport
    const x = window.innerWidth / 2
    const y = window.innerHeight / 2
    
    tooltipState.value = {
        visible: true,
        term,
        description,
        x,
        y
    }
}

const hideTooltip = () => {
    tooltipState.value.visible = false
}

// Event listener setup
const setupEventListeners = () => {
    // Use event delegation to handle hover events on dynamically added game terms
    document.addEventListener('mouseenter', (event) => {
        if (event.target.classList.contains('game-term')) {
            // Don't show tooltip if inside a modal
            if (event.target.closest('.modal')) {
                return
            }
            const term = event.target.getAttribute('data-term')
            const description = event.target.getAttribute('data-description')
            showTooltip(event, term, description)
        }
    }, true) // Use capture phase for better event handling
    
    document.addEventListener('mouseleave', (event) => {
        if (event.target.classList.contains('game-term')) {
            hideTooltip()
        }
    }, true)
}

const removeEventListeners = () => {
    document.removeEventListener('mouseenter', setupEventListeners)
    document.removeEventListener('mouseleave', setupEventListeners)
}

// Lifecycle hooks
onMounted(() => {
    setupEventListeners()
})

onUnmounted(() => {
    removeEventListeners()
})
</script>
