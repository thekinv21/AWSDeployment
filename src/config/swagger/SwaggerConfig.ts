import { DocumentBuilder } from '@nestjs/swagger';

export const createSwaggerConfig = (port: number) =>
  new DocumentBuilder()
    .setTitle('Docker Deployment API')
    .setDescription(
      'A backend application built with **NestJS** and **TypeScript**, containerized with **Docker** and deployed through a **GitHub Actions** CI/CD pipeline. This project covers containerization, environment configuration, automated deployment, and production best practices.',
    )
    .setVersion('1.0')
    .setContact('Vadim', 'https://github.com/thekinv21', 'thekinv21@gmail.com')
    .addServer(`http://localhost:${port}`, 'Local Development')
    .build();
