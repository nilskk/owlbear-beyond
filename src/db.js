import Dexie from 'dexie';

// Define the database schema
let dbname = '';
if (import.meta.env.DEV) {
    dbname = 'owlbearBeyondDB_DEV';
}
if (import.meta.env.PROD) {
    dbname = 'owlbearBeyondDB';
}
export const db = new Dexie(dbname);
db.version(1).stores({
    bestiary: '[name+source], [source+name], data', 
});

db.version(2).stores({
    bestiary: '[name+source], [source+name], data',
    notes: '[roomId+noteId], roomId, noteId, text'
});

db.version(3).stores({
    bestiary: '[name+source], [source+name], data',
    notes: null // Delete the old notes table
}).upgrade(tx => {
    // Migration: clear old notes since structure is incompatible
    return tx.table('notes').clear();
});

db.version(4).stores({
    bestiary: '[name+source], [source+name], data',
    notes: '[roomId+playerId+noteId], [roomId+playerId], roomId, playerId, noteId, text'
});
