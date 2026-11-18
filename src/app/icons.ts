import { provideIcons, provideNgIconsConfig } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideChartNoAxesColumnIncreasing,
  lucideCheck,
  lucideChevronDown,
  lucideCircle,
  lucideClipboard,
  lucideLoaderCircle,
  lucidePencil,
  lucidePlus,
  lucideSearch,
  lucideTrash2,
  lucideTriangleAlert,
  lucideX,
} from '@ng-icons/lucide';

/**
 * Every icon used by the app, registered once at the root injector.
 * Only the icons imported above end up in the bundle.
 */
export const appIcons = {
  lucideCalendar,
  lucideChartNoAxesColumnIncreasing,
  lucideCheck,
  lucideChevronDown,
  lucideCircle,
  lucideClipboard,
  lucideLoaderCircle,
  lucidePencil,
  lucidePlus,
  lucideSearch,
  lucideTrash2,
  lucideTriangleAlert,
  lucideX,
};

export const provideAppIcons = () => [
  provideNgIconsConfig({ size: '1.25rem', strokeWidth: 2 }),
  provideIcons(appIcons),
];
