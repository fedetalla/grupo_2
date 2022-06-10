const express = require("express");
const multer = require('multer');
const router = express.Router();
const path = require('path');

const usersController = require("../controllers/usersController.js")

//realizamos la configuración de multer, indicando nombre y donde se van a guardar las imágenes
const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null, './public/img/users');
    },
    filename: (req,file,cb)=>{
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname))
    }
})

const uploadFile = multer({storage})

const { body } = require('express-validator')

// Definimos las validaciones correspondientes al register
const validations = [
    body('fullName').notEmpty().withMessage('Tienes que escribir un nombre'),
    body('category').notEmpty().withMessage('Tienes que seleccionar una categoría'),
    body('email').notEmpty().withMessage('Tienes que escribir un correo electrónico válido'),
    body('password').notEmpty().withMessage('Tienes que escribir una contraseña'),
    body('image').custom((value, {req}) => {
        let file = req.file;
        let extensionsAccepted = [ '.png', '.jpg' , '.gif' ];
        
        if(!file){
            throw new Error('Tienes que subir una imagen')
        }else{
        let fileExtension = path.extname(file.originalname)
        if(!extensionsAccepted.includes(fileExtension)){
            throw new Error('Las extensiones permitidas son: ".png", ".jpg" , ".gif" ');
        }
    }
        return true
    })
]

// LOGIN
router.get("/login", usersController.login);
router.post("/login", usersController.processLogin);

//REGISTER
router.get("/register", usersController.register);
router.post("/register", uploadFile.single('image'), validations , usersController.processRegister);

// PERFIL
router.get("/profile", usersController.profile);


module.exports = router ;