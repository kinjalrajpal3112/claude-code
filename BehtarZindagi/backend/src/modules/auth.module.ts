import { Module, Global } from '@nestjs/common';
import { JwtService } from '../service/jwt.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { AxiosService } from '../service/axios.service';

@Global()
@Module({
  providers: [JwtService, AuthGuard, AxiosService],
  exports: [JwtService, AuthGuard, AxiosService],
})
export class AuthModule {}
