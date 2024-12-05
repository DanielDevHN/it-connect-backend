import { Module } from '@nestjs/common';
import { IncidentsModule } from './incidents/incidents.module';
import { RequestsModule } from './requests/requests.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { AssetsModule } from './assets/assets.module';
import { KnowledgearticlesModule } from './knowledgearticles/knowledgearticles.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    IncidentsModule, 
    RequestsModule, 
    UsersModule, 
    CategoriesModule, 
    AuthModule,
    AssetsModule,
    KnowledgearticlesModule,
    CommentsModule
  ]
})
export class AppModule {}
