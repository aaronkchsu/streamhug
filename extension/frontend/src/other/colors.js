export const pandaPink = '#FE295C';
export const pandaTeal = pandaPink;
export const pandaNewTeal = '#49bea0';
export const darkTeal = '#058063';
export const flyoutBackground = '#FFFFFF';
export const ligherBackground = '#F8F8F8';
export const defaultBackground = '#F3F3F3';
export const lighterGray = '#BDBDBB';
export const iconsActive = '#21000C';
export const iconsInActive = '#47463F';
export const headerText = '#21000C';
export const disabledText = '#BEBEBC';
export const lightGray = '#BEBEBC';
export const blastZone = '#E1E1E1';
export const orangeStatus = '#ff785b';
export const darkRedStatus = '#dd1243';
export const inputBorderColor = '#bebeb9';
export const togglerBackground = '#A04949';
export const secondaryText = '#47463F';
export const secondarySubtitleText = '#707070';
export const biteGray = '#707070';
export const secondaryGray = '#706F6B';
export const placeholderText = '#BFBFBA';
export const activeText = '#21000C';
export const primaryText = '#FFFFFF';
export const bodyText = '#21000C';
export const darkText = '#21000C';
export const darkBackground = '#666';
export const statusColor = '#DD1243';
export const actionBackground = '#E6E6E6';
export const focusState = '#27AAFF';
export const focusOutline = '#3580B1';
export const darkBlue = '#3580B1';
export const headerColor = '#170D11';
export const headerBackground = '#47463F';
export const slidePurple = '#262261';

let blerpColors;
export default (blerpColors = {
  darkRedStatus,
  orangeStatus,
  togglerBackground,
  ligherBackground,
  pandaPink,
  darkTeal,
  flyoutBackground,
  defaultBackground,
  iconsActive,
  disabledText,
  inputBorderColor,
  placeholderText,
  activeText,
  secondaryText,
  secondaryGray,
  primaryText,
  statusColor,
  bodyText,
  focusState,
  headerText,
  darkBackground,
  darkText,
  focusOutline,
  darkBlue,
  blastZone,
  headerBackground
});

export const randomBlerpColor = () => {
  const colors = blerpColors;

  return colors[Math.floor(Math.random() * colors.length)];
};

export const bitColors = {
  single: '#706F6B',
  hundred: '#BD62FF',
  thousand: '#21CFA7',
  fiveThousand: '#27AAFF',
  tenThousand: '#FE295C'
};

export const bitNumberToColor = (bitCount) => {
  const bitConverted = Number(bitCount) || parseFloat(bitCount, 10);
  if (bitConverted <= 99) {
    return bitColors.single;
  } else if (bitConverted <= 999) {
    return bitColors.hundred;
  } else if (bitConverted <= 4999) {
    return bitColors.thousand;
  } else if (bitConverted <= 9999) {
    return bitColors.fiveThousand;
  } else {
    return bitColors.tenThousand;
  }
};

export const randomBitColor = () => {
  const colors = bitColors;

  return colors[Math.floor(Math.random() * colors.length)];
};
