import Dexie from 'dexie';

function writeBulkToTable(data, table) {
    table.bulkPut(data).then(function(lastKey) {
        console.log("Done putting monster in indexeddb");
        console.log("Last monsters name and source was: " + lastKey);
    }).catch(Dexie.BulkError, function (e) {
        // Explicitly catching the bulkAdd() operation makes those successful
        // additions commit despite that there were errors.
        console.error ("Some monster did not succeed. However, " +
        data.length-e.failures.length + " monster were added successfully");
    });
}

function clearTable(table) {
    table.clear().then(function() {
        console.log("Cleared the table");
    });
}

export { writeBulkToTable, clearTable }