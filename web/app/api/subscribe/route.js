import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/resend';

export async function POST(request) {
  try {
    const { email, message } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required.' }, { status: 400 });
    }

    // Store subscriber in Supabase (if configured)
    const supabase = getSupabaseServer();
    if (supabase) {
      const { error: dbError } = await supabase
        .from('subscribers')
        .upsert(
          { email: email.toLowerCase().trim(), message: message || null },
          { onConflict: 'email' }
        );
      if (dbError) {
        console.error('Supabase insert error:', dbError);
      }
    }

    // Send welcome email via Resend (if configured)
    try {
      await sendWelcomeEmail(email);
    } catch (emailErr) {
      console.error('Welcome email error:', emailErr);
      // Non-fatal — subscriber is still saved
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 });
  }
}
