<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      ref="contextMenu"
      class="fixed z-50 bg-base-100 border border-base-300 rounded-lg shadow-lg py-2 w-48"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
      @click.stop
    >
      <!-- Buttons based on dice text type -->
      <div class="px-2 py-2 flex flex-col gap-2">
        <!-- Show Advantage/Disadvantage for attack rolls (starts with + or -) -->
        <template v-if="isAttackRoll">
          <button @click="rollWithAdvantage" class="btn btn-sm btn-primary">
            Advantage
          </button>
          <button @click="rollWithDisadvantage" class="btn btn-sm btn-secondary">
            Disadvantage
          </button>
        </template>
        <!-- Show Crit for damage rolls (starts with dice notation) -->
        <template v-else>
          <button @click="rollWithCrit" class="btn btn-sm btn-accent">
            Crit
          </button>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { watch, onUnmounted, computed } from 'vue'
import { useGlobalContextMenu } from '../composables/useGlobalContextMenu.js'

const { 
  isVisible, 
  position, 
  currentModeIndex,
  critEnabled,
  currentDiceText,
  close, 
  executeRoll 
} = useGlobalContextMenu()

// Check if the dice text is an attack roll (starts with + or -)
const isAttackRoll = computed(() => {
  const text = currentDiceText.value.trim()
  return text.startsWith('+') || text.startsWith('-')
})

const rollWithAdvantage = () => {
  currentModeIndex.value = 1
  critEnabled.value = false
  executeRoll()
}

const rollWithDisadvantage = () => {
  currentModeIndex.value = -1
  critEnabled.value = false
  executeRoll()
}

const rollWithCrit = () => {
  currentModeIndex.value = 0
  critEnabled.value = true
  executeRoll()
}

// Close menu when clicking outside
const handleDocumentClick = (event) => {
  if (isVisible.value) {
    const contextMenuElement = document.querySelector('.fixed.z-50.bg-base-100')
    if (contextMenuElement && !contextMenuElement.contains(event.target)) {
      close()
    }
  }
}

// Watch for visibility changes to manage document listeners
watch(isVisible, (newVal) => {
  if (newVal) {
    // Remove any existing listener first
    document.removeEventListener('click', handleDocumentClick)
    // Add the listener with a slight delay to prevent immediate closing
    setTimeout(() => {
      document.addEventListener('click', handleDocumentClick)
    }, 100)
  } else {
    document.removeEventListener('click', handleDocumentClick)
  }
})

// Cleanup on component unmount
onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>