<script setup>
import { ref, onMounted } from 'vue'
import OBR from '@owlbear-rodeo/sdk'
import { parseText } from './parseFunctions.js'
import { useRollButtonListeners } from './composables/useRollButtonListeners.js'
import GlobalRollContextMenu from './components/GlobalRollContextMenu.vue'
import DiceRollDisplay from './components/DiceRollDisplay.vue'
import { rollDiceWithDiceRoller } from './diceFunctions.js'

const ID = 'com.nilskk.owlbear-beyond'
const notes = ref([])
const newNoteText = ref('')
const editingIndex = ref(null)
const editingText = ref('')
const isSaving = ref(false)
const lastSaved = ref(null)
const lastDiceRolls = ref([])
const diceRollsVisible = ref(false)
const diceRollResult = ref(null)
let timeoutId = null

const showDiceRolls = () => {
    diceRollsVisible.value = true
}

const addRollToHistory = (rollResult) => {
    const rollWithInfo = {
        ...rollResult,
        monster: { name: 'Player Roll', id: 'player' }
    }
    
    // Add to beginning of array and keep only last 3
    lastDiceRolls.value.unshift(rollWithInfo)
    if (lastDiceRolls.value.length > 3) {
        lastDiceRolls.value = lastDiceRolls.value.slice(0, 3)
    }
}

const toggleDiceRolls = () => {
    if (diceRollsVisible.value) {
        diceRollsVisible.value = false
    } else if (lastDiceRolls.value.length > 0) {
        diceRollsVisible.value = true
    }
}

const rollDice = (value, rollMode) => {
    diceRollResult.value = null
    
    const result = rollDiceWithDiceRoller(value, rollMode, value)
    console.log(result)
    
    // Store simple result for backward compatibility
    diceRollResult.value = result.simple
    
    // Add detailed result to history
    if (result.detailed) {
        addRollToHistory(result.detailed)
    }
    
    // Show dice rolls
    showDiceRolls()
    
    if (timeoutId) {
        clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
        diceRollResult.value = null
        timeoutId = null
    }, 5000)
}

// Create a fake emit object that calls rollDice directly
const fakeEmit = (eventName, diceText, rollMode) => {
    rollDice(diceText, rollMode)
}

// Attach roll button listeners with our fake emit
useRollButtonListeners(fakeEmit, 'rollDice')

onMounted(async () => {
    await OBR.onReady(async () => {
        // Load saved notes from player metadata
        const metadata = await OBR.player.getMetadata()
        console.log('Loaded metadata:', metadata)
        console.log('Notes key:', `${ID}/notes`)
        console.log('Notes value:', metadata[`${ID}/notes`])
        
        if (metadata[`${ID}/notes`]) {
            notes.value = metadata[`${ID}/notes`]
            console.log('Restored notes:', notes.value)
        }
    })
})

const saveNotes = async () => {
    isSaving.value = true
    try {
        // Create a clean copy of notes with only serializable data
        const cleanNotes = notes.value.map(note => ({
            id: note.id,
            text: note.text
        }))
        
        console.log('Saving notes:', cleanNotes)
        console.log('Save key:', `${ID}/notes`)
        
        await OBR.player.setMetadata({
            [`${ID}/notes`]: cleanNotes
        })
        
        // Verify the save
        const verifyMetadata = await OBR.player.getMetadata()
        console.log('Verified saved metadata:', verifyMetadata)
        console.log('Verified notes:', verifyMetadata[`${ID}/notes`])
        
        lastSaved.value = new Date().toLocaleTimeString()
        console.log('Notes saved successfully at', lastSaved.value)
    } catch (error) {
        console.error('Failed to save notes:', error)
    } finally {
        isSaving.value = false
    }
}

const addNote = () => {
    if (newNoteText.value.trim()) {
        notes.value.push({
            id: Date.now(),
            text: newNoteText.value.trim()
        })
        newNoteText.value = ''
        saveNotes()
    }
}

const startEdit = (index) => {
    editingIndex.value = index
    editingText.value = notes.value[index].text
}

const saveEdit = () => {
    if (editingText.value.trim()) {
        notes.value[editingIndex.value].text = editingText.value.trim()
        saveNotes()
    }
    cancelEdit()
}

const cancelEdit = () => {
    editingIndex.value = null
    editingText.value = ''
}

const deleteNote = (index) => {
    notes.value.splice(index, 1)
    saveNotes()
}

const clearAllNotes = () => {
    if (confirm('Are you sure you want to delete all notes?')) {
        notes.value = []
        saveNotes()
    }
}
</script>

<template>
    <GlobalRollContextMenu />
    
    <div class="flex flex-col h-screen p-4 gap-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Player Rolls</h1>
            <div class="flex gap-2 items-center">
                <span v-if="lastSaved" class="text-sm text-base-content/70">
                    Last saved: {{ lastSaved }}
                </span>
                <button @click="clearAllNotes" class="btn btn-sm btn-ghost" :disabled="notes.length === 0">
                    Clear All
                </button>
            </div>
        </div>

        <!-- Add New Note Input -->
        <div class="flex gap-2">
            <input 
                v-model="newNoteText"
                @keyup.enter="addNote"
                type="text" 
                placeholder="Add a new note..." 
                class="input input-bordered flex-1"
            />
            <button @click="addNote" class="btn btn-primary" :disabled="!newNoteText.trim()">
                Add
            </button>
        </div>

        <!-- Notes List -->
        <div class="flex-1 overflow-y-auto space-y-2">
            <div v-if="notes.length === 0" class="text-center text-base-content/50 py-8">
                No notes yet. Add your first note above!
            </div>
            
            <div 
                v-for="(note, index) in notes" 
                :key="note.id"
                class="flex items-center gap-2 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
            >
                <!-- Edit Mode -->
                <template v-if="editingIndex === index">
                    <input 
                        v-model="editingText"
                        @keyup.enter="saveEdit"
                        @keyup.esc="cancelEdit"
                        type="text" 
                        class="input input-bordered flex-1"
                        autofocus
                    />
                    <button @click="saveEdit" class="btn btn-sm btn-success">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                        </svg>
                    </button>
                    <button @click="cancelEdit" class="btn btn-sm btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </button>
                </template>
                
                <!-- View Mode -->
                <template v-else>
                    <span class="flex-1" v-html="parseText(note.text)"></span>
                    <button @click="startEdit(index)" class="btn btn-sm btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                        </svg>
                    </button>
                    <button @click="deleteNote(index)" class="btn btn-sm btn-ghost text-error">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                        </svg>
                    </button>
                </template>
            </div>
        </div>

        <!-- Helper Text -->
        <div class="text-sm text-base-content/70">
            <p>💡 Tip: Click on any note to edit it. Your notes auto-save and persist across sessions.</p>
            <p>🎲 Example: Longsword - {@hit 6} {@damage 1d8+3}</p>
        </div>

        <!-- Round D20 Toggle Button -->
        <div class="absolute bottom-8 right-8 z-20">
            <button @click="toggleDiceRolls" 
                    class="btn btn-circle btn-lg btn-primary shadow-lg hover:shadow-xl transition-all"
                    :class="{ 
                        'btn-active': diceRollsVisible,
                        'btn-disabled opacity-50': lastDiceRolls.length === 0
                    }"
                    :disabled="lastDiceRolls.length === 0">
                <!-- D20 Icosahedron SVG from dice CSS -->
                <svg width="28" height="31" viewBox="0 0 28 31" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                    <path d="M14 0L0 7.5V22.7L14 30.2L27 23.2L28 22.6V7.5L14 0ZM12 8.3L6.1 17.1L2.4 9.1L12 8.3ZM8 18L14 8.9L20 18H8ZM21.8 17.1L16 8.3L25.5 9L21.8 17.1ZM15 2.8L22.4 6.8L15 6.2V2.8ZM13 2.8V6.2L5.6 6.8L13 2.8ZM2 12.8L4.7 18.8L2 20.4V12.8ZM3 22.1L5.7 20.5L10.1 26L3 22.1ZM8 20H19L14 27.5L8 20ZM17.9 25.9L22.3 20.4L25 22L17.9 25.9ZM23.5 18.9L23.3 18.8L26 12.8V20.4L23.5 18.9Z" />
                </svg>
            </button>
        </div>

        <!-- New detailed dice roll display -->
        <DiceRollDisplay 
            :diceRollsVisible="diceRollsVisible"
            :lastDiceRolls="lastDiceRolls"
        />
    </div>
</template>

<style scoped></style>
