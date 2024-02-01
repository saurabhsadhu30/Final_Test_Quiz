import classes from "./Auth.module.css";

function Login({ emailInput, passwordInput, onChange, onFocus }) {
  return (
    <>
      <div className={classes["input-container"]}>
        <label className={classes["input-label"]} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`${classes.input} ${
            emailInput.error ? classes["input-error"] : ""
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
            passwordInput.error ? classes["input-error"] : ""
          }`}
          value={
            !passwordInput.error ? passwordInput.value : passwordInput.error
          }
          onChange={(e) => onChange(e, "password")}
          onFocus={onFocus}
        />
      </div>
    </>
  );
}

export default Login;
