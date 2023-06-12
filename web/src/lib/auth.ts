import { cookies } from 'next/headers'
import decode from 'jwt-decode'
// interface
interface User {
  sub: string
  name: string
  avatarUrl: string
}

export function getUser(): User {
  // função do next
  const token = cookies().get('token')?.value

  if (!token) {
    throw new Error('Unauthenticated.')
  }
 // aqui ele decoda tudo 
  const user: User = decode(token)

  return user
}
