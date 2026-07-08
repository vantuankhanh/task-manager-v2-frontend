import { LoginType } from "@/services/auth";
import { ReactNode } from "react";
import {
  FaUser as AccountIcon,
  FaArrowLeft as ArrowBackIcon,
  FaEnvelope as EmailIcon,
  FaPhone as PhoneIcon,
} from "react-icons/fa6";
import { Button } from "rsuite";

export const AuthHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: ReactNode;
}) => (
  <div className="text-center mb-8">
    <div className="text-gray-900 text-3xl font-bold mb-3">{title}</div>
    <div className="text-gray-500 font-medium">{subtitle}</div>
  </div>
);

export const AuthSubmitButton = ({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <div className="mt-6">
    <Button
      disabled={disabled}
      className="w-full"
      color="blue"
      appearance="primary"
      onClick={onClick}
    >
      {children}
    </Button>
  </div>
);

export const AuthBackButton = ({
  onClick,
  hidden,
}: {
  onClick: () => void;
  hidden?: boolean;
}) => (
  <div className={`absolute top-0 left-0 p-5 ${hidden ? "hidden" : ""}`}>
    <Button appearance="subtle" onClick={onClick}>
      <div className="box-center gap-2">
        <ArrowBackIcon />
        <span className="font-bold">Back</span>
      </div>
    </Button>
  </div>
);

const alternateLoginLabels: Record<
  LoginType,
  { button: string; icon: ReactNode }
> = {
  [LoginType.phoneNumber]: {
    button: "Continue with phone",
    icon: <PhoneIcon />,
  },
  [LoginType.email]: {
    button: "Continue with email",
    icon: <EmailIcon />,
  },
  [LoginType.password]: {
    button: "Continue with account",
    icon: <AccountIcon />,
  },
};

const loginTypeOrder = [
  LoginType.phoneNumber,
  LoginType.email,
  LoginType.password,
];

const alternateTypes = (currentType: LoginType) =>
  loginTypeOrder.filter((type) => type !== currentType);

export const AuthAlternateButtons = ({
  currentType,
  onSelectType,
}: {
  currentType: LoginType;
  onSelectType: (type: LoginType) => void;
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-3 text-gray-400 text-sm">
      <span className="h-px flex-1 bg-gray-200" />
      or
      <span className="h-px flex-1 bg-gray-200" />
    </div>

    {alternateTypes(currentType).map((type) => (
      <Button
        key={type}
        appearance="ghost"
        color="blue"
        block
        onClick={() => onSelectType(type)}
      >
        <div className="box-center gap-2">
          {alternateLoginLabels[type].icon}
          <span>{alternateLoginLabels[type].button}</span>
        </div>
      </Button>
    ))}
  </div>
);
