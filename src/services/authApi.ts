import api from './api'
import { ApiResponse, LoginRequest, LoginResponse, CreateUserRequest, User } from '../types'

export const login = (data: LoginRequest) =>
  api.post<ApiResponse<LoginResponse>>('/auth/login', data).then((res) => res.data)

export const register = (data: CreateUserRequest) =>
  api.post<ApiResponse<User>>('/auth/register', data).then((res) => res.data)
