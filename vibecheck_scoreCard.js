class Person{

    constructor(name, score, id){
        this.name = name;
        this.score = score;

        this.id = id;
        //id 
        //monthScore = ??
    }

    get Name() {
        return this.name;
    }
    
    get Score() {
        return this.score;
    }

    get Id() {
        return this.id;
    }
}

// exporting looks different from Node.js but is almost as simple
 module.exports = {Person};