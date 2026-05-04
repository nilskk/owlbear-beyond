<script setup>
import { ref, onMounted } from 'vue'
import OBR from '@owlbear-rodeo/sdk'
import { parseText } from './parseFunctions.js'
import { useRollButtonListeners } from './composables/useRollButtonListeners.js'
import GlobalRollContextMenu from './components/GlobalRollContextMenu.vue'
import DiceRollDisplay from './components/DiceRollDisplay.vue'
import GameTermTooltip from './components/GameTermTooltip.vue'
import NavbarComponent from './components/navbar/NavbarComponent.vue'
import { rollDiceWithDiceRoller } from './diceFunctions.js'
import { getAllNotesForRoomAndPlayer, addNote as dbAddNote, updateNote, deleteNote as dbDeleteNote, clearAllNotesForRoomAndPlayer } from './dbFunctions.js'

const ID = 'com.nilskk.owlbear-beyond'
const notes = ref({}) // Dictionary of notes: { [id]: { text: string } }
const newNoteText = ref('')
const editingId = ref(null)
const editingText = ref('')
const isSaving = ref(false)
const lastSaved = ref(null)
const lastDiceRolls = ref([])
const diceRollsVisible = ref(false)
const diceRollResult = ref(null)
const roomId = ref(null)
const playerId = ref(null)
let timeoutId = null

// Dummy data for navbar
const selectedMonster = ref({ name: 'My Custom Rolls' })
const groupedBestiary = ref({})
const playerSelection = ref(null)

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
    // console.log(result)
    
    // Add result to history
    if (result) {
        addRollToHistory(result)
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
        // Get room ID and player ID
        roomId.value = OBR.room.id
        playerId.value = OBR.player.id
        console.log('Room ID:', roomId.value)
        console.log('Player ID:', playerId.value)
        
        // Load notes from database
        const loadedNotes = await getAllNotesForRoomAndPlayer(roomId.value, playerId.value)
        notes.value = loadedNotes
        console.log('Loaded notes from database:', notes.value)
    })
})

const saveNotes = async () => {
    // Not needed anymore - individual operations save directly
    lastSaved.value = new Date().toLocaleTimeString()
}

const addNote = async () => {
    if (newNoteText.value.trim()) {
        const noteId = Date.now().toString()
        const text = newNoteText.value.trim()
        
        // Add to local state
        notes.value[noteId] = { text }
        
        // Save to database
        await dbAddNote(roomId.value, playerId.value, noteId, text)
        
        newNoteText.value = ''
        lastSaved.value = new Date().toLocaleTimeString()
    }
}

const startEdit = (id) => {
    editingId.value = id
    editingText.value = notes.value[id].text
}

const saveEdit = async () => {
    if (editingText.value.trim()) {
        const text = editingText.value.trim()
        
        // Update local state
        notes.value[editingId.value].text = text
        
        // Update in database
        await updateNote(roomId.value, playerId.value, editingId.value, text)
        
        lastSaved.value = new Date().toLocaleTimeString()
    }
    cancelEdit()
}

const cancelEdit = () => {
    editingId.value = null
    editingText.value = ''
}

const deleteNote = async (id) => {
    // Delete from local state
    delete notes.value[id]
    
    // Delete from database
    await dbDeleteNote(roomId.value, playerId.value, id)
    
    lastSaved.value = new Date().toLocaleTimeString()
}

const clearAllNotes = async () => {
    // Clear local state
    notes.value = {}
    
    // Clear from database
    await clearAllNotesForRoomAndPlayer(roomId.value, playerId.value)
    
    lastSaved.value = new Date().toLocaleTimeString()
}
</script>

<template>
    <GlobalRollContextMenu />
    <GameTermTooltip />
    
    <div class="flex flex-col h-screen">
        <NavbarComponent 
            :selectedMonster="selectedMonster"
            :groupedBestiary="groupedBestiary"
            :playerSelection="playerSelection"
            :isGmView="false"
            :notesCount="Object.keys(notes).length"
            @clearNotes="clearAllNotes"
        />
        
        <div class="flex flex-col flex-1 overflow-y-auto p-4 gap-4">
            <!-- Add New Note Input -->
            <div class="flex gap-2">
            <textarea 
                v-model="newNoteText"
                @keyup.ctrl.enter="addNote"
                placeholder="Add a new note... (Ctrl+Enter to add)" 
                class="textarea textarea-bordered flex-1 max-h-24"
            />
            <button @click="addNote" class="btn btn-primary" :disabled="!newNoteText.trim()">
                Add
            </button>
        </div>

        <!-- Notes List -->
        <div class="flex-1 overflow-y-auto space-y-2">
            <div v-if="Object.keys(notes).length === 0" class="text-center text-base-content/50 py-8">
                No notes yet. Add your first note above!
            </div>
            
            <div 
                v-for="(note, id) in notes" 
                :key="id"
                class="flex items-center gap-2 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
            >
                <!-- Edit Mode -->
                <template v-if="editingId === id">
                    <textarea 
                        v-model="editingText"
                        @keyup.ctrl.enter="saveEdit"
                        @keyup.esc="cancelEdit"
                        class="textarea textarea-bordered flex-1 max-h-32"
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
                    <div class="flex-1 min-w-0 whitespace-pre-wrap break-words" v-html="parseText(note.text)"></div>
                    <button @click="startEdit(id)" class="btn btn-sm btn-ghost flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                        </svg>
                    </button>
                    <button @click="deleteNote(id)" class="btn btn-sm btn-ghost text-error flex-shrink-0">
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
