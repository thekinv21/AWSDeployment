import { DocumentBuilder } from '@nestjs/swagger';

export const createSwaggerConfig = (port: number) =>
  new DocumentBuilder()
    .setTitle('AWS Deployment API')
    .setDescription(
      'A backend application built with **NestJS** and **TypeScript**, focused on deploying and running scalable, secure, and production-ready services on **Amazon Web Services (AWS)**. This project covers cloud infrastructure, environment configuration, application deployment, and production best practices.',
    )
    .setVersion('1.0')
    .setContact('Vadim', 'https://github.com/thekinv21', 'thekinv21@gmail.com')
    .addServer(`http://localhost:${port}`, 'Local Development')
    .build();
