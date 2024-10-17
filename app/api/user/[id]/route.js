import dbConnect from '@/libs/db'; 
import User from '@/models/User'; 
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params; 
  await dbConnect(); 

  try {
    const user = await User.findById(id).select('-password');

    if (!user) {
      return new NextResponse(
        JSON.stringify(
            { 
                success: false, 
                message: 'User not found' 
            }
            ),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new NextResponse(
      JSON.stringify(
        { 
            success: true, 
            message: user 
        }
        ),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Error retrieving user' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
