import { Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemoveSensitiveUserInfoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data?.data?.user) {
          const { user, ...rest } = data.data;
          return {
            ...data,
            data: {
              ...rest,
              user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
              },
            },
          };
        }
        return data;
      }),
    );
  }
}