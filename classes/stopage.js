class Stopage{
    constructor(name){
        this.name = name;
        this.connected_stopages = [];
    }
    getName(){
        return this.name;
    }
    addConnection(stopage,length){
        if(!(stopage instanceof Stopage)){
            return new Error("Not instance of Stopage");
        }
        this.connected_stopages.push({stopage,length});
        stopage.connected_stopages.push({stopage:this,length});
    }
    getConnectedStopages(){
        return this.connected_stopages;
    }
}

module.exports = Stopage;
