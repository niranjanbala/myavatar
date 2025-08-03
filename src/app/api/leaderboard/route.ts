import { NextRequest, NextResponse } from 'next/server';
import { getTypedSupabaseClient } from '@/lib/supabase';
import { DEMO_AVATARS, DemoVoteStorage } from '@/lib/demo-data';

const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const persona = searchParams.get('persona');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Use demo data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      let filteredAvatars = DEMO_AVATARS;
      
      if (persona) {
        filteredAvatars = DEMO_AVATARS.filter(avatar => avatar.persona_tag === persona);
      }

      const votes = DemoVoteStorage.getVotes();
      
      const leaderboardData = filteredAvatars.map(avatar => {
        const avatarVotes = votes[avatar.id] || { up: 0, down: 0 };
        const totalVotes = avatarVotes.up + avatarVotes.down;
        
        return {
          ...avatar,
          vote_count: totalVotes,
          up_votes: avatarVotes.up,
          down_votes: avatarVotes.down,
          approval_rate: totalVotes > 0 ? Math.round((avatarVotes.up / totalVotes) * 100 * 100) / 100 : 0
        };
      }).sort((a, b) => {
        if (b.vote_count !== a.vote_count) {
          return b.vote_count - a.vote_count;
        }
        return b.approval_rate - a.approval_rate;
      }).slice(0, limit);

      return NextResponse.json({ leaderboard: leaderboardData });
    }

    // Get avatars with vote counts using a raw SQL query for better performance
    let query = `
      SELECT
        a.*,
        COALESCE(v.total_votes, 0) as vote_count,
        COALESCE(v.up_votes, 0) as up_votes,
        COALESCE(v.down_votes, 0) as down_votes,
        CASE
          WHEN COALESCE(v.total_votes, 0) = 0 THEN 0
          ELSE ROUND((COALESCE(v.up_votes, 0)::float / COALESCE(v.total_votes, 0)::float) * 100, 2)
        END as approval_rate
      FROM niranjan_avatars a
      LEFT JOIN (
        SELECT
          avatar_id,
          COUNT(*) as total_votes,
          COUNT(CASE WHEN vote_type = 'up' THEN 1 END) as up_votes,
          COUNT(CASE WHEN vote_type = 'down' THEN 1 END) as down_votes
        FROM niranjan_votes
        GROUP BY avatar_id
      ) v ON a.id = v.avatar_id
    `;

    if (persona) {
      query += ` WHERE a.persona_tag = '${persona}'`;
    }

    query += ` ORDER BY vote_count DESC, approval_rate DESC LIMIT ${limit}`;

    const supabase = getTypedSupabaseClient();
    
    const { data: leaderboard, error } = await supabase.rpc('execute_sql', {
      sql_query: query
    });

    // If the RPC function doesn't exist, fall back to a simpler approach
    if (error && error.message.includes('function execute_sql')) {
      // Fallback: Get avatars and votes separately
      let avatarQuery = supabase
        .from('niranjan_avatars')
        .select('*')
        .limit(limit)
        .order('created_at', { ascending: false });

      if (persona) {
        avatarQuery = avatarQuery.eq('persona_tag', persona);
      }

      const { data: avatars, error: avatarError } = await avatarQuery;

      if (avatarError) {
        console.error('Error fetching avatars:', avatarError);
        return NextResponse.json(
          { error: 'Failed to fetch avatars' },
          { status: 500 }
        );
      }

      // Get vote counts for each avatar
      const avatarIds = avatars?.map((a) => a.id) || [];
      const { data: votes, error: voteError } = await supabase
        .from('niranjan_votes')
        .select('avatar_id, vote_type')
        .in('avatar_id', avatarIds);

      if (voteError) {
        console.error('Error fetching votes:', voteError);
        return NextResponse.json(
          { error: 'Failed to fetch votes' },
          { status: 500 }
        );
      }

      // Calculate vote counts
      const votesByAvatar = votes?.reduce((acc: Record<string, { up: number; down: number; total: number }>, vote) => {
        if (!acc[vote.avatar_id]) {
          acc[vote.avatar_id] = { up: 0, down: 0, total: 0 };
        }
        acc[vote.avatar_id][vote.vote_type === 'up' ? 'up' : 'down']++;
        acc[vote.avatar_id].total++;
        return acc;
      }, {} as Record<string, { up: number; down: number; total: number }>) || {};

      // Combine avatars with vote data
      const leaderboardData = avatars?.map((avatar) => ({
        ...avatar,
        vote_count: votesByAvatar[avatar.id]?.total || 0,
        up_votes: votesByAvatar[avatar.id]?.up || 0,
        down_votes: votesByAvatar[avatar.id]?.down || 0,
        approval_rate: votesByAvatar[avatar.id]?.total
          ? Math.round((votesByAvatar[avatar.id].up / votesByAvatar[avatar.id].total) * 100 * 100) / 100
          : 0
      })).sort((a, b) => {
        if (b.vote_count !== a.vote_count) {
          return b.vote_count - a.vote_count;
        }
        return b.approval_rate - a.approval_rate;
      }) || [];

      return NextResponse.json({ leaderboard: leaderboardData });
    }

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard' },
        { status: 500 }
      );
    }

    return NextResponse.json({ leaderboard: leaderboard || [] });
  } catch (error) {
    console.error('Error in leaderboard API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}