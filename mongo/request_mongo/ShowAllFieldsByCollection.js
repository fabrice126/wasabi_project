var collection = "song";

mr = db.runCommand({
    "mapreduce": collection,
    "map": function () {
        for (var key in this) {
            emit(key, null);
        }
    },
    "reduce": function (key, stuff) {
        return null;
    },
    "out": collection + "_keys"
})

db[mr.result].distinct("_id")