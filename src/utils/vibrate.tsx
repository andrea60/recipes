export const VibrateActuator = () => {
  return (
    <div className="hidden">
      {/* @ts-ignore */}
      <input type="checkbox" id="vibrate-input" switch />
      <label htmlFor="vibrate-input" id="vibrate" />
    </div>
  );
};

/** This function is a HACK! */
export const vibrate = () => {
  const el = document.getElementById("vibrate");
  el?.click();
};
