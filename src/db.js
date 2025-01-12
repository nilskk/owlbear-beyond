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

