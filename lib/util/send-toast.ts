type Toaster = typeof import("izitoast").default;

export const sendToast = (cb: (toaster: Toaster) => void) =>
  import("izitoast").then(_ => {
    _.default.settings({ position: "bottomLeft", timeout: 7000 });
    cb(_.default);
  });
