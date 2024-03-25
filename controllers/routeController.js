const createError = require('http-errors')
const {Stopage,Route} = require('../models/routeModel')
const Map = require('../models/mapModel')

//@desc Add a stopage
//@route POST api/route/stopage
//@access Private/Admin


const addStopage = async(req,res,next)=>{
    const {name} = req.body;
    const st = await Stopage.findOne({name});

    if(st){
        res.status(409);
        res.json({status:"failed",msg:"Stopage already created"});
        return;
    } 
    
    const stopage = await Stopage.create({name,connected_route:[]});
    if(!stopage){
        res.status(400);
        res.json({status:"failed",msg:"Stopage creation failed!"});
        return;
    }

    res.json({status:"success",msg:"Stopage created successfully", data:stopage})
}

//@desc Get a stopage
//@route GET api/route/stopage
//@access Private/Admin

const getStopage = async(req,res,next)=>{

}

//@desc Get  all  stopages
//@route GET api/route/stopages
//@access private/Admin

const getStopages = async(req,res,next)=>{
    const stopages = await Stopage.find({}).select('-connected_routes');
    res.status(200);
    res.json({status:"success",msg:"Stopages fetched successfully", data:{count:stopages.length,stopages}});
    
}
const updateStopage = async(req,es,next)=>{

}
const deleteStopage = async(req,res,next)=>{

}

//@desc Add route between stopages
//@route POST api/route
//@access Private

const addRoute = async(req,res,next)=>{
    //source and destination is id of Stopage document in mongodb
    const {source,destination,length} = req.body;
    
    try{
        let s1 = await Stopage.findById(source);
        let s2 = await Stopage.findById(destination);
        if(!(s1 && s1)){
            throw new Error(`${src} or ${dest} are not defined`)
        }
        
        s1.connected_routes.push({destination:source_id,length});
        s2.connected_routes.push({destination:destination_id,length});
        
        await s1.save();
        await s2.save();

        res.json({status:'success',msg:"Route added successfully",data:{source:s1,destination:s2}})
    }catch(err){
        res.status(400);
        res.json({status:"failed",msg:"Route addition failed",error:err.message})
    }
}

const getRoutes = async (req,res,next)=>{
    try{
        const routes = await Route.find({});
        res.json(routes);
    }catch(err){
        next(createError(500, err));
    }

}

const getRoute = async(req,res,next)=>{
    try{
        const {id} = req.body;
        const route = await Route.findById(id);
        res.json(route);
    }catch(err){
        next(createError(500, err));
    }
}

const updateRoute = async(req,res,next)=>{
    try{
        const {id} = req.body;
    }catch(err){
        next(createError(500, err));
    }
}
module.exports = {addRoute, getRoutes, getRoute, updateRoute, addStopage, getStopage,getStopages, updateStopage,deleteStopage}