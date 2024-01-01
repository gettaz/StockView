import { ResolveFn } from '@angular/router';

export const welcomeResolverResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
