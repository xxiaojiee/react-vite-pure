import { post, ICommonResponse } from "./request";
import { accountInfoApi } from '/@/api/demo/account';
import type { LoginParams, RegisterParams } from "/@/pages/auth/data";

interface LoginResponse extends ICommonResponse {
  data: {
    access_token: string;
  };
}

export function login(params: LoginParams) {
  return accountInfoApi();
  // return post<LoginResponse>("/api/user/v0/login/", params);
}

export async function register(params: RegisterParams) {
  return post("/api/user/v0/create/", params);
}

export interface IResetPasswordBody {
  phone: string;
  old_password: string;
  new_password: string;
}

export async function resetPassword(params: IResetPasswordBody) {
  return post("/api/user/v0/password/reset/", params);
}
