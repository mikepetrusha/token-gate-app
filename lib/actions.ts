'use server';

import createSupabaseServerClient from './supabase/server';

export const createNote = async (title: string) => {
  const supabase = await createSupabaseServerClient();

  const result = await supabase.from('notes').insert({ title }).single();

  return JSON.stringify(result);
};

export const getNotes = async () => {
  const supabase = await createSupabaseServerClient();

  return await supabase.from('notes').select();
};
