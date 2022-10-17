import { JwtModuleOptions } from '@nestjs/jwt'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

export const config = {
   PORT: parseInt(process.env.PORT, 10) || 8000,
   HOST: process.env.HOST || 'http://localhost',
   ROOT_DIR: process.cwd(),
   STATIC_DIR: `${process.cwd()}/static`,
   NODE_ENV: process.env.NODE_ENV || 'development',
   JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'super-secret-jwt-key',
   UPLOAD_IMAGES_DIR: 'uploads/images',
   LISTING_IMAGES_DIR_NAME: 'listings',
   FEEDBACK_IMAGES_DIR_NAME: 'feedbacks',
   REGIONS_IMAGES_DIR_NAME: 'regions',
}

export const FIREBASE_CONFIG = {
   apiKey: 'AIzaSyCniKCyhqZAHKeAVy0UpzLZYw5PUjutTRM',
   authDomain: 'trellopr-7d92a.firebaseapp.com',
   databaseURL: 'https://trellopr-7d92a-default-rtdb.firebaseio.com',
   projectId: 'trellopr-7d92a',
   storageBucket: 'trellopr-7d92a.appspot.com',
   messagingSenderId: '690950240645',
   appId: '1:690950240645:web:9a8f8f3d4d1e2c297c6cec',
}

export const JWT_CONFIG: JwtModuleOptions = {
   secret: config.JWT_SECRET_KEY,
   signOptions: {
      expiresIn: '7d',
   },
}
