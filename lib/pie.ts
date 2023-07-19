function round(n: number) {
  return Math.round(n * 10) / 10;
}

function polarToCartesian(radius: number, angleInDegrees: number) {
  var radians = (angleInDegrees - 90) * Math.PI / 180;

  return {
    x: round(radius + (radius * Math.cos(radians))),
    y: round(radius + (radius * Math.sin(radians)))
  };
}

function getDAttribute(radius: number, startAngle: number, endAngle: number) {
  const isCircle = endAngle - startAngle === 360;

  if (isCircle) endAngle--;

  const start = polarToCartesian(radius, startAngle);
  const end = polarToCartesian(radius, endAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  const d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
  ];

  if (isCircle) {
    d.push("Z");
  } else {
    d.push("L", radius, radius, "L", start.x, start.y, "Z");
  }
  return d.join(" ");
}

function path(d: string, colour: string) {
  return `<path d='${d}' style="fill: ${colour}" />`;
}

function svg(className: string, width: number, content: string ) {
  return `<svg class="${className}" viewBox="0 0 ${width} ${width}"><g class='pie'>${content}</g></svg>`;
}

type PieSlice = {
  value: number;
  colour: string;
}

export function generatePieSVG(className: string, radius: number, values: PieSlice[]) {
  type Sector = {
    colour: string;
    degrees: number;
    from?: number;
    to?: number;
  }

  const total = values.reduce((a, b) => a + b.value, 0);
  const data: Sector[] = values.map(({ value, colour }) => ({ colour, degrees: value / total * 360 }));

  const paths = data.reduce<[number, string][]>((prev, value, i) => {
    const from = i === 0 ? 0 : prev[i - 1][0];
    const to = from + value.degrees;

    return [...prev, [to, path(getDAttribute(radius, from, to ), value.colour)]];
  }, []);

  return svg(className, radius * 2, paths.map(([to, path]) => path) .join(''));
}
