# DataAccessObject

Two simple data-access-objects that can be used to persist objects.
1) `MemDao` use an in-memory hash map. usefull for unit tests
2) `FileDao` use a file system JSON format.

The DAO has 5 methods. All return a Promise:
* `put(id, obj)`
* `get(id).then(obj)`
* `list().then(arrOfIds)`
* `remove(id)`
* `setup(keyValues)`