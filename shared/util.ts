import moment from "moment";

export function durationToSimpleFormat(duration: number) {
  const minute = moment.duration(1, "minute").asMilliseconds();
  const hour = minute * 60;

  const hours = duration / hour;
  if (hours === Math.floor(hours)) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  const minutes = duration / minute;
  if (minutes === Math.floor(minutes)) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
}

export function show(x: any) {
  // tslint:disable-next-line:no-console
  console.log(x);
  return x;
}
