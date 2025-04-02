import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class AuthService {
  async exchangeCodeForToken(code: string) {
    const tokenUrl =
      'http://localhost:8080/realms/diogenestravel/protocol/openid-connect/token';

    try {
      const res = await axios.post(
        tokenUrl,
        qs.stringify({
          grant_type: 'authorization_code',
          client_id: 'nextjs-client',
          // client_secret: '...' // Gerekirse ekle!
          code,
          redirect_uri: 'http://localhost:3000/auth/callback',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.error(
        '🚨 Token alırken hata:',
        err?.response?.data || err.message || err,
      );
      throw new InternalServerErrorException('Token alma işlemi başarısız.');
    }
  }
}
