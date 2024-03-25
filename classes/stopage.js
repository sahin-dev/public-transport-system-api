class Stopage{
    constructor(name){
        this.name = name;
        this.connected_stopages = [];
    }
    getName(){
        return this.name;
    }
    addConnection(stopage_name,length){
        let stopage = new Stopage(stopage_name);
        this.connected_stopages.push(stopage);
        //stopage.connected_stopages.push({stopage:this,length});
    }
    getConnectedStopages(){
        return this.connected_stopages;
    }
}

module.exports = Stopage;
