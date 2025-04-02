import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dbConfig from './config/db.config';
import { AuthModule } from './auth1/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './common/logger/logger.module';
import { ResendModule } from './mail/resend.module';
import { ContactModule } from './contact/contact.module';
import { ExcelUploadModule } from './excel-upload/excel-upload.module';
import { GroupListModule } from './group-list/group-list.module';
import { ReservationModule } from './reservation/reservation.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [dbConfig],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      debug: true,
      playground: true,
      csrfPrevention: false, // ✅ DOĞRU YER BURA
      context: ({ req, res }) => ({ req, res }),
    }),

    UserModule,
    LoggerModule,
    ResendModule,
    ContactModule,
    GroupListModule,
    AuthModule,
    ExcelUploadModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
