import dbConnect from '@/libs/db'; 
import User from '@/models/User'; 
import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs'

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

export async function PUT(req, { params }) {
    const { id } = params; 
    await dbConnect();
    
    try {
        const user = await User.findById(id);

        if (!user) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'User not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const {
            name,
            email,
            dateOfBirth,
            gender,
            profileImageUrl,
            about,
            bio,
            instagramLink,
            isOrganizer,
            isSuspened,
            password
        } = await req.json();

        user.name = name || user.name;
        user.email = email || user.email;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.gender = gender || user.gender;
        user.profileImageUrl = profileImageUrl || user.profileImageUrl;
        user.about = about || user.about;
        user.bio = bio || user.bio;
        user.instagramLink = instagramLink || user.instagramLink;
        user.isOrganizer = isOrganizer !== undefined ? isOrganizer : user.isOrganizer;
        user.isSuspened = isSuspened !== undefined ? isSuspened : user.isSuspened;
        if (password) {
            const salt = await bcryptjs.genSalt(10); 
            const hashedPassword = await bcryptjs.hash(password, salt); 
            user.password = hashedPassword; 
        }
        const updatedUser = await user.save();

        return new NextResponse(
            JSON.stringify({ success: true, message: updatedUser }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        return new NextResponse(
          JSON.stringify({ success: false, message: 'Error retrieving or updating user' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}