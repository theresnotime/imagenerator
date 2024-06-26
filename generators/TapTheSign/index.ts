import { Generator } from '../../types/GeneratorTypes';
import { SettingType } from '../../types/SettingTypes';
import { generate } from './generate';
import { TapTheSignSettings } from './types';

export const tapTheSignGenerator: Generator<TapTheSignSettings> = {
  name: "Don't make me tap the sign",
  description: "If you've told them once, you've told them a thousand times.",
  helpText: 'Enter either some text or an image to show on the sign.',
  generate,
  settings: {
    text: {
      name: 'Text',
      type: SettingType.Text,
      params: {},
    },
    image: {
      name: 'Image',
      type: SettingType.Image,
      params: {},
    },
  },
};
