import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
 type CreateTodoInput = { title: string };

// for creating new todos
export async function POST(req:Request) {
    // gets the current user
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    // receives the request from the frontend:
    //REMEMBER TO TYPE THIS!!
    const body:CreateTodoInput = await req.json();

    const newTodo = await prisma.todo.create ({
        data: {
            title: body.title,
            completed: false,
            userId: session.user.id  
        }
    })

    return NextResponse.json(newTodo)
}

// gets todo list
export async function GET() {
    // gets the current user
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }
    const todos = await prisma.todo.findMany({
        where: {userId: session.user.id},
        orderBy: {createdAt: "desc"}
    })
    return NextResponse.json(todos)
}
// edits todo
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const updated = await prisma.todo.update({
      where: { id: Number(body.id) },
      data: {
        title: body.title,
        completed: body.completed,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

//delete todo
// DELETE /api/todo/[id]
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    await prisma.todo.delete({
      where: { id: Number(body.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}

