import { TypedSetting, SettingType } from '../../types/SettingTypes';
import { ColourField } from '../ColourField';
import { ImageField } from '../ImageField';
import { SliderField } from '../SliderField';
import { TextField } from '../TextField/TextField';

interface SettingRendererProps {
  setting: TypedSetting;
  value: any;
  id: string;
  onChange: (newValue: any) => void;
}

export const SettingRenderer: React.FC<SettingRendererProps> = ({
  setting,
  value,
  id,
  onChange,
}) => {
  switch (setting.type) {
    case SettingType.Text:
      return (
        <TextField
          id={id}
          onChange={onChange}
          autoComplete="off"
          autoCapitalize="off"
          value={value}
          placeholder={setting.params.placeholder}
        />
      );

    case SettingType.Colour:
      return (
        <ColourField
          onChange={onChange}
          value={value}
          presets={setting.params.presets}
          allowCustom={setting.params.allowCustom}
        />
      );

    case SettingType.Image:
      return <ImageField onChange={onChange} value={value} />;

    case SettingType.Slider:
      return (
        <SliderField
          onChange={onChange}
          value={value}
          min={setting.params.min}
          max={setting.params.max}
          step={setting.params.step}
          presets={setting.params.presets}
        />
      );
  }

  return <div>Unimplemented setting: {SettingType[setting.type]}</div>;
};
