import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers'

export default async function page() {

    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    return <div>{
            JSON.stringify(session)
        }</div>
}