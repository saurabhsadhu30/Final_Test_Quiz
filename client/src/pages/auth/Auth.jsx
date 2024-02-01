import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import classes from "./Auth.module.css";

import { login, signup } from "../../requests/auth";
import { setUser } from "../../store/slices/authSlice";
import Login from "./Login";
import SignUp from "./SignUp";
import Loader from "../../components/Loader";

const Auth = () => {
  const [tab, setTab] = useState("signup");
  const [loader, setLoader] = useState(false);

  const [nameInput, setNameInput] = useState({
    value: "",
    error: "",
  });
  const [emailInput, setEmailInput] = useState({
    value: "",
    error: "",
  });

  const [passwordInput, setPasswordInput] = useState({
    value: "",
    error: "",
  });
  const [passwordConfirmInput, setPasswordConfirmInput] = useState({
    value: "",
    error: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function onChange(e, type) {
    switch (type) {
      case "name":
        setNameInput((prev) => ({
          ...prev,
          value: e.target.value,
          error: "",
        }));
        break;
      case "email":
        setEmailInput((prev) => ({
          ...prev,
          value: e.target.value,
          error: "",
        }));
        break;
      case "password":
        setPasswordInput((prev) => ({
          ...prev,
          value: e.target.value,
          error: "",
        }));
        break;
      case "passwordConfirm":
        setPasswordConfirmInput((prev) => ({
          ...prev,
          value: e.target.value,
          error: "",
        }));
        break;
    }
  }

  function clearInputField() {
    setEmailInput({
      value: "",
      error: "",
    });
    setNameInput({
      value: "",
      error: "",
    });
    setPasswordInput({
      value: "",
      error: "",
    });
    setPasswordConfirmInput({
      value: "",
      error: "",
    });
  }

  function onFocus() {
    setEmailInput((prev) => ({
      ...prev,
      error: "",
    }));
    setNameInput((prev) => ({
      ...prev,
      error: "",
    }));
    setPasswordInput((prev) => ({
      ...prev,
      error: "",
    }));
    setPasswordConfirmInput((prev) => ({
      ...prev,
      error: "",
    }));
  }

  function isLoginFieldValid() {
    let isValid = true;
    if (!emailInput.value) {
      setEmailInput((prev) => ({ ...prev, error: "Invalid Email" }));
      isValid = false;
    } else if (!passwordInput.value) {
      setPasswordInput((prev) => ({
        ...prev,
        error: "Please Fill Password",
      }));
      isValid = false;
    } else if (passwordInput.value.length < 4) {
      setPasswordInput((prev) => ({
        ...prev,
        error: "Weak Password",
      }));
      isValid = false;
    }

    return isValid;
  }

  function isSignUPFieldValid() {
    let isValid = true;
    if (!nameInput.value) {
      setNameInput((prev) => ({ ...prev, error: "Invalid Name" }));
      isValid = false;
    } else if (!emailInput.value) {
      setEmailInput((prev) => ({ ...prev, error: "Invalid Email" }));
      isValid = false;
    } else if (!passwordInput.value) {
      setPasswordInput((prev) => ({
        ...prev,
        error: "Please Fill Password",
      }));
      isValid = false;
    } else if (passwordInput.value.length < 4) {
      setPasswordInput((prev) => ({
        ...prev,
        error: "Weak Password",
      }));
      isValid = false;
    } else if (!passwordConfirmInput.value) {
      setPasswordConfirmInput((prev) => ({
        ...prev,
        error: "Please Fill Confirm Password",
      }));
      isValid = false;
    } else if (passwordInput.value !== passwordConfirmInput.value) {
      setPasswordConfirmInput((prev) => ({
        ...prev,
        error: "Password doesn't match",
      }));
      isValid = false;
    }

    return isValid;
  }

  async function submitFormHandler(e) {
    e.preventDefault();

    // validation
    if (tab === "login") {
      if (!isLoginFieldValid()) return;

      setLoader(true);

      const payload = {
        email: emailInput.value,
        password: passwordInput.value,
      };

      const { data, error } = await login(payload);

      if (error) {
        toast.error(data);
      } else {
        toast.success("Logged In Successfully!");
        Cookies.set("token", data?.token);
        localStorage.setItem("user", JSON.stringify(data?.user));
        dispatch(
          setUser({
            token: !!data.token,
            user: data.user,
          })
        );
        navigate("/dashboard");
      }
    } else {
      if (!isSignUPFieldValid()) return;

      setLoader(true);

      const payload = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        passwordConfirm: passwordConfirmInput.value,
      };

      const { data, error } = await signup(payload);

      if (error) {
        toast.error(data);
      } else {
        toast.success("Sign Up Successfully!");
        Cookies.set("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch(
          setUser({
            token: !!data.token,
            user: data.user,
          })
        );
        navigate("/dashboard");
      }
    }
    setLoader(false);
  }

  return (
    <main className="bg-gray-500 h-screen flex-center">
      <form
        className={`${classes["auth-container"]} bg-white flex flex-col items-center`}
        onSubmit={submitFormHandler}
      >
        <h3 className={classes["auth-heading"]}>QUIZZIE</h3>

        {/* tabs */}
        <div className={classes["auth-btns"]}>
          <button
            role="button"
            type="button"
            className={`${classes["auth-btn"]} ${
              tab === "signup" && classes["auth-btn-active"]
            }`}
            onClick={() => {
              setTab("signup");
              clearInputField();
            }}
          >
            Sign Up
          </button>
          <button
            role="button"
            type="button"
            className={`${classes["auth-btn"]} ${
              tab === "login" && classes["auth-btn-active"]
            }`}
            onClick={() => {
              setTab("login");
              clearInputField();
            }}
          >
            Log In
          </button>
        </div>

        <div className={classes["login-signup-container"]}>
          {tab === "login" ? (
            <Login
              emailInput={emailInput}
              passwordInput={passwordInput}
              onChange={onChange}
              onFocus={onFocus}
            />
          ) : (
            <SignUp
              nameInput={nameInput}
              emailInput={emailInput}
              passwordInput={passwordInput}
              passwordConfirmInput={passwordConfirmInput}
              onChange={onChange}
              onFocus={onFocus}
            />
          )}
        </div>

        {/* cta */}
        <div className="w-full flex-center">
          <button className={classes["auth-cta"]}>
            {tab === "login" ? "Log In" : "Sign-Up"} {loader && <Loader />}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Auth;
