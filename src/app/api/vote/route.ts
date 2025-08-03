import { NextRequest, NextResponse } from 'next/server';
import { getTypedSupabaseClient } from '@/lib/supabase';
import { DemoVoteStorage } from '@/lib/demo-data';

const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { avatar_id, device_id, vote_type } = body;

    if (!avatar_id || !device_id || !vote_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (vote_type !== 'up' && vote_type !== 'down') {
      return NextResponse.json(
        { error: 'Invalid vote type. Must be "up" or "down"' },
        { status: 400 }
      );
    }

    // Use demo storage if Supabase is not configured
    if (!isSupabaseConfigured()) {
      if (DemoVoteStorage.hasVoted(avatar_id)) {
        return NextResponse.json(
          { error: 'You have already voted for this avatar' },
          { status: 409 }
        );
      }

      DemoVoteStorage.addVote(avatar_id, vote_type);
      
      return NextResponse.json({
        vote: {
          id: `demo-${Date.now()}`,
          avatar_id,
          device_id,
          vote_type,
          created_at: new Date().toISOString()
        }
      }, { status: 201 });
    }

    const supabase = getTypedSupabaseClient();
    
    // Check if user has already voted for this avatar
    const { data: existingVote, error: checkError } = await supabase
      .from('niranjan_votes')
      .select('id')
      .eq('avatar_id', avatar_id)
      .eq('device_id', device_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing vote:', checkError);
      return NextResponse.json(
        { error: 'Failed to check existing vote' },
        { status: 500 }
      );
    }

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted for this avatar' },
        { status: 409 }
      );
    }

    // Create the vote
    const { data: vote, error: voteError } = await supabase
      .from('niranjan_votes')
      .insert({
        avatar_id,
        device_id,
        vote_type,
      })
      .select()
      .single();

    if (voteError) {
      console.error('Error creating vote:', voteError);
      return NextResponse.json(
        { error: 'Failed to create vote' },
        { status: 500 }
      );
    }

    return NextResponse.json({ vote }, { status: 201 });
  } catch (error) {
    console.error('Error in vote API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const avatarId = searchParams.get('avatar_id');

    if (!avatarId) {
      return NextResponse.json(
        { error: 'Avatar ID is required' },
        { status: 400 }
      );
    }

    const supabase = getTypedSupabaseClient();
    
    // Get vote counts for the avatar
    const { data: votes, error } = await supabase
      .from('niranjan_votes')
      .select('vote_type')
      .eq('avatar_id', avatarId);

    if (error) {
      console.error('Error fetching votes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch votes' },
        { status: 500 }
      );
    }

    const upVotes = votes?.filter(vote => vote.vote_type === 'up').length || 0;
    const downVotes = votes?.filter(vote => vote.vote_type === 'down').length || 0;
    const totalVotes = upVotes + downVotes;

    return NextResponse.json({
      avatar_id: avatarId,
      up_votes: upVotes,
      down_votes: downVotes,
      total_votes: totalVotes,
    });
  } catch (error) {
    console.error('Error in vote GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}