import { diskStorage } from 'multer';

export const multerConfig = (folder: 'profils' | 'posts') => ({
  storage: diskStorage({
    destination: `./public/uploads/${folder}`,
    filename: (req, file, callback) => {
      const { userId, postId } = req.body as { userId?: string; postId?: string };
      const fileName = generateFileName(folder, userId, postId);

      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Format non supporté'), false);
    }
    callback(null, true);
  },
});

function generateFileName(folder: string, userId?: string, postId?: string): string {
  switch (folder) {
    case 'profils':
      if (!userId) throw new Error('userId est requis pour les profils');
      return `${userId}.jpg`;
    case 'posts':
      if (!postId) throw new Error('postId est requis pour les posts');
      return `${postId}.jpg`;
    default:
      throw new Error('Folder inconnu');
  }
}