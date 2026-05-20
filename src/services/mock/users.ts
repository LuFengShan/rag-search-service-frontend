import { User } from '../../types'

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@company.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    created_at: '2024-01-01 00:00:00'
  },
  {
    id: '2',
    username: '张三',
    email: 'zhangsan@company.com',
    role: 'maintainer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    created_at: '2024-01-10 08:30:00'
  },
  {
    id: '3',
    username: '李四',
    email: 'lisi@company.com',
    role: 'maintainer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    created_at: '2024-01-15 09:20:00'
  },
  {
    id: '4',
    username: '王五',
    email: 'wangwu@company.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
    created_at: '2024-01-20 10:15:00'
  },
  {
    id: '5',
    username: '赵六',
    email: 'zhaoliu@company.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
    created_at: '2024-01-25 14:45:00'
  }
]
