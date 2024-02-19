const createError = require('http-errors')
const Route = require('../models/routeModel')

const addRoute = async(req,res,next)=>{
    const {name, list} = req.body;
    console.log(req.body);
    try{
        const route = await Route.create({name, list});
        res.json(route)
    }catch(err){
        next(createError(500, "Route creation failled"));
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
module.exports = {addRoute, getRoutes, getRoute, updateRoute}