export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
// Natively imports the secure edge execution vault directly from the environment
import { env } from 'cloudflare:workers'; 

export const POST: APIRoute = async ({ request }) => {
  try {
    // Read the secret key directly from the standard Cloudflare runtime bindings
    const apiKey = env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("Missing RESEND_API_KEY in modern Cloudflare runtime environments.");
    }

    const resend = new Resend(apiKey);

    let name = '';
    let email = '';
    let query = '';
    let honeypot = '';

    const contentType = request.headers.get('content-type') || '';

    // Insulated stream parser
    try {
      if (contentType.includes('application/json')) {
        const body = await request.json() as any;
        name = body['student-name']?.toString().trim() || '';
        email = body['student-email']?.toString().trim() || '';
        query = body['student-query']?.toString().trim() || '';
        honeypot = body['security-token']?.toString() || '';
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const rawBody = await request.text();
        const pairs = rawBody.split('&');
        const parsedData: Record<string, string> = {};

        for (const pair of pairs) {
          const [key, val] = pair.split('=');
          if (key) {
            try {
              const cleanKey = decodeURIComponent(key);
              const cleanVal = decodeURIComponent((val || '').replace(/\+/g, ' '));
              parsedData[cleanKey] = cleanVal;
            } catch {
              parsedData[key] = (val || '').replace(/\+/g, ' ');
            }
          }
        }
        name = parsedData['student-name'] || '';
        email = parsedData['student-email'] || '';
        query = parsedData['student-query'] || '';
        honeypot = parsedData['security-token'] || '';
      } else {
        const data = await request.formData();
        name = data.get('student-name')?.toString().trim() || '';
        email = data.get('student-email')?.toString().trim() || '';
        query = data.get('student-query')?.toString().trim() || '';
        honeypot = data.get('security-token')?.toString() || '';
      }
    } catch (parseError) {
      console.error("Request body processing bypass activated:", parseError);
    }
    
    if (honeypot && honeypot.length > 0) {
      return new Response(JSON.stringify({ success: true, message: "Spam filtered." }), { status: 200 });
    }

    if (!name || !email || !query) {
      return new Response(JSON.stringify({ error: "Missing required parameters." }), { status: 400 });
    }

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