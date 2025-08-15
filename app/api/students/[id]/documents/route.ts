import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const documentsJson = formData.get("documents");
    const documents = JSON.parse(documentsJson as string);
    const studentId = params.id;

    // Delete all existing documents for this student
    await prisma.document.deleteMany({
      where: { studentId },
    });

    // Create new documents based on checkbox status
    const documentsToCreate = documents
      .filter((doc: any) => doc.isSubmitted)
      .map((doc: any) => ({
        studentId,
        type: doc.type,
        isSubmitted: true,
        submittedAt: doc.submittedAt ? new Date(doc.submittedAt) : new Date(),
      }));

    if (documentsToCreate.length > 0) {
      await prisma.document.createMany({
        data: documentsToCreate,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating documents:", error);
    return NextResponse.json(
      { error: "Failed to update documents" },
      { status: 500 }
    );
  }
}
