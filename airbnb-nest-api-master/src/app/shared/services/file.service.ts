import * as sharp from 'sharp'
import * as fs from 'fs'
import * as crypto from 'crypto'
import * as imagemin from 'imagemin'
import imageminPngquant from 'imagemin-pngquant'
import * as imageminMozjpeg from 'imagemin-mozjpeg'
import { MulterFile } from '../../../utils/shared.types'
import { config } from '../../config/app.config'

export class FileService {
   async processImageUpload(
      file: MulterFile,
      destination: string,
      resizeOptions?: sharp.ResizeOptions,
   ): Promise<[string, string]> {
      const fileName = this.generateRandomName(file)
      let minified: Buffer = file.buffer
      if (resizeOptions) {
         const fileExtension = this.getFileExtension(file)
         if (fileExtension !== 'gif') {
            const resized = await this.resizeImg(file.buffer, resizeOptions)
            minified = await imagemin.buffer(resized, {
               plugins: [
                  imageminPngquant({ quality: [0.7, 0.8] }),
                  imageminMozjpeg({ quality: 80 }),
               ],
            })
         }
      }

      await this.saveFile(fileName, minified, destination)
      return [fileName, `${destination}/${fileName}`]
   }

   async saveFile(
      fileName: string,
      file: Buffer,
      destination: string,
   ): Promise<void> {
      try {
         await fs.promises.mkdir(`${config.STATIC_DIR}/${destination}`, {
            recursive: true,
         })
         await fs.promises.writeFile(
            `${config.STATIC_DIR}/${destination}/${fileName}`,
            file,
         )
      } catch (error) {
         throw new Error(`Failed to save file: ${error}`)
      }
   }

   deleteFile(filePath: string) {
      if (fs.existsSync(filePath)) {
         try {
            fs.unlinkSync(filePath)
         } catch (err) {
            throw Error('Failed to delete file')
         }
      }
   }

   resizeImg(image: Buffer, options: sharp.ResizeOptions): Promise<Buffer> {
      return sharp(image).resize(options).toBuffer()
   }

   getFileExtension(file: MulterFile): string {
      return file.mimetype.split('/')[1]
   }

   isValidFileExtension(file: MulterFile, validExtensions: string[]): boolean {
      const extension = this.getFileExtension(file)
      return validExtensions.indexOf(extension) !== -1
   }

   generateRandomName(file: MulterFile): string {
      const extension = this.getFileExtension(file)
      return crypto.randomBytes(16).toString('hex') + '.' + extension
   }
}
