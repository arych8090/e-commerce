import express from "express";

const app = express ();
const port  =  3000 ;

export {app} ;

app.listen(port  , ()=>{
	console.log("the server is running in the port" , port)
})