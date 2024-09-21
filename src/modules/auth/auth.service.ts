import axios from "axios";
import { ILoginUserInput, ILoginUserReturn } from "./auth.schema";
import { signJwt, verifyPassword } from "../../utils/security";
import { createUser, findUserByEmail, findUserByUsername } from "../user/user.service";
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

export const handleGithubRedirect = async (code: string) => {
  try {
      console.log('Starting GitHub OAuth flow with code:', code);

      // Exchange code for access token
      console.log('Exchanging code for access token...');
      const tokenResponse = await axios.post<GithubTokenResponse>('https://github.com/login/oauth/access_token', {
          client_id: config.GITHUB_CLIENT_ID,
          client_secret: config.GITHUB_CLIENT_SECRET,
          code,
      }, {
          headers: { Accept: 'application/json' }
      });
      console.log('Token response:', tokenResponse.data);
      const accessToken = tokenResponse.data.access_token;
      console.log('Access token received:', accessToken);

      // Get user info from GitHub
      console.log('Fetching user info from GitHub...');
      const userResponse = await axios.get<GithubUserResponse>('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${accessToken}` }
      });

      const { email, login: username, name } = userResponse.data;
      console.log('User info retrieved:', { email, username, name });

      // Check if user exists in our database
      console.log('Checking if user exists in the database...');
      let user = await findUserByUsername(username);

      if (!user) {
          console.log('User not found, creating a new user...');
          const password = crypto.randomBytes(16).toString('hex');
          // Create new user if not exists
          user = await createUser({
              email,
              username,
              name,
              password: password, // GitHub users don't have a password in our system
              githubId: userResponse.data.id
          });
          console.log('New user created:', user);
      } else {
          console.log('User found in the database:', user);
      }

      // Sign JWT
      console.log('Signing JWT for user...');
      const token = await signJwt(
          {
              id: user.id,
              email: user.email,
              username: user.username,
          },
          { expiresIn: '7d' }
      );

      console.log('JWT signed successfully.');
      return { token, user };
  } catch (error) {
      console.error('Error in GitHub OAuth flow:', error);
      throw new Error('Failed to authenticate with GitHub');
  }
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
