
const getId = (a,id)=>{
    let rid = ""
    let d = new Date(a)
    rid+=d.getDate()
    rid+=d.getMonth()
    rid+=id
    return rid
}



module.exports = getId