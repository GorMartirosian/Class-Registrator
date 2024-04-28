class Table {
    constructor() {
        this.table = {};
    }

    _areValidTypes(type1,type2) {
        return this.table.hasOwnProperty(type1) && this.table[type1].hasOwnProperty(type2);
    }

    get(type1, type2) {
        if(this._areValidTypes(type1, type2)){
            return this.table[type1][type2];
        }
    }

    set(type1, type2, op){
        if(!this.table.hasOwnProperty(type1)){
            this.table[type1] = {};
        }
        this.table[type1][type2] = op;
    }
}

module.exports = Table;