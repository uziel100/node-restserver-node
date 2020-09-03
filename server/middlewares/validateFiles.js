const typesImgAllow = ["png", "jpg", "jpeg"];
const typesCollectionsAllow = ["usuarios", "productos"];

const validaTipoColeccion = (req, res, next) => {
  const { tipo } = req.params;

  if (typesCollectionsAllow.includes(tipo)) {
    next();
  } else {
    return res.status(400).json({
      status: false,
      message:
        "El tipo no es valido, permitos: " + typesCollectionsAllow.join(", "),
    });
  }
};

const verificarSiHayArchivo = (req, res, next) => {
  if (!req.files) {
    return res.status(400).json({
      status: false,
      message: "No hay ningun archivo para subir",
    });
  } else {
    next();
  }
};

const validaTipoImagen = (req, res, next) => {
  let { id } = req.params;
  let archivo = req.files.archivo;

  const nombreCortado = archivo.name.split(".");
  const extension = nombreCortado[nombreCortado.length - 1];

  if (typesImgAllow.includes(extension)) {
    const nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`        
    req.nombreArchivo = nombreArchivo;
    next();
  } else {
    return res.status(400).json({
      status: false,
      message: "Las extensiones permitidas son: " + typesImgAllow.join(", "),
      ext: extension,
    });
  }
};

module.exports = {
    validaTipoColeccion,
    verificarSiHayArchivo,
    validaTipoImagen,

}