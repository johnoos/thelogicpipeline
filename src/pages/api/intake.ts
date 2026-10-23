export const prerender = false;
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  try {
    const apiKey = env.RESEND_API_KEY;
    const resend = new Resend(apiKey);
    let name = '';
    let email = '';
    let query = '';
    let honeypot = '';
    const contentType = request.headers.get('content-type') || '';
    
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
      console.error("Parser bypass activated:", parseError);
    }

    if (honeypot && honeypot.length > 0) return new Response(JSON.stringify({ success: true }), { status: 200 });
    if (!name || !email || !query) return new Response(JSON.stringify({ error: "Missing parameters." }), { status: 400 });

    const { error } = await resend.emails.send({
      from: 'The Logic Pipeline Vault <vault@johnoosthuizen.com>',
      to: ['john@johnoosthuizen.com'],
      replyTo: email,
      subject: `Intake Application or Query: October-November Cohort`,
      html: `<h2>THE LOGIC PIPELINE INTAKE AND QUERY PARAMETERS</h2><p><strong>Candidate Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><br /><p><strong>Context:</strong></p><blockquote style="background:#f4f6f5; padding:15px; border-left:3px solid #127C44;">${query.replace(/\n/g, '<br />')}</blockquote>`
    });

    if (error) throw new Error(error.message);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};