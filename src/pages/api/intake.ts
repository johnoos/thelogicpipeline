export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const runtimeEnv = locals?.runtime?.env;
    const apiKey = runtimeEnv?.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("Missing RESEND_API_KEY in Cloudflare runtime environments.");
    }

    const resend = new Resend(apiKey);

    // DYNAMIC PARSER: Safely reads the data whether the client sends it as JSON or Form parameters
    let name = '';
    let email = '';
    let query = '';
    let honeypot = '';

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json() as any;
      name = body['student-name']?.toString().trim() || '';
      email = body['student-email']?.toString().trim() || '';
      query = body['student-query']?.toString().trim() || '';
      honeypot = body['security-token']?.toString() || '';
    } else {
      const data = await request.formData();
      name = data.get('student-name')?.toString().trim() || '';
      email = data.get('student-email')?.toString().trim() || '';
      query = data.get('student-query')?.toString().trim() || '';
      honeypot = data.get('security-token')?.toString() || '';
    }
    
    // LAYER GUARD: Anti-Spam Honeypot Detection
    if (honeypot && honeypot.length > 0) {
      return new Response(JSON.stringify({ success: true, message: "Spam filtered." }), { status: 200 });
    }

    // Input Validation Boundary Check
    if (!name || !email || !query) {
      return new Response(JSON.stringify({ error: "Missing required parameters." }), { status: 400 });
    }

    // Secure Data Transmission Execution
    const { error } = await resend.emails.send({
      from: 'The Logic Pipeline Vault <onboarding@resend.dev>',
      to: ['joosthuizen@gmail.com'], 
      replyTo: email, 
      subject: `Intake Application or Query: October-November Cohort`,
      html: `
        <h2>THE LOGIC PIPELINE INTAKE AND QUERY PARAMETERS</h2>
        <hr />
        <p><strong>Candidate Full Name:</strong> ${name}</p>
        <p><strong>Academic / Corporate Email:</strong> ${email}</p>
        <br />
        <p><strong>Parameter Summary or Query Context:</strong></p>
        <blockquote style="background:#f4f6f5; padding:15px; border-left:3px solid #127C44;">
          ${query.replace(/\n/g, '<br />')}
        </blockquote>
      `
    });

    if (error) {
      throw new Error(error.message);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    console.error("Serverless route exception:", err);
    return new Response(JSON.stringify({ error: `Internal transmission delay: ${err.message}` }), { status: 500 });
  } 
};