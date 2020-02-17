import multer from 'multer';


const getStorage = () => {
  return multer({
    storage: multer.memoryStorage()
  });
};

export const imageUploader = () => {
  return getStorage().single('img')
};