const { body } = require("express-validator")

const photoInsertValidation = () => {
    return [
        body("title")
            .not()
            .equals("undefined")//se title não é igual undefined
            .withMessage("O título é obrigatório.")
            .isString(0)//se não é string(0=null)
            .withMessage("O título é obrigatório.")
            .isLength({ min: 3 })
            .withMessage("O título precisa ter no mínimo 3 caracteres."),
        body("image")
            .custom((value, { req }) => {
                if (!req.file) {//se não houver arquivo na requisição/não veio imagem
                    throw new Error("A imagem é obrigatória")
                }
                return true
            })
    ]
}

const photoUpdateValidation = () => {
    return [
        body("title")
            .optional()
            .isString()
            .withMessage("O título é obrigatório")
            .isLength({ min: 3 })
            .withMessage("O título precisa ter no mínimo 3 caracteres."),
    ]
}

const commentValidation = () => {
    return [
        body("comment").isString().withMessage("O comentário é obrigatório.")
    ]
}

module.exports = {
    photoInsertValidation,
    photoUpdateValidation,
    commentValidation
}