import { Generator } from '../../types/GeneratorTypes';
import { SettingType } from '../../types/SettingTypes';
import { generate } from './generate';
import { SorryImLateSettings } from './types';

export const sorryImLateGenerator: Generator<SorryImLateSettings> = {
  name: "Sorry I'm late",
  description: "Sorry I'm late, I was generating images.",
  helpText: 'Enter some text for each panel.',
  attribution: {
    name: `"Comics of Interest: Sorry I'm late" by Maarika`,
    href: 'https://www.maarika.com/comicsofinterest/episode-016/',
  },
  generate,
  settings: {
    panel1Text: {
      name: 'Panel 1 Text',
      type: SettingType.Text,
      params: {},
    },
    panel2Text: {
      name: 'Panel 2 Text',
      type: SettingType.Text,
      params: {},
    },
  },
};
