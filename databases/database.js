
const mustBeDefinedBySubClassError = () =>  {throw new Error("This function has to be override by the sub class")}

class Database {
    connect(){error()}
    createTable(){error()}
    createInstance(){error()}
    updateInstance(){error()}
    deleteInstance(){error()}
    getInstance(){error()}
    getManyInstances(){error()}
    saveQueries(){error()}
}

module.exports = {Database}