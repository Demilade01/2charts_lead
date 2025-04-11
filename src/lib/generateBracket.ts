export function generateBracketSvg(height: number): string {
  const minHeight = 10;
  const bracketHeight = Math.max(height, minHeight);

  // Original height of the SVG path was 340 units
  const scale = bracketHeight / 340;

  // Coordinates from original SVG, scaled appropriately
  const p = (v: number) => (v * scale).toFixed(2);

  return `
    <svg width="30" height="${bracketHeight}" fill="none" xmlns="http://www.w3.org/2000/svg"
      style="position: absolute; top: 45px; left: -57px; margin-right: 10px;">
      <path
        d="
          M${p(0.193)} ${p(2)}
          C${p(18.95)} ${p(2)} ${p(18.95)} ${p(7.02)} ${p(18.95)} ${p(11.06)}
          C${p(18.95)} ${p(15.08)} ${p(18.95)} ${p(103.6)} ${p(18.95)} ${p(
    163.26
  )}
          C${p(18.95)} ${p(163.62)} ${p(19.14)} ${p(163.95)} ${p(19.46)} ${p(
    164.13
  )}
          L${p(27.47)} ${p(168.55)}
          C${p(28.15)} ${p(168.92)} ${p(28.16)} ${p(169.89)} ${p(27.5)} ${p(
    170.29
  )}
          L${p(19.44)} ${p(175.06)}
          C${p(19.13)} ${p(175.24)} ${p(18.95)} ${p(175.57)} ${p(18.95)} ${p(
    175.92
  )}
          V${p(329.95)}
          C${p(18.95)} ${p(331.5)} ${p(18.95)} ${p(338)} ${p(0)} ${p(338)}
        "
        stroke="#386b67"
        stroke-width="0.9"
        fill="none"
      />
    </svg>
  `;
}
