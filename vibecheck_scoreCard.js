class Person{

    constructor(name, score){
        this.name = name;
        this.score = score;
    }

    get Name() {
        return this.name;
    }
    
    get Score() {
        return this.score;
    }
}

// exporting looks different from Node.js but is almost as simple
 module.exports = {Person};