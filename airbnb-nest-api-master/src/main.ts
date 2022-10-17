import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import * as compression from 'compression'

async function bootstrap() {
   const PORT =  8080

   const app = await NestFactory.create(AppModule)
   app.enableCors()
   app.use(compression())
   app.setGlobalPrefix('api')
   await app.listen(PORT, () => console.log(`Magic happening at ${PORT} PORT`))
}

bootstrap()
