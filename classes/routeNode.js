class RouteNode{
    constructor(stopage,isStart = false){
        this.stopage = stopage;
        this.next = null;
        this.length = 0;
    }

    addNext(stopage){
        this.next = stopage;
        
    }
}