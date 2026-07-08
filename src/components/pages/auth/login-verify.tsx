import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input, InputGroup, Tooltip, Whisper } from "rsuite";
import { LoginType } from "@/services/auth";
import {
  AuthAlternateButtons,
  AuthBackButton,
  AuthHeader,
  AuthSubmitButton,
} from "@/components/pages/auth/auth-ui";

interface ILoginVerifyConfig {
  loginType: LoginType;
  requestType: string;
  promptSubtitle: string;
  inputPlaceholder: string;
  inputAutoComplete: string;
  verificationTitle: string;
  verificationSubtitle: ReactNode;
  invalidMessage: string;
  isValid: (value: string) => boolean;
  toCredentials: (value: string) => { phoneNumber?: string; email?: string };
  sanitizeInput?: (value: string) => string | null;
  inputAddon?: string;
  inputTooltip?: string;
}

const phoneLoginConfig: ILoginVerifyConfig = {
  loginType: LoginType.phoneNumber,
  requestType: "phoneNumber",
  promptSubtitle: "Enter your phone to sign in",
  inputPlaceholder: "Your Phone Number",
  inputAutoComplete: "tel-national",
  verificationTitle: "Phone verification",
  verificationSubtitle: (
    <>
      Please enter your code
      <br />
      that send to your phone
    </>
  ),
  invalidMessage: "Please enter a valid phone number",
  isValid: (value) => /^\d+$/.test(value),
  toCredentials: (value) => ({ phoneNumber: `+${value}` }),
  sanitizeInput: (value) =>
    /^\d+$/.test(value) || value === "" ? value : null,
  inputAddon: "+",
  inputTooltip: "Please input your phone with country code",
};

const emailLoginConfig: ILoginVerifyConfig = {
  loginType: LoginType.email,
  requestType: "email",
  promptSubtitle: "Enter your email to sign in",
  inputPlaceholder: "Your Email Address",
  inputAutoComplete: "email",
  verificationTitle: "Email verification",
  verificationSubtitle: (
    <>
      Please enter your code
      <br />
      that send to your email
    </>
  ),
  invalidMessage: "Please enter a valid email",
  isValid: (value) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
  toCredentials: (value) => ({ email: value }),
};

interface ILoginVerifyProps {
  loginType: LoginType;
  setType: Dispatch<SetStateAction<LoginType>>;
  onSubmit: (
    type: string,
    phoneNumber?: string,
    email?: string,
  ) => Promise<void>;
  onVerifyCode: (
    type: string,
    code: string,
    phoneNumber?: string,
    email?: string,
  ) => Promise<void>;
}

const LoginVerify = ({
  loginType,
  setType,
  onSubmit,
  onVerifyCode,
}: ILoginVerifyProps) => {
  const nav = useNavigate();

  const config =
    loginType === LoginType.email ? emailLoginConfig : phoneLoginConfig;

  const [value, setValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState("");
  const [code, setCode] = useState("");

  const credentials = config.toCredentials(value);

  const onValueChange = (next: string) => {
    if (config.sanitizeInput) {
      const sanitized = config.sanitizeInput(next);
      if (sanitized === null) return;
      setValue(sanitized);
    } else {
      setValue(next);
    }
  };

  const onSubmitValue = async () => {
    if (config.isValid(value)) {
      setSubmittedValue(value);
      await onSubmit(
        config.requestType,
        credentials.phoneNumber,
        credentials.email,
      );
    } else {
      toast.error(config.invalidMessage);
    }
  };

  const onCodeChange = (next: string) => {
    if (next.match(/^\d+$/) && next.length <= 6) {
      setCode(next);
    }
  };

  const onSubmitCode = async () =>
    await onVerifyCode(
      config.requestType,
      code,
      credentials.phoneNumber,
      credentials.email,
    );

  const onResendCode = async () => {
    await onSubmitValue();
  };

  const reset = useCallback(() => {
    setValue("");
    setSubmittedValue("");
  }, []);

  const onBackClick = () => {
    if (submittedValue) {
      reset();
    } else {
      nav("/");
    }
  };

  const inputControl = config.inputAddon ? (
    <InputGroup inside>
      <InputGroup.Addon>{config.inputAddon}</InputGroup.Addon>
      <Input
        className="w-full"
        placeholder={config.inputPlaceholder}
        value={value}
        onChange={onValueChange}
        autoComplete={config.inputAutoComplete}
      />
    </InputGroup>
  ) : (
    <Input
      className="w-full"
      placeholder={config.inputPlaceholder}
      value={value}
      onChange={onValueChange}
      autoComplete={config.inputAutoComplete}
    />
  );

  return (
    <>
      <AuthBackButton onClick={onBackClick} hidden={!submittedValue} />

      {!submittedValue ? (
        <div>
          <AuthHeader title="Sign In" subtitle={config.promptSubtitle} />

          <div>
            {config.inputTooltip ? (
              <Whisper
                placement="bottom"
                speaker={<Tooltip>{config.inputTooltip}</Tooltip>}
              >
                {inputControl}
              </Whisper>
            ) : (
              inputControl
            )}
          </div>

          <AuthSubmitButton disabled={!value} onClick={onSubmitValue}>
            Next
          </AuthSubmitButton>
        </div>
      ) : (
        <div>
          <AuthHeader
            title={config.verificationTitle}
            subtitle={config.verificationSubtitle}
          />

          <div>
            <Input
              className="w-full"
              placeholder="Enter your code"
              value={code}
              onChange={onCodeChange}
            />
          </div>

          <AuthSubmitButton disabled={!code} onClick={onSubmitCode}>
            Submit
          </AuthSubmitButton>
        </div>
      )}

      {!submittedValue ? (
        <div className="mt-6">
          <AuthAlternateButtons
            currentType={config.loginType}
            onSelectType={(type) => {
              setType(type);
              reset();
            }}
          />
        </div>
      ) : (
        <div className="mt-6 text-center">
          Code not receive?{" "}
          <Link to="#" onClick={onResendCode}>
            Send again
          </Link>
        </div>
      )}
    </>
  );
};

export default LoginVerify;
