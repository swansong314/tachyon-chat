import {
  animate,
  style,
  transition,
  trigger,
  animation,
  keyframes,
  useAnimation,
} from '@angular/animations';

const bounceIn = animation([
  style({ opacity: 0 }),
  animate(
    '1000ms cubic-bezier(0.215, 0.61, 0.355, 1)',
    keyframes([
      style({ offset: 0, opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)' }),
      style({ offset: 0.2, transform: 'scale3d(1.1, 1.1, 1.1)' }),
      style({ offset: 0.4, transform: 'scale3d(0.9, 0.9, 0.9)' }),
      style({
        offset: 0.6,
        opacity: 1,
        transform: 'scale3d(1.03, 1.03, 1.03)',
      }),
      style({ offset: 0.8, transform: 'scale3d(0.97, 0.97, 0.97)' }),
      style({ offset: 1, opacity: 1, transform: 'scale3d(1, 1, 1)' }),
    ])
  ),
]);

const bounceOut = animation([
  animate(
    '400ms',
    keyframes([
      style({ offset: 0 }),
      style({ offset: 0.55, opacity: 1, transform: 'scale3d(1.1, 1.1, 1.1)' }),
      style({ offset: 1, opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)' }),
    ])
  ),
  style({ opacity: 0 }),
]);

export const fade = trigger('fade', [
  transition('void => *', [style({ opacity: 0 }), animate('500ms ease-out')]),
  transition('* => void', [animate('500ms ease-in', style({ opacity: 0 }))]),
  transition('inFrame=>notInFram', [
    animate('500ms ease-in', style({ opacity: 0 })),
  ]),
]);

export const exit = trigger('exit', [
  transition('void => inFrame', [useAnimation(bounceIn)]),
  transition('inFrame=>notInFrame', [useAnimation(bounceOut)]),
]);

export const slide = trigger('slide', [
  transition('void => *', [
    style({ transform: 'translateX(100px)', opacity: 0 }),
    animate('500ms ease-out'),
  ]),
  transition('* => void', [
    animate('500ms ease-in', style({ transform: 'translateX(-50px)' })),
  ]),
]);

export const grow = trigger('grow', [
  transition('void => *', [useAnimation(bounceIn)]),
  transition('* => void', [
    animate('500ms ease-in', style({ transform: 'translateX(0px)' })),
  ]),
]);
