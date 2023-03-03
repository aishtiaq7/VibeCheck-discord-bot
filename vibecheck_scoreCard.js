class Person {
  constructor(name, score, id) {
    this.name = name;
    this.score = score;

    this.id = id;
    //id
    //monthScore = ??
    this.totalScore = 0;
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

module.exports = { Person };
