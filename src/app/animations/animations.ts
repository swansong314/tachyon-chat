import {
  animate,
  style,
  transition,
  trigger,
  animation,
} from '@angular/animations';

export const fade = trigger('fade', [
  transition('void => *', [style({ opacity: 0 }), animate('500ms ease-out')]),
  transition('* => void', [animate('500ms ease-in', style({ opacity: 0 }))]),
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
  transition('void => *', [
    style({ transform: 'scale(0.5)' }),
    animate('150ms 500ms ease-out'),
  ]),
  transition('* => void', [
    animate('500ms ease-in', style({ transform: 'translateX(0px)' })),
  ]),
]);
