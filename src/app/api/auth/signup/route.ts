import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import bcrypt from "bcrypt";

type UserData = {
  email: string;
  password: string;
  username: string;
};
export async function POST(req: Request) {
  try {
    //data received from front-end
    const body: UserData = await req.json();
    const { email, password, username } = body;

    // confirm that no filed is empty
    if (!email || !password || !username) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    //   to check if a suer already exist from the data the suer supplied:
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "This email already exist!" },
        { status: 400 }
      );
    }
    //   hash user's password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        provider: "credentials",
      },
    });
    // if sign up details meet all criteria, sign user in
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    // handles error
    console.log("Sign up error", error);
    NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
