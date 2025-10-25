import Dexie from 'dexie';
import { db } from './db';

function writeBulkToTable(data) {
    db.bestiary.bulkPut(data).then(function(lastKey) {
        console.log("Done putting monster in indexeddb");
        console.log("Last monsters name and source was: " + lastKey);
    }).catch(Dexie.BulkError, function (e) {
        // Explicitly catching the bulkAdd() operation makes those successful
        // additions commit despite that there were errors.
        console.error ("Some monster did not succeed. However, " +
        data.length-e.failures.length + " monster were added successfully");
    });
}

function clearTable() {
    db.bestiary.clear().then(function() {
        console.log("Cleared the table");
    });
}

// Note functions
async function getAllNotesForRoomAndPlayer(roomId, playerId) {
    try {
        const notes = await db.notes
            .where('[roomId+playerId]')
            .equals([roomId, playerId])
            .toArray();
        // Convert array to dictionary with noteId as key
        const notesDict = {};
        notes.forEach(note => {
            notesDict[note.noteId] = { text: note.text };
        });
        return notesDict;
    } catch (error) {
        console.error('Error getting notes for room and player:', error);
        return {};
    }
}

async function addNote(roomId, playerId, noteId, text) {
    try {
        await db.notes.put({
            roomId,
            playerId,
            noteId,
            text
        });
        console.log('Note added successfully');
    } catch (error) {
        console.error('Error adding note:', error);
        throw error;
    }
}

async function updateNote(roomId, playerId, noteId, text) {
    try {
        await db.notes.put({
            roomId,
            playerId,
            noteId,
            text
        });
        console.log('Note updated successfully');
    } catch (error) {
        console.error('Error updating note:', error);
        throw error;
    }
}

async function deleteNote(roomId, playerId, noteId) {
    try {
        await db.notes.delete([roomId, playerId, noteId]);
        console.log('Note deleted successfully');
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
}

async function clearAllNotesForRoomAndPlayer(roomId, playerId) {
    try {
        await db.notes
            .where('[roomId+playerId]')
            .equals([roomId, playerId])
            .delete();
        console.log('All notes cleared for room and player');
    } catch (error) {
        console.error('Error clearing notes:', error);
        throw error;
    }
}

export { writeBulkToTable, clearTable, getAllNotesForRoomAndPlayer, addNote, updateNote, deleteNote, clearAllNotesForRoomAndPlayer }