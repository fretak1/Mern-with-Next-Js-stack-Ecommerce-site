import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
    destination : function (req,file,cb) {
        cb(null,'uploads/')
    },
    filename : function (req,file,cb) {
        cb(
            null,
            file.filename + "-" + Date.now() + path.extname(file.originalname)
        )
    }
})

const fileFilter = (req: any,file : Express.Multer.File, cb : multer.FileFilterCallback) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new Error("Not an image please upload only image files"))
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fieldSize : 1024 * 1024 * 5}
}) 