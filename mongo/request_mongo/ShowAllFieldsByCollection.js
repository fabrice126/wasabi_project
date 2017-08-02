var collection = "artist";

db.runCommand({
    "mapreduce": collection,
    "map": function () {
        for (var key in this) emit(key, null);
    },
    "reduce": function (key, stuff) {
        return null;
    },
    "out": "_stats_prop_"+collection
})