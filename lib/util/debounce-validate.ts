import { debounce } from "lodash";

export const debounceValidate = (
  validateFn: (data: any, cb: (errors?: object) => void) => void,
  debounceTime: number,
) => {
  const debounceValidationFn = debounce(validateFn, debounceTime);

  return data =>
    new Promise((res, rej) => {
      const cb = errors => (!!errors ? rej(errors) : res());
      debounceValidationFn(data, cb);
    });
};
