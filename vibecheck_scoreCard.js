class Person{

    constructor(name){
        this.name = name;
    }

    get Name() {
        return this.name;
    }
}

// exporting looks different from Node.js but is almost as simple
 module.exports = {Person};