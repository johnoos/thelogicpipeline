export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Extract the API key safely from the Cloudflare environment runtime context
    const runtimeEnv = locals?.runtime?.env;
    const apiKey = runtimeEnv?.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("Missing RESEND_API_KEY in Cloudflare runtime environments.");
    }

    const resend = new Resend(apiKey);

    const data = await request.formData();
    
    // Capture data objects precisely
    const name = data.get('student-name')?.toString().trim();
    const email = data.get('student-email')?.toString().trim();
    const query = data.get('student-query')?.toString().trim();
    
    // LAYER GUARD: Anti-Spam Honeypot Detection
    const honeypot = data.get('security-token')?.toString();
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
    return new Response(JSON.stringify({ error: "Internal transmission line delay." }), { status: 500 });
  } 
};