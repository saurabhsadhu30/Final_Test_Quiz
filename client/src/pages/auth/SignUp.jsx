import classes from "./Auth.module.css";

function SingUp({
  nameInput,
  emailInput,
  passwordInput,
  passwordConfirmInput,
  onChange,
  onFocus,
}) {
  return (
    <>
      <div className={classes["input-container"]}>
        <label className={classes["input-label"]} htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="name"
          className={`${classes.input} ${
            nameInput.error && classes["input-error"]
          }`}
          value={!nameInput?.error ? nameInput.value : nameInput.error}
          onChange={(e) => onChange(e, "name")}
          onFocus={onFocus}
        />
      </div>

      <div className={classes["input-container"]}>
        <label className={classes["input-label"]} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`${classes.input} ${
            emailInput.error && classes["input-error"]
          }`}
          value={!emailInput.error ? emailInput.value : emailInput.error}
          onChange={(e) => onChange(e, "email")}
          onFocus={onFocus}
        />
      </div>

      <div className={classes["input-container"]}>
        <label className={classes["input-label"]} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type={passwordInput.error ? "text" : "password"}
          className={`${classes.input} ${
            passwordInput.error && classes["input-error"]
          }`}
          value={
            !passwordInput.error ? passwordInput.value : passwordInput.error
          }
          onChange={(e) => onChange(e, "password")}
          onFocus={onFocus}
        />
      </div>

      <div className={classes["input-container"]}>
        <label className={classes["input-label"]} htmlFor="password">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type={passwordConfirmInput.error ? "text" : "password"}
          className={`${classes.input} ${
            passwordConfirmInput.error && classes["input-error"]
          }`}
          value={
            !passwordConfirmInput?.error
              ? passwordConfirmInput.value
              : passwordConfirmInput.error
          }
          onChange={(e) => onChange(e, "passwordConfirm")}
          onFocus={onFocus}
        />
      </div>
    </>
  );
}

export default SingUp;
