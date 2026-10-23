import type { APIRoute } from 'astro';

// In-memory data repository mock (Substitute with standard database adapter hooks like Prisma or Drizzle)
let currentRegistrationsCount = 2; 
const COHORT_MAX_CAPACITY = 4;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const studentName = formData.get('name')?.toString().trim();
    const studentEmail = formData.get('email')?.toString().trim();

    // Data Presence Interrogation Rules
    if (!studentName || !studentEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing Required Allocation Parameters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } } 
      );
    }

    // Capacity Constraint Boundary Inspection
    if (currentRegistrationsCount >= COHORT_MAX_CAPACITY) {
      return new Response(
        JSON.stringify({ error: 'Cohort Capacity Sequestration Triggered. Track Enrolment Terminated.' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Success Loop execution and database assignment allocation step
    currentRegistrationsCount++;
    
    return new Response(
      JSON.stringify({
        message: 'Registration Logged Successfully.',
        remainingSlots: COHORT_MAX_CAPACITY - currentRegistrationsCount
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Systemic Transmission Failure.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};