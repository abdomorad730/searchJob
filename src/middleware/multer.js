import multer from 'multer'


export const multerHost = (customD = []) => {


    const storage = multer.diskStorage({})

    function fileFilter(req, file, cb) {
            if (customD.includes(file.mimetype)) {
                cb(null, true)
            } else {
                cb(new Error('ivalid file format'),false)
            }
        }
    

    const upload = multer({fileFilter, storage  })
    return upload
}