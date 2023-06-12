
import { api } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    // pegar todos parametros da url
  const { searchParams } = new URL(request.url)
   // pego code da url
  const code = searchParams.get('code')
  // recupero cookie de redirect 
  const redirectTo = request.cookies.get("redirectTo")?.value
  // Faço o post para minha API
  const registerResponse = await api.post('/register', {
    code,
  })
     
  // me retorna o token
  const { token } = registerResponse.data
 console.log(token)
  // // redirecionar
  const redirectURL = redirectTo ?? new URL('/', request.url)

  const cookieExpiresInSeconds = 60 * 60 * 24 * 30
  // disponivel para toda aplicação
  return NextResponse.redirect(redirectURL, {
    headers: {
      'Set-Cookie': `token=${token}; Path=/; max-age=${cookieExpiresInSeconds};`,
    },
  })
}