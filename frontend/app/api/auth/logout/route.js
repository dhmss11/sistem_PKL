import { cookies } from 'next/headers';

export async function POST(request) {
    try {

        const cookieStore = cookies();
        const token = cookieStore.get('token');

        const response = new Response(
            JSON.stringify({ 
                message: 'Logout sukses' 
            }), 
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': `token=; Path=/; HttpOnly; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=lax${
                        process.env.NODE_ENV === 'production' ? '; Secure' : ''
                    }`
                }
            }
        );

        console.log('cookie cleared successfully');
        return response;

    } catch (error) {
        console.error('Logout API error:', error);
        
        return new Response(
            JSON.stringify({ 
                message: 'Logout failed' 
            }), 
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}

