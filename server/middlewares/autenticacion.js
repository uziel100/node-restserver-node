const jwt = require('jsonwebtoken')

// ===========================
// Verificar token
// ===========================

let verificaToken = (req, res, next) => {
    // obtener header personalizados
    let token = req.get('token');
    
    
    jwt.verify(token, process.env.SEED, (err, decoded) => {
    
        if(err){
            return res.status(401).json({
                status: false,
                message: "Token no válido"
            })
        }

        req.usuario = decoded.usuario;
        next();
    })       
}

let verificarUserRole = (req, res, next) => {
    const USER_ROL = req.usuario.role;
    
    if( USER_ROL === 'ADMIN_ROLE' ){        
        next();
    }else{        
        return res.status(401).json({
            status:false,            
            message: 'El usuario no es administrador'
        })
    }
}

let verificaTokenImg = (req, res, next) =>{
    const { token } = req.query;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
    
        if(err){
            return res.status(401).json({
                status: false,
                message: "Token no válido"
            })
        }

        req.usuario = decoded.usuario;
        next();
    })           
}


module.exports = {
    verificaToken,
    verificarUserRole,
    verificaTokenImg
}