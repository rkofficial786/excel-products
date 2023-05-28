const { default: slugify } = require("slugify");
const CategoryModel = require("../models/CategoryModel");

exports.categoryController = async (req,res)=>{


    try {

        const {name} =req.body

        if(!name){
            return res.status(401).send({
                message:"Name is required"
            })
        }

        const existingCategory = await CategoryModel.findOne({name})

        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"Category always exists"
            })
        }
        const category = await new CategoryModel({name,slug:slugify(name)}).save()

        res.status(201).send({
            success:true,
            message:"New category created",
            category
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message: "Error in Category"
        })
    }
}


//update category 

exports.updateCategory = async(req,res)=>{

    try {

        const {name} =req.body 
        const {id} =req.params
        const category =await CategoryModel.findByIdAndUpdate(
            id,{name,slug:slugify(name)},
            {new:true}
        );

        res.status(200).send({
            success:true,
            message:"Category Updated Successfully",
            category,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"error while creating category"
        })
    }
}

//get category 

exports.getCategories = async (req,res)=>{
   try {
    const category =await CategoryModel.find({})
    res.status(200).send({
        success:true,
        message: "All Categories list",
        category
    })
    
   } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        error,
        message:"Error while getting Categories"
    })
   } 
}

//single category

exports.singleCategory = async(req,res) =>{
    try {
        const  category =await CategoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"Get single category success",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error while getting a category"
        })
    }
}

//delete category

exports.deleteCategory =async(req,res)=>{

    try {
     const {id} =req.params 
     await CategoryModel.findByIdAndDelete(id)
     res.status(200).send({
        success:true,
        message:"category deleted successfully"
     })

        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error while deleting category",
            error
        })
    }
}