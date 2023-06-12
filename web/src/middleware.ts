import { NextRequest, NextResponse } from 'next/server'

const signInURL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    // esse redirect cria um novo cookie para guardar a rota em que estava
    //  HttpOnly ele tira a visibilidade e não fica disponivel no borwser
    return NextResponse.redirect(signInURL, {
      headers: {
        'Set-Cookie': `redirectTo=${request.url}; Path=/; HttpOnly; max-age=20;`,
      },
    })
  }
  
  return NextResponse.next()
}


// quais caminhos quero obrigar seja obrigatorio estar logado
export const config = {
  matcher: '/memories/:path*',
}
