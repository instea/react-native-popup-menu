// platform select polyfil for older RN versions
import { Platform } from 'react-native';

if (!Platform.select) {
  Platform.select = (obj) => obj[Platform.OS];
}
