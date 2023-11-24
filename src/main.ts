// ** NestJS Imports
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

// ** Cookie Imports
import cookieParser from 'cookie-parser'

// ** Modules Imports
import { AppModule } from './app.module'

async function bootstrap() {
    // App
    const app = await NestFactory.create(AppModule)
    app.use(cookieParser())
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true
        }),
    )
    app.enableCors({
        credentials: true,
        origin: [process.env.CMS_URL, process.env.USER_URL]
    })
    app.setGlobalPrefix('api')
    app.enableShutdownHooks()

    // Swagger
    const config = new DocumentBuilder()
        .setTitle('Mydashop API')
        .setDescription('The Mydashop API')
        .setVersion('1.0')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)

    // Run Serve
    const PORT = process.env.PORT
    await app.listen(PORT, () => console.log(`🚀 Server ready at: http://localhost:${PORT}`))
}

bootstrap()
