import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'node:process'

async function start() {
  const PORT = process.env.PORT || 9090
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  app.enableCors({
    origin: '*', // Разрешает доступ с любого источника
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['Content-Disposition', 'X-Expires-At', 'X-Created-At'],
  })

  await app.listen(PORT, () => console.log(`Listening on ${PORT}`))
}

start()
