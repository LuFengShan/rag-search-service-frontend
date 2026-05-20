import api from './api'
import { ApiResponse, User, PagedResponse, UpdateUserRequest, CreateUserRequest } from '../types'

export const getUsers = (page = 0, pageSize = 10) =>
  api.get<ApiResponse<PagedResponse<User>>>('/admin/users', { params: { page, pageSize } }).then((res) => res.data)

export const getUser = (id: string) =>
  api.get<ApiResponse<User>>(`/admin/users/${id}`).then((res) => res.data)

export const createUser = (data: CreateUserRequest) =>
  api.post<ApiResponse<User>>('/auth/register', data).then((res) => res.data)

export const updateUser = (id: string, data: UpdateUserRequest) =>
  api.put<ApiResponse<User>>(`/admin/users/${id}`, data).then((res) => res.data)

export const deleteUser = (id: string) =>
  api.delete<ApiResponse<null>>(`/admin/users/${id}`).then((res) => res.data)
