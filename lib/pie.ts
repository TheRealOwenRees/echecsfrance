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

  if (isCircle) {
      endAngle--;
  }

  const start = polarToCartesian(radius, startAngle);
  const end = polarToCartesian(radius, endAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  const d = [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y];

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

type PieSector = {
  value: number;
  colour: string;
}

export function pie(className: string, radius: number, values: PieSector[]) {

  type Sector = {
    colour: string;
    degrees: number;
    from?: number;
    to?: number;
    path?: string;
  }

  const total = values.reduce((a, b) => a + b.value, 0);
  const data: Sector[] = values.map(({ value, colour }) => ({ colour, degrees: value / total * 360 }));

  data.forEach((value, i, arr) => {
    if (i === 0) {
      value.from = 0;
      value.to = value.degrees;
    } else {
      value.from = arr[i - 1].to!;
      value.to = value.from + value.degrees;
    }

    value.path = path(getDAttribute(radius, value.from, value.to ), value.colour);
  });

  return svg(className, radius * 2, data.map(o => o.path).join(''));
}
