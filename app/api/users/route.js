import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await User.find().select('-password') 

    const formattedUsers = users.map(user => {
      const formattedDateOfBirth = user.dateOfBirth
        ? user.dateOfBirth.toISOString().split('T')[0] 
        : null;

      return {
        ...user.toObject(),
        dateOfBirth: formattedDateOfBirth, 
      };
    });

    return NextResponse.json({
      success: true,
      message: formattedUsers,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error retrieving users',
    });
  }
}