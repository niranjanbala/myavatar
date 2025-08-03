import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHeyGenVideoWithKey } from '@/lib/heygen';
import { AvatarCreationForm, ApiResponse, AvatarSubmission } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const formData: AvatarCreationForm = await request.json();
    
    // Validate required fields
    if (!formData.script || !formData.persona_tag || !formData.voice_type || !formData.heygen_api_key) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: script, persona_tag, voice_type, heygen_api_key'
      }, { status: 400 });
    }

    // For now, we'll use a placeholder user ID since we don't have auth yet
    // In production, you'd get this from the authenticated user
    const userId = '550e8400-e29b-41d4-a716-446655440000'; // Your user ID from schema

    // Check if supabase is available
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not available'
      }, { status: 500 });
    }

    try {
      // Step 1: Create submission record
      const { data: submission, error: submissionError } = await supabase
        .from('avatar_submissions')
        .insert({
          user_id: userId,
          status: 'processing',
          submission_data: {
            script: formData.script,
            persona_tag: formData.persona_tag,
            voice_type: formData.voice_type,
            submission_notes: formData.submission_notes,
          }
        })
        .select()
        .single();

      if (submissionError) {
        console.error('Submission creation error:', submissionError);
        return NextResponse.json({
          success: false,
          error: 'Failed to create submission record'
        }, { status: 500 });
      }

      // Step 2: Generate HeyGen video (this would use the user's API key)
      let heygenResponse;
      try {
        heygenResponse = await createHeyGenVideoWithKey({
          script: formData.script,
          voice_id: formData.voice_type,
          voice_type: formData.voice_type,
        }, formData.heygen_api_key);
      } catch (heygenError) {
        console.error('HeyGen generation error:', heygenError);
        
        // Update submission status to failed
        await supabase
          .from('avatar_submissions')
          .update({ 
            status: 'rejected',
            rejection_reason: 'HeyGen video generation failed'
          })
          .eq('id', submission.id);

        return NextResponse.json({
          success: false,
          error: 'Failed to generate HeyGen video. Please check your API key and try again.'
        }, { status: 400 });
      }

      // Step 3: Create avatar record
      const avatarData = {
        creator_id: userId,
        image_url: heygenResponse.thumbnail_url || `https://images.unsplash.com/photo-${Date.now()}?w=400&h=400&fit=crop&crop=face`,
        heygen_video_url: heygenResponse.video_url,
        heygen_avatar_id: heygenResponse.video_id,
        script: formData.script,
        persona_tag: formData.persona_tag,
        voice_type: formData.voice_type,
        is_approved: false, // Requires moderation
        is_featured: false,
        submission_notes: formData.submission_notes,
      };

      const { data: avatar, error: avatarError } = await supabase
        .from('niranjan_avatars')
        .insert(avatarData)
        .select()
        .single();

      if (avatarError) {
        console.error('Avatar creation error:', avatarError);
        
        // Update submission status
        await supabase
          .from('avatar_submissions')
          .update({ 
            status: 'rejected',
            rejection_reason: 'Failed to create avatar record'
          })
          .eq('id', submission.id);

        return NextResponse.json({
          success: false,
          error: 'Failed to create avatar record'
        }, { status: 500 });
      }

      // Step 4: Update submission with avatar ID and mark as pending approval
      await supabase
        .from('avatar_submissions')
        .update({ 
          avatar_id: avatar.id,
          status: 'pending',
          processed_at: new Date().toISOString()
        })
        .eq('id', submission.id);

      // Step 5: Log HeyGen usage
      await supabase
        .from('heygen_usage')
        .insert({
          user_id: userId,
          avatar_id: avatar.id,
          api_call_type: 'generate_video',
          tokens_used: 1, // Placeholder - would be actual usage
          cost_usd: 0.10, // Placeholder - would be actual cost
          response_data: heygenResponse
        });

      return NextResponse.json({
        success: true,
        data: {
          submission_id: submission.id,
          avatar_id: avatar.id,
          status: 'pending',
          message: 'Avatar submitted successfully! It will be reviewed before going live.'
        }
      });

    } catch (error) {
      console.error('Avatar submission error:', error);
      return NextResponse.json({
        success: false,
        error: 'Internal server error during avatar submission'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Request parsing error:', error);
    return NextResponse.json({
      success: false,
      error: 'Invalid request format'
    }, { status: 400 });
  }
}

// Get user's submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || '550e8400-e29b-41d4-a716-446655440000';
    const status = searchParams.get('status');

    // Check if supabase is available
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not available'
      }, { status: 500 });
    }

    let query = supabase
      .from('avatar_submissions')
      .select(`
        *,
        niranjan_avatars (
          id,
          image_url,
          heygen_video_url,
          script,
          persona_tag,
          voice_type,
          is_approved,
          is_featured,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: submissions, error } = await query;

    if (error) {
      console.error('Submissions fetch error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch submissions'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: submissions || []
    });

  } catch (error) {
    console.error('Submissions GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}