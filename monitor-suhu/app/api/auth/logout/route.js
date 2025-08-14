import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        console.log('🚪 Logout API: Starting logout process...');

        const cookieStore = cookies();
        const token = cookieStore.get('token');

        if (!token) {
            console.log('⚠️ Logout API: No token found, but proceeding with logout');
        }

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

        console.log('✅ Logout API: Cookie cleared successfully');
        return response;

    } catch (error) {
        console.error('❌ Logout API error:', error);
        
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

