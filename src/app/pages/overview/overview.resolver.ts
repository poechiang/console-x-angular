import { ResolveFn } from '@angular/router';

export const overviewResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
