import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'

export async function POST() {
  if (!prisma) return NextResponse.json({ error: 'no db' }, { status: 503 })
  try {
    // Create CrmColumn table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "CrmColumn" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        "color" TEXT NOT NULL DEFAULT '#6b7280',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "CrmColumn_pkey" PRIMARY KEY ("id")
      )
    `)

    // Create EnrichJob table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "EnrichJob" (
        "id" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'idle',
        "processed" INTEGER NOT NULL DEFAULT 0,
        "total" INTEGER NOT NULL DEFAULT 0,
        "lastError" TEXT,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "EnrichJob_pkey" PRIMARY KEY ("id")
      )
    `)

    // Add CRM columns to Provider if they don't exist
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Provider"
      ADD COLUMN IF NOT EXISTS "crmColumnId" TEXT,
      ADD COLUMN IF NOT EXISTS "crmOrder" INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "crmNotes" TEXT
    `)

    // Add foreign key if not exists
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'Provider_crmColumnId_fkey'
        ) THEN
          ALTER TABLE "Provider"
          ADD CONSTRAINT "Provider_crmColumnId_fkey"
          FOREIGN KEY ("crmColumnId") REFERENCES "CrmColumn"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        END IF;
      END $$
    `)

    return NextResponse.json({ ok: true, message: 'Migration applied successfully' })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
