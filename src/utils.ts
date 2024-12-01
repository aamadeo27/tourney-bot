import crypto from 'crypto'

export function requireEnv(name: string) {
  const value = process.env[name]

  if (!value) throw Error(`Environment Variable ${name} is not set`)

  return value
}

export function genId(){
  const input = `${Date.now()}-${Math.random()}`;
    
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 8);
}

export const teamId = (p1: string, p2: string) => {
  
  const input = p1 < p2 ? p1 + p2 : p2 + p1

  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 8);
}
