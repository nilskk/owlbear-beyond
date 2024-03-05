import Dexie from 'dexie';

// Define the database schema
export const db = new Dexie('owlbearBeyondDB');
db.version(1).stores({
  bestiary: '[name+source], [source+name], data', 
});

