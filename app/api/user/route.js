import dbConnect from '@/libs/db';
import User from '@/models/User'; 

export async function GET(req, res) {
  await dbConnect(); 
    
  try {
    const users = await User.find().select('-password');

    const response = {
        success: true,
        message: users,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
    });
  }
}
