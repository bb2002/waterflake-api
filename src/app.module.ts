import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './components/auth/auth.module';
import { UsersModule } from './components/users/users.module';
import { RegionsModule } from './components/regions/regions.module';
import { PlansModule } from './components/plans/plans.module';
import { TunnelsModule } from './components/tunnels/tunnels.module';
import { PoliciesModule } from './components/policies/policies.module';
import { StatisticsModule } from './components/statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/components/**/entities/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RegionsModule,
    PlansModule,
    TunnelsModule,
    PoliciesModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
