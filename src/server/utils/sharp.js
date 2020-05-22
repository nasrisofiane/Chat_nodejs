import sharp from 'sharp';
import { fullImagesPath } from './multerConfig';
import sizeOf from 'image-size';

const proportionalHeightFromWidth = (file, resizeToWidth) =>{

    let originalRatio = sizeOf(file.path).width / sizeOf(file.path).height;
    let newHeight = resizeToWidth / originalRatio;

    return parseInt(newHeight);
}

const resizeFile = (file) =>{

    let resizeToWidth = 200;
    let proportionalHeight = proportionalHeightFromWidth(file, resizeToWidth);
    

    sharp(file.path).resize(resizeToWidth, proportionalHeight).toFile(`${fullImagesPath}/${file.filename}`, (err, resizeImage) => {
        if (err) {
             console.log(err);
        }
    });
}

export default resizeFile;
