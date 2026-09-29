import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { FaEye as EyeIcon, FaEyeSlash as EyeSlashIcon } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input, InputGroup } from "rsuite";
import { setLoading } from "@/libs/store/reducer/reducer";
import { useAppDispatch } from "@/libs/store/store";
import { login, LoginType } from "@/services/auth";
import {
  AuthAlternateButtons,
  AuthHeader,
  AuthSubmitButton,
} from "@/components/pages/auth/auth-ui";

interface ILoginPasswordProps {
  setType: Dispatch<SetStateAction<LoginType>>;
}

const LoginPassword = ({ setType }: ILoginPasswordProps) => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const onSubmitLogin = async () => {
    if (email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      dispatch(setLoading(true));

      const res = await login(email, password);

      if (res && res.status >= 200 && res.status < 300) {
        localStorage.setItem("access_token", res.data.data.accessToken);
        localStorage.setItem("refresh_token", res.data.data.refreshToken);

        nav("/");
      }

      dispatch(setLoading(false));
    } else {
      toast.error("Please enter a valid email");
    }
  };

  const reset = useCallback(() => {
    setEmail("");
    setPassword("");
  }, []);

  return (
    <>
      <div>
        <AuthHeader title="Sign In" subtitle="Enter your email and password" />

        <div>
          <Input
            className="w-full mb-4"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e)}
            autoComplete="email"
          />

          <InputGroup inside>
            <Input
              type={visible ? "text" : "password"}
              className="w-full"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e)}
              autoComplete="password"
            />
            <InputGroup.Button onClick={() => setVisible(!visible)}>
              {visible ? <EyeIcon /> : <EyeSlashIcon />}
            </InputGroup.Button>
          </InputGroup>
        </div>

        <AuthSubmitButton
          disabled={!email || !password}
          onClick={onSubmitLogin}
        >
          Sign In
        </AuthSubmitButton>
      </div>

      <div className="mt-6">
        <AuthAlternateButtons
          currentType={LoginType.password}
          onSelectType={(type) => {
            setType(type);
            reset();
          }}
        />
      </div>
    </>
  );
};

export default LoginPassword;
