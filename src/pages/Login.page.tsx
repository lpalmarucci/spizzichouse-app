import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Title from "../components/Title.component";
import { useSignIn } from "react-auth-kit";
import { ApiError } from "../models/ApiError";
import useFetch from "../hooks/useFetch";
import { useToast } from "../context/Toast.context";
import { LoginResponse } from "../models/Login";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/common.routes";
import { ApiEndpoint } from "../models/constants";

type Props = {};

const LoginPage = (props: Props) => {
  const { t } = useTranslation();
  const signIn = useSignIn();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const fetchData = useFetch();
  const navigate = useNavigate();
  const { add } = useToast();

  function handleLogin() {
    fetchData<LoginResponse>(ApiEndpoint.login, "post", {
      body: JSON.stringify({ username, password }),
    })
      .then((data) => {
        if (
          signIn({
            token: data.access_token,
            tokenType: "Bearer",
            authState: data,
            expiresIn: 1695939469,
          })
        ) {
          navigate("/");
        }
      })
      .catch((error: ApiError) => add({ message: error.message, type: "error" }));
  }

  return (
    <div className=" w-full h-[100dvh] dark text-foreground bg-background flex justify-center items-center">
      <div className="flex flex-col gap-8">
        <Title>{t("appName")}</Title>
        <form className="flex flex-col gap-4">
          <Input
            type="text"
            label={t("label.username")}
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            label={t("label.password")}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin} color="primary">
            {t("buttons.login")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
