import { useCallback, useReducer, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { saveAs } from 'file-saver';

import { Settings, SettingValues } from '../../types/SettingTypes';
import { Generator } from '../../types/GeneratorTypes';
import { Configurator } from '../Configurator';
import { MetaTags } from '../MetaTags/MetaTags';
import { Button } from '../Button';
import useCopyToClipboard from '../../utils/useCopyToClipboard';

import styles from './GeneratorPage.module.css';
import { useWebShare } from '../../utils/useNativeShare';
import { createFileFromDataURL } from '../../utils/createFileFromDataUrl';

interface GeneratorPageProps {
  generator: Generator;
}

type GeneratorAction =
  | { type: 'set'; key: string; value: any }
  | { type: 'reset'; settings: Settings };

const init = (settings: Settings): SettingValues => {
  return Object.entries(settings).reduce(
    (state, [key, setting]) => ({
      ...state,
      [key]: setting.defaultValue || undefined,
    }),
    {}
  );
};

const reducer = (state: SettingValues, action: GeneratorAction) => {
  switch (action.type) {
    case 'set':
      return {
        ...state,
        [action.key]: action.value,
      };
    case 'reset':
      return init(action.settings);
    default:
      return state;
  }
};

export const GeneratorPage: React.FC<GeneratorPageProps> = ({ generator }) => {
  const resultImage = useRef<HTMLImageElement>(null);

  const [settingValues, dispatch] = useReducer(
    reducer,
    generator.settings,
    init
  );

  const {
    data: output,
    isSuccess: hasGenerated,
    isFetching: isGenerating,
  } = useQuery(
    ['generate', settingValues],
    async ({ queryKey }) => {
      const canvas = document.createElement('canvas');

      const { cache, suggestedAltText } = await generator.generate(
        canvas,
        queryKey[1] as SettingValues,
        output?.cache || {}
      );

      const imageData = canvas.toDataURL('image/png');

      return { cache, suggestedAltText, imageData };
    },
    {
      networkMode: 'always',
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const onChange = useCallback(
    (key: string, value: any) => {
      dispatch({ type: 'set', key, value });
    },
    [dispatch]
  );

  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const { isSharingSupported, share } = useWebShare('image/png');
  const shareImage = () => {
    const shareData = {
      title: generator.name,
      file: createFileFromDataURL(output?.imageData, generator.name),
    };
    share({ data: shareData });
  };

  return (
    <>
      <MetaTags title={generator.name} description={generator.description} />

      <div className={styles.pageWrapper}>
        <div className={styles.generatorWrapper}>
          {hasGenerated ? (
            <img
              className={styles.output}
              ref={resultImage}
              src={output.imageData}
              alt=""
            />
          ) : (
            <div className={styles.placeholder} />
          )}

          <div className={styles.spacer} />

          <Configurator
            generator={generator}
            values={settingValues}
            onChange={onChange}
          />
        </div>

        <div className={styles.shareSection}>
          {isSharingSupported && (
            <>
              <Button onClick={shareImage} disabled={!hasGenerated}>
                Share image
              </Button>
              <div className={styles.spacer} />
            </>
          )}

          <Button
            onClick={() => saveAs(output?.imageData, `${generator.name}.png`)}
            disabled={!hasGenerated}>
            Download image
          </Button>
        </div>

        {hasGenerated && output.suggestedAltText && (
          <div className={styles.altTextSection}>
            <div className={styles.altTextTitleWrapper}>
              <div className={styles.altTextTitle}>Suggested alt text</div>
              <Button
                onClick={() => copyToClipboard(output.suggestedAltText)}
                small={true}>
                {!!copiedText ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <p className={styles.altText}>{output.suggestedAltText}</p>
          </div>
        )}
      </div>
    </>
  );
};
