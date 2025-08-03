import { NextRequest, NextResponse } from 'next/server';
import { getTypedSupabaseClient } from '@/lib/supabase';
import { DEMO_AVATARS } from '@/lib/demo-data';

const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const persona = searchParams.get('persona');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Use demo data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      let filteredAvatars = DEMO_AVATARS;
      
      if (persona) {
        filteredAvatars = DEMO_AVATARS.filter(avatar => avatar.persona_tag === persona);
      }
      
      const paginatedAvatars = filteredAvatars.slice(offset, offset + limit);
      return NextResponse.json({ avatars: paginatedAvatars });
    }

    const supabase = getTypedSupabaseClient();
    
    let query = supabase
      .from('niranjan_avatars')
      .select('*')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (persona) {
      query = query.eq('persona_tag', persona);
    }

    const { data: avatars, error } = await query;

    if (error) {
      console.error('Error fetching avatars:', error);
      return NextResponse.json(
        { error: 'Failed to fetch avatars' },
        { status: 500 }
      );
    }

    return NextResponse.json({ avatars: avatars || [] });
  } catch (error) {
    console.error('Error in avatars API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_url, voice_type, persona_tag, script, heygen_video_url } = body;

    if (!image_url || !voice_type || !persona_tag || !script) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getTypedSupabaseClient();
    
    const { data: avatar, error } = await supabase
      .from('niranjan_avatars')
      .insert({
        image_url,
        voice_type,
        persona_tag,
        script,
        heygen_video_url,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating avatar:', error);
      return NextResponse.json(
        { error: 'Failed to create avatar' },
        { status: 500 }
      );
    }

    return NextResponse.json({ avatar }, { status: 201 });
  } catch (error) {
    console.error('Error in avatars POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}