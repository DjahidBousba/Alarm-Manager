import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import 'dayjs/locale/fr';

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

export { dayjs };
