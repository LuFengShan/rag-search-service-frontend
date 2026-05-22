import api from './api'
import { ApiResponse, LoginRequest, LoginResponse, CreateUserRequest, User, RefreshTokenRequest } from '../types'

export const login = (data: LoginRequest) =>
  api.post<ApiResponse<LoginResponse>>('/auth/login', data).then((res) => res.data)

export const register = (data: CreateUserRequest) =>
  api.post<ApiResponse<User>>('/auth/register', data).then((res) => res.data)

export const refreshToken = (data: RefreshTokenRequest) =>
  api.post<ApiResponse<LoginResponse>>('/auth/refresh', data).then((res) => res.data)

export const logout = () =>
  api.post<ApiResponse<void>>('/auth/logout').then((res) => res.data)
