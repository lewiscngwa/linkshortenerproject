import { NextRequest, NextResponse } from 'next/server';
import { getLinkByCode } from '@/data/links';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> },
) {
  const { shortcode } = await params;

  // Fetch the link from the database
  const link = await getLinkByCode(shortcode);

  // If link not found, return 404
  if (!link) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }

  // Redirect to the destination URL
  return NextResponse.redirect(link.destinationUrl, { status: 307 });
}
