import { ref } from 'vue'

const isVisible = ref(false)
const position = ref({ x: 0, y: 0 })
const currentModeIndex = ref(0)
const critEnabled = ref(false)
const currentDiceText = ref('')
const currentEmitFunction = ref(null)

export function useGlobalContextMenu() {
  const open = (event, diceText, emitFn) => {
    event.preventDefault()
    currentDiceText.value = diceText
    currentEmitFunction.value = emitFn
    
    // Calculate position with boundary checking
    const menuWidth = 192 // w-48 = 192px
    const menuHeight = 150 // Approximate height for the menu with 3 buttons
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    let x = event.clientX
    let y = event.clientY
    
    // Check right boundary
    if (x + menuWidth > viewportWidth) {
      x = viewportWidth - menuWidth - 10 // 10px padding from edge
    }
    
    // Check bottom boundary
    if (y + menuHeight > viewportHeight) {
      y = viewportHeight - menuHeight - 10 // 10px padding from edge
    }
    
    // Ensure minimum distance from edges
    x = Math.max(10, x) // At least 10px from left edge
    y = Math.max(10, y) // At least 10px from top edge
    
    position.value = {
      x: x,
      y: y
    }
    
    // Reset values
    currentModeIndex.value = 0
    critEnabled.value = false
    
    isVisible.value = true
  }

  const close = () => {
    isVisible.value = false
    currentDiceText.value = ''
    currentEmitFunction.value = null
  }

  const executeRoll = () => {
    if (currentEmitFunction.value && currentDiceText.value) {
      let rollMode = 'normal'
      
      if (currentModeIndex.value > 0) {
        rollMode = 'advantage'
      } else if (currentModeIndex.value < 0) {
        rollMode = 'disadvantage'
      }
      
      if (critEnabled.value) {
        rollMode = 'crit'
      }
      
      currentEmitFunction.value(currentDiceText.value, rollMode)
    }
    close()
  }

  return {
    isVisible,
    position,
    currentModeIndex,
    critEnabled,
    currentDiceText,
    open,
    close,
    executeRoll
  }
}
