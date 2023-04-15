import { GeneratorFunction } from '../../types/GeneratorTypes';
import { applyCrop } from '../../utils/applyCrop';
import { loadImage } from '../../utils/loadImage';
import { calculateImageSize } from '../../utils/resizeImage';
import multilineText from '../../utils/multilineText';

import {
  ARROW_PADDING,
  ARROW_SIZE,
  BACKGROUND_COLOUR,
  FONT_SIZE,
  OUTPUT_SIZE,
  TEXT_PADDING,
} from './constants';
import { TomScottSettings } from './types';

export const generate: GeneratorFunction<TomScottSettings> = async (
  canvas,
  settings
) => {
  const { text = '', image, verticalPosition, horizontalPosition } = settings;

  if (!image.src || !image.crop) {
    return {
      success: false,
    };
  }

  const croppedImageSrc = await applyCrop(image.src, image.crop);

  if (!croppedImageSrc) {
    return {
      success: false,
    };
  }

  const croppedImage = await loadImage(croppedImageSrc);

  const { width, height } = calculateImageSize(croppedImage, OUTPUT_SIZE);

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      success: false,
    };
  }

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(croppedImage, 0, 0, width, height);

  const lowercaseText = text.toLowerCase();

  const arrowX =
    horizontalPosition === 'left'
      ? width / 2 - ARROW_SIZE - 2 * ARROW_PADDING
      : width / 2;

  const textX =
    horizontalPosition === 'left'
      ? TEXT_PADDING
      : TEXT_PADDING + arrowX + ARROW_SIZE + 2 * ARROW_PADDING;
  const textY = (verticalPosition / 100) * height;

  const textWidth =
    width / 2 - ARROW_SIZE - 2 * ARROW_PADDING - 2 * TEXT_PADDING;

  multilineText.align = 'left';
  multilineText.vAlign = 'top';
  multilineText.fontSize = FONT_SIZE;
  multilineText.font = 'Arial Black';
  multilineText.background = false;

  const { height: textHeight } = multilineText.drawText(
    ctx,
    lowercaseText,
    textX,
    textY,
    textWidth,
    height
  );

  ctx.fillStyle = BACKGROUND_COLOUR;
  ctx.fillRect(
    textX - TEXT_PADDING,
    textY,
    textWidth + 2 * TEXT_PADDING,
    textHeight + 2 * TEXT_PADDING
  );

  const arrowY =
    textY + textHeight < height / 2
      ? textY + textHeight + 2 * TEXT_PADDING - ARROW_SIZE - 2 * ARROW_PADDING
      : textY;

  ctx.fillStyle = BACKGROUND_COLOUR;
  ctx.fillRect(
    arrowX,
    arrowY,
    ARROW_SIZE + ARROW_PADDING * 2,
    ARROW_SIZE + ARROW_PADDING * 2
  );

  const arrowDirectionX = horizontalPosition === 'left' ? 'right' : 'left';
  const arrowDirectionY = textY + textHeight < height / 2 ? 'down' : 'up';

  const arrowImage = await loadImage(
    `/assets/tom-scott-arrow-${arrowDirectionY}-${arrowDirectionX}.jpg`
  );

  ctx.drawImage(arrowImage, arrowX + ARROW_PADDING, arrowY + ARROW_PADDING);

  ctx.restore();

  ctx.fillStyle = 'black';
  multilineText.drawText(
    ctx,
    lowercaseText,
    textX,
    textY + 3,
    textWidth,
    height
  );

  ctx.fillStyle = 'white';
  multilineText.drawText(ctx, lowercaseText, textX, textY, textWidth, height);

  const suggestedAltText = `{{userImage}} with text on top with a red background that says "${lowercaseText}". There's an arrow pointing at [describe what the arrow is pointing at].`;

  return {
    success: true,
    suggestedAltText,
  };
};