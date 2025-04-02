import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dbConfig from './config/db.config';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './common/logger/logger.module';
import { ResendModule } from './mail/resend.module';
import { ContactModule } from './contact/contact.module';
import { ExcelUploadModule } from './excel-upload/excel-upload.module';
import { GroupListModule } from './group-list/group-list.module';
import { ReservationModule } from './reservation/reservation.module';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { AuthGuard, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { TokenValidation } from 'nest-keycloak-connect';
@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080', // Keycloak sunucu URL’n
      realm: 'diogenestravel',
      clientId: 'nextjs-client',
      secret: 'ljAC5zxxM1DtIMOUKi3H6y1DmefslrWd', // public client için boş bırakılabilir
      tokenValidation: TokenValidation.OFFLINE, // 👈 Ekleyelim
    }),
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

      context: ({ req, res }) => {
        console.log('🛡️ Authorization Header:', req.headers.authorization);
        return { req, res };
      }, // ✅ BU SATIR ŞART
    }),

    UserModule,
    LoggerModule,
    ResendModule,
    ContactModule,
    GroupListModule,
    ExcelUploadModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
