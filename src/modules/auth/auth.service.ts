import axios from "axios";
import { ILoginUserInput, ILoginUserReturn } from "./auth.schema";
import { signJwt, verifyPassword } from "../../utils/security";
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByUsername,
} from "../user/user.service";
import crypto from "crypto";
import config from "../../core/config";

interface GithubTokenResponse {
  access_token: string;
}

interface GithubUserResponse {
  email: string;
  login: string;
  name: string;
  id: string;
}

export const getCurrentUser = async (userId: number) => {
  return await findUserById(userId);
};  

export const getGithubOAuthUrl = () => {
  const scopes = ["user:email", "read:user"];
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${config.GITHUB_CLIENT_ID}&scope=${scopes.join(
    " "
  )}`;
  return githubAuthUrl;
};

export const handleGithubRedirect = async (code: string) => {
  const tokenResponse = await axios.post<GithubTokenResponse>(
    "https://github.com/login/oauth/access_token",
    {
      client_id: config.GITHUB_CLIENT_ID,
      client_secret: config.GITHUB_CLIENT_SECRET,
      code,
    },
    {
      headers: { Accept: "application/json" },
    }
  );
  const accessToken = tokenResponse.data.access_token;

  const userResponse = await axios.get<GithubUserResponse>(
    "https://api.github.com/user",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const { email, login: username, name } = userResponse.data;

  let user = await findUserByUsername(username);

  if (!user) {
    const password = crypto.randomBytes(16).toString("hex");
    user = await createUser({
      email,
      username,
      name,
      password: password,
      githubId: userResponse.data.id,
    });
  }

  const token = await signJwt(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    { expiresIn: "7d" }
  );

  return { token, user };
};

export const loginUser = async (
  payload: ILoginUserInput
): Promise<ILoginUserReturn> => {
  const user = await findUserByEmail(payload.email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!(await verifyPassword(user.password, payload.password))) {
    throw new Error("Password isn't valid");
  }

  const accessToken = await signJwt(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    { expiresIn: payload.rememberMe ? "30d" : "1d" }
  );

  const refreshToken = await signJwt(
    {
      id: user.id,
    },
    { expiresIn: payload.rememberMe ? "45d" : "7d" }
  );

  return {
    accessToken,
    refreshToken,
  };
};
